<?php

use App\Http\Request;
use App\Http\Response;
use App\Database;

$router->get('/health', function (Request $request) {
    try {
        $pdo = Database::connection();
        $pdo->query('SELECT 1');
        Response::json(['status' => 'ok', 'timestamp' => date(DATE_ATOM)]);
    } catch (\Throwable $exception) {
        Response::json(['status' => 'error', 'message' => $exception->getMessage()], 500);
    }
});
