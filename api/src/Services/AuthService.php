<?php

namespace App\Services;

use App\Config;
use App\Http\Request;
use App\Repositories\UserRepository;
use App\Security\Jwt;
use Exception;

final class AuthService
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly CartService $carts
    ) {
    }

    public function authenticate(Request $request): ?array
    {
        $header = $request->header('Authorization');
        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return null;
        }
        $token = substr($header, 7);
        try {
            $payload = Jwt::decode($token, Config::get('JWT_SECRET', 'development-secret'));
        } catch (Exception) {
            return null;
        }
        $userId = $payload['sub'] ?? null;
        if (!$userId) {
            return null;
        }
        $user = $this->users->findById((int) $userId);
        if (!$user) {
            return null;
        }
        return $this->mapUser($user);
    }

    public function register(array $input, ?string $sessionId): array
    {
        $email = trim((string) ($input['email'] ?? ''));
        $fullName = trim((string) ($input['fullName'] ?? ''));
        $password = (string) ($input['password'] ?? '');
        $phone = trim((string) ($input['phone'] ?? '')) ?: null;

        if ($email === '' || $fullName === '' || $password === '') {
            throw new Exception('email, fullName, and password are required.');
        }

        if ($this->users->findByEmail($email)) {
            throw new Exception('Email already registered.');
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $user = $this->users->create($email, $fullName, $phone, $hash);
        $this->carts->mergeGuestCart($sessionId, (int) $user['user_id']);
        $token = $this->issueToken((int) $user['user_id'], $email);

        return [
            'user' => $this->mapUser($user),
            'token' => $token,
        ];
    }

    public function login(array $input, ?string $sessionId): array
    {
        $email = trim((string) ($input['email'] ?? ''));
        $password = (string) ($input['password'] ?? '');
        if ($email === '' || $password === '') {
            throw new Exception('email and password are required.');
        }
        $user = $this->users->findByEmail($email);
        if (!$user || !password_verify($password, $user['password_hash'] ?? '')) {
            throw new Exception('Invalid credentials.');
        }
        $this->users->updateLastLogin((int) $user['user_id']);
        $this->carts->mergeGuestCart($sessionId, (int) $user['user_id']);
        $token = $this->issueToken((int) $user['user_id'], $email);
        return [
            'user' => $this->mapUser($user),
            'token' => $token,
        ];
    }

    private function issueToken(int $userId, string $email): string
    {
        $ttl = (int) Config::get('TOKEN_TTL', 604800);
        $secret = Config::get('JWT_SECRET', 'development-secret');
        return Jwt::encode(['sub' => $userId, 'email' => $email], $secret, $ttl);
    }

    private function mapUser(array $user): array
    {
        return [
            'userId' => (int) $user['user_id'],
            'email' => $user['email'],
            'fullName' => $user['full_name'],
            'phone' => $user['phone'],
            'accountStatus' => $user['account_status'] ?? 'active',
            'createdAt' => $user['created_at'] ?? null,
        ];
    }
}
