<?php

namespace App;

use App\Http\Request;
use App\Http\Response;
use App\Services\AuthService;

final class Router
{
    /** @var array<int, array{method:string,pattern:string,regex:string,variables:array<int,string>,handler:callable,auth:bool}> */
    private array $routes = [];

    public function __construct(private readonly AuthService $authService, private readonly array $context = [])
    {
    }

    public function get(string $pattern, callable $handler, bool $requiresAuth = false): void
    {
        $this->add('GET', $pattern, $handler, $requiresAuth);
    }

    public function post(string $pattern, callable $handler, bool $requiresAuth = false): void
    {
        $this->add('POST', $pattern, $handler, $requiresAuth);
    }

    public function patch(string $pattern, callable $handler, bool $requiresAuth = false): void
    {
        $this->add('PATCH', $pattern, $handler, $requiresAuth);
    }

    public function delete(string $pattern, callable $handler, bool $requiresAuth = false): void
    {
        $this->add('DELETE', $pattern, $handler, $requiresAuth);
    }

    private function add(string $method, string $pattern, callable $handler, bool $requiresAuth): void
    {
        [$regex, $variables] = $this->compilePattern($pattern);
        $this->routes[] = [
            'method' => strtoupper($method),
            'pattern' => $pattern,
            'regex' => $regex,
            'variables' => $variables,
            'handler' => $handler,
            'auth' => $requiresAuth,
        ];
    }

    public function dispatch(Request $request): void
    {
        $method = strtoupper($request->method());
        $path = $request->path();

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }
            if (!preg_match($route['regex'], $path, $matches)) {
                continue;
            }

            $params = [];
            foreach ($route['variables'] as $variable) {
                if (isset($matches[$variable])) {
                    $params[$variable] = $matches[$variable];
                }
            }

            $user = null;
            if ($route['auth']) {
                $user = $this->authService->authenticate($request);
                if ($user === null) {
                    Response::json(['message' => 'Unauthorized'], 401);
                    return;
                }
            }

            $context = $this->context;
            if ($user !== null) {
                $context['user'] = $user;
            }

            call_user_func($route['handler'], $request, $params, $context);
            return;
        }

        Response::json(['message' => 'Not Found'], 404);
    }

    /**
     * @return array{string,array<int,string>}
     */
    private function compilePattern(string $pattern): array
    {
        $variables = [];
        $regex = preg_replace_callback('#:([a-zA-Z][a-zA-Z0-9_]*)#', function ($matches) use (&$variables) {
            $variables[] = $matches[1];
            return '(?P<' . $matches[1] . '>[^/]+)';
        }, $pattern);
        $regex = '#^' . $regex . '$#';
        return [$regex, $variables];
    }
}
