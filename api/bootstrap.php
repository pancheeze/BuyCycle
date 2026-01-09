<?php

declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL);

define('BASE_PATH', __DIR__);

autoload();

use App\Support\Env;

$envPath = BASE_PATH . DIRECTORY_SEPARATOR . '.env';
if (!is_file($envPath)) {
    $envPath = BASE_PATH . DIRECTORY_SEPARATOR . '.env.example';
}

Env::load($envPath);

function autoload(): void
{
    spl_autoload_register(static function (string $class): void {
        if (!str_starts_with($class, 'App\\')) {
            return;
        }
        $relative = substr($class, 4);
        $relative = str_replace('\\', DIRECTORY_SEPARATOR, $relative);
        $file = BASE_PATH . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . $relative . '.php';
        if (is_file($file)) {
            require_once $file;
        }
    });
}
