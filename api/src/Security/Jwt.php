<?php

namespace App\Security;

use Exception;

final class Jwt
{
    public static function encode(array $payload, string $secret, int $ttl): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $issuedAt = time();
        $payload['iat'] = $payload['iat'] ?? $issuedAt;
        $payload['exp'] = $payload['exp'] ?? ($issuedAt + $ttl);

        $segments = [
            self::base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES)),
            self::base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES)),
        ];
        $signature = hash_hmac('sha256', implode('.', $segments), $secret, true);
        $segments[] = self::base64UrlEncode($signature);
        return implode('.', $segments);
    }

    /**
     * @throws Exception
     */
    public static function decode(string $token, string $secret): array
    {
        $segments = explode('.', $token);
        if (count($segments) !== 3) {
            throw new Exception('Invalid token format');
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $segments;
        $header = json_decode(self::base64UrlDecode($encodedHeader), true);
        $payload = json_decode(self::base64UrlDecode($encodedPayload), true);

        if (!is_array($header) || !is_array($payload)) {
            throw new Exception('Invalid token payload');
        }
        if (($header['alg'] ?? '') !== 'HS256') {
            throw new Exception('Unsupported algorithm');
        }

        $expected = self::base64UrlEncode(hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, $secret, true));
        if (!hash_equals($expected, $encodedSignature)) {
            throw new Exception('Invalid signature');
        }

        $now = time();
        if (isset($payload['nbf']) && $now < (int) $payload['nbf']) {
            throw new Exception('Token not yet valid');
        }
        if (isset($payload['exp']) && $now >= (int) $payload['exp']) {
            throw new Exception('Token expired');
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
