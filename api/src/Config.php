<?php

namespace App;

use App\Support\Env;

final class Config
{
    public static function get(string $key, mixed $default = null): mixed
    {
        return Env::get($key, $default);
    }

    public static function getCorsOrigins(): array
    {
        $origins = Env::get('CORS_ORIGINS', '') ?? '';
        if ($origins === '') {
            return [];
        }
        return array_values(array_filter(array_map('trim', explode(',', $origins))));
    }
}
