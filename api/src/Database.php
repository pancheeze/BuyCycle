<?php

namespace App;

use PDO;
use PDOException;

final class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $host = Config::get('DB_HOST', '127.0.0.1');
        $port = (int) Config::get('DB_PORT', 3306);
        $db = Config::get('DB_NAME', 'buycycle');
        $user = Config::get('DB_USER', 'root');
        $password = Config::get('DB_PASSWORD', '');

        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, $db);
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            self::$connection = new PDO($dsn, $user, $password, $options);
        } catch (PDOException $exception) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['message' => 'Failed to connect to database', 'error' => $exception->getMessage()], JSON_UNESCAPED_SLASHES);
            exit;
        }

        return self::$connection;
    }
}
