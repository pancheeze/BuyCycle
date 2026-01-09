<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

use App\Config;
use App\Database;
use App\Http\Request;
use App\Http\Response;
use App\Repositories\CartRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\NewsletterRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UserRepository;
use App\Router;
use App\Services\AuthService;
use App\Services\CartService;

define('BUY_CYCLE_QUERY_ROUTE_PARAMS', ['route', 'path']);

handleCors();

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$pdo = Database::connection();

$productRepository = new ProductRepository($pdo);
$categoryRepository = new CategoryRepository($pdo);
$newsletterRepository = new NewsletterRepository($pdo);
$userRepository = new UserRepository($pdo);
$cartRepository = new CartRepository($pdo);

$cartService = new CartService($cartRepository, $productRepository);
$authService = new AuthService($userRepository, $cartService);

$router = new Router($authService, [
    'repositories' => [
        'products' => $productRepository,
        'categories' => $categoryRepository,
        'newsletter' => $newsletterRepository,
    ],
    'services' => [
        'cart' => $cartService,
        'auth' => $authService,
    ],
]);

registerRoutes($router);

$request = createRequest();
$router->dispatch($request);

function createRequest(): Request
{
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = '/';

    foreach (BUY_CYCLE_QUERY_ROUTE_PARAMS as $param) {
        $candidate = $_GET[$param] ?? null;
        if (is_string($candidate) && $candidate !== '') {
            $path = '/' . ltrim($candidate, '/');
            break;
        }
    }

    if ($path === '/') {
        $path = normalisePathFromUri($uri);
    }

    $prefix = '/api';
    if ($prefix !== '/' && str_starts_with($path, $prefix)) {
        $path = substr($path, strlen($prefix));
        if ($path === '' || $path === false) {
            $path = '/';
        } elseif ($path[0] !== '/') {
            $path = '/' . $path;
        }
    }

    $headers = getallheadersFallback();
    $rawBody = file_get_contents('php://input') ?: '';

    $query = $_GET;
    foreach (BUY_CYCLE_QUERY_ROUTE_PARAMS as $param) {
        unset($query[$param]);
    }

    return new Request($_SERVER['REQUEST_METHOD'] ?? 'GET', $path, $query, $headers, $rawBody);
}

function normalisePathFromUri(string $uri): string
{
    $path = rtrim($uri, '/') ?: '/';

    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $normalizedScript = $scriptName !== '' ? str_replace('\\', '/', $scriptName) : '';
    $scriptDir = $normalizedScript !== '' ? rtrim(dirname($normalizedScript), '/') : '';

    if ($normalizedScript !== '' && str_starts_with($path, $normalizedScript)) {
        $path = substr($path, strlen($normalizedScript));
    } elseif ($scriptDir !== '' && str_starts_with($path, $scriptDir)) {
        $path = substr($path, strlen($scriptDir));
    }

    if ($path === '' || $path === false) {
        return '/';
    }

    $path = $path[0] === '/' ? $path : '/' . $path;

    if ($path !== '/' && str_ends_with($path, '/index.php')) {
        $path = substr($path, 0, -10) ?: '/';
    }

    return $path === '' ? '/' : $path;
}

function registerRoutes(Router $router): void
{
    $routesDir = dirname(__DIR__) . '/routes';
    foreach (glob($routesDir . '/*.php') as $file) {
        require $file;
    }
}

function getallheadersFallback(): array
{
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        return is_array($headers) ? $headers : [];
    }

    $headers = [];
    foreach ($_SERVER as $key => $value) {
        if (!is_string($key) || !str_starts_with($key, 'HTTP_')) {
            continue;
        }
        $name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))));
        $headers[$name] = $value;
    }

    return $headers;
}

function handleCors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    $allowed = Config::getCorsOrigins();

    if (empty($allowed) || $origin === '*' || in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . ($origin === '*' ? '*' : $origin));
    } elseif (!empty($allowed)) {
        header('Access-Control-Allow-Origin: ' . $allowed[0]);
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-Id');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
}
