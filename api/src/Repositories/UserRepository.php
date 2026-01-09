<?php

namespace App\Repositories;

use App\Database;
use PDO;

final class UserRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function findById(int $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE user_id = :id LIMIT 1');
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function create(string $email, string $fullName, ?string $phone, string $passwordHash): array
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO users (email, full_name, phone, password_hash) VALUES (:email, :name, :phone, :hash)'
        );
        $stmt->execute([
            'email' => $email,
            'name' => $fullName,
            'phone' => $phone,
            'hash' => $passwordHash,
        ]);

        $id = (int) $this->pdo->lastInsertId();
        return $this->findById($id);
    }

    public function updateLastLogin(int $userId): void
    {
        $stmt = $this->pdo->prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = :id');
        $stmt->execute(['id' => $userId]);
    }
}
