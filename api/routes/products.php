<?php

use App\Http\Request;
use App\Http\Response;
use App\Repositories\ProductRepository;
use App\Repositories\CategoryRepository;

$router->get('/products', function (Request $request, array $params, array $context): void {
    /** @var ProductRepository $products */
    $products = $context['repositories']['products'];
    try {
        $payload = $products->all();
        Response::json($payload);
    } catch (\Throwable $exception) {
        Response::json(['message' => 'Unable to load products', 'error' => $exception->getMessage()], 500);
    }
});

$router->get('/products/categories', function (Request $request, array $params, array $context): void {
    /** @var CategoryRepository $categories */
    $categories = $context['repositories']['categories'];
    try {
        $payload = $categories->all();
        Response::json($payload);
    } catch (\Throwable $exception) {
        Response::json(['message' => 'Unable to load categories', 'error' => $exception->getMessage()], 500);
    }
});
