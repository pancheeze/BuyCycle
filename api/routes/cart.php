<?php

use App\Http\Request;
use App\Http\Response;
use App\Services\CartService;

$cartHandler = function (callable $callback) {
    return function (Request $request, array $params, array $context) use ($callback): void {
        /** @var CartService $cartService */
        $cartService = $context['services']['cart'];
        $user = $context['user'] ?? null;
        $sessionId = $request->header('X-Session-Id');
        try {
            $result = $callback($cartService, $request, $params, $user, $sessionId);
            Response::json($result);
        } catch (\Throwable $exception) {
            $status = $exception->getMessage() === 'Product not found' ? 404 : 400;
            Response::json(['message' => $exception->getMessage()], $status);
        }
    };
};

$router->get('/cart', $cartHandler(function (CartService $service, Request $request, array $params, ?array $user, ?string $sessionId) {
    return $service->getCart($user['userId'] ?? null, $sessionId);
}));

$router->get('/account/cart', $cartHandler(function (CartService $service, Request $request, array $params, ?array $user, ?string $sessionId) {
    return $service->getCart($user['userId'] ?? null, $sessionId);
}), true);

$router->post('/cart/items', $cartHandler(function (CartService $service, Request $request, array $params, ?array $user, ?string $sessionId) {
    $productId = (string) ($request->body('productId') ?? '');
    $quantity = (int) ($request->body('quantity') ?? 1);
    if ($productId === '') {
        throw new \RuntimeException('productId is required.');
    }
    return $service->addItem($user['userId'] ?? null, $sessionId, $productId, $quantity);
}));

$router->post('/account/cart/items', $cartHandler(function (CartService $service, Request $request, array $params, ?array $user, ?string $sessionId) {
    $productId = (string) ($request->body('productId') ?? '');
    $quantity = (int) ($request->body('quantity') ?? 1);
    if ($productId === '') {
        throw new \RuntimeException('productId is required.');
    }
    return $service->addItem($user['userId'] ?? null, $sessionId, $productId, $quantity);
}), true);

$router->patch('/cart/items/:productId', $cartHandler(function (CartService $service, Request $request, array $params, ?array $user, ?string $sessionId) {
    $productId = $params['productId'];
    $quantity = (int) ($request->body('quantity') ?? 0);
    return $service->updateQuantity($user['userId'] ?? null, $sessionId, $productId, $quantity);
}));

$router->patch('/account/cart/items/:productId', $cartHandler(function (CartService $service, Request $request, array $params, ?array $user, ?string $sessionId) {
    $productId = $params['productId'];
    $quantity = (int) ($request->body('quantity') ?? 0);
    return $service->updateQuantity($user['userId'] ?? null, $sessionId, $productId, $quantity);
}), true);

$router->delete('/cart/items/:productId', $cartHandler(function (CartService $service, Request $request, array $params, ?array $user, ?string $sessionId) {
    $productId = $params['productId'];
    return $service->removeItem($user['userId'] ?? null, $sessionId, $productId);
}));

$router->delete('/account/cart/items/:productId', $cartHandler(function (CartService $service, Request $request, array $params, ?array $user, ?string $sessionId) {
    $productId = $params['productId'];
    return $service->removeItem($user['userId'] ?? null, $sessionId, $productId);
}), true);
