<?php

use App\Http\Request;
use App\Http\Response;
use App\Services\AuthService;

$router->post('/auth/signup', function (Request $request, array $params, array $context): void {
    /** @var AuthService $auth */
    $auth = $context['services']['auth'];
    try {
        $result = $auth->register($request->body(), $request->header('X-Session-Id'));
        Response::json($result, 201);
    } catch (\Throwable $exception) {
        $status = $exception->getMessage() === 'Email already registered.' ? 409 : 400;
        Response::json(['message' => $exception->getMessage()], $status);
    }
});

$router->post('/auth/login', function (Request $request, array $params, array $context): void {
    /** @var AuthService $auth */
    $auth = $context['services']['auth'];
    try {
        $result = $auth->login($request->body(), $request->header('X-Session-Id'));
        Response::json($result);
    } catch (\Throwable $exception) {
        $message = $exception->getMessage();
        $status = $message === 'Invalid credentials.' ? 401 : 400;
        Response::json(['message' => $message], $status);
    }
});
