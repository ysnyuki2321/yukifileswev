<?php
declare(strict_types=1);

namespace App\Core;

final class Application
{
	private string $basePath;
	private Router $router;

	public function __construct(string $basePath)
	{
		$this->basePath = rtrim($basePath, '/');
		$this->router = new Router();
	}

	public function router(): Router
	{
		return $this->router;
	}

	public function run(): void
	{
		[$controller, $method, $params] = $this->router->dispatch(Request::capture());
		$response = call_user_func_array([new $controller, $method], $params);
		if ($response instanceof Response) {
			$response->send();
			return;
		}
		echo (string)$response;
	}
}
