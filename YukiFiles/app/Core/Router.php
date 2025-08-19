<?php
declare(strict_types=1);

namespace App\Core;

final class Router
{
	private array $routes = [];

	public function get(string $path, array $handler): void { $this->routes['GET'][$path] = $handler; }
	public function post(string $path, array $handler): void { $this->routes['POST'][$path] = $handler; }

	public function dispatch(Request $request): array
	{
		$method = $request->method();
		$uri = $request->path();
		$handler = $this->routes[$method][$uri] ?? null;
		if (!$handler) {
			http_response_code(404);
			echo 'Not Found';
			exit;
		}
		return [$handler[0], $handler[1], []];
	}
}
