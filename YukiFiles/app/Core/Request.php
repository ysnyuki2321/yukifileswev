<?php
declare(strict_types=1);

namespace App\Core;

final class Request
{
	public static function capture(): self { return new self; }

	public function method(): string { return $_SERVER['REQUEST_METHOD'] ?? 'GET'; }
	public function path(): string {
		$uri = $_SERVER['REQUEST_URI'] ?? '/';
		$pos = strpos($uri, '?');
		return $pos === false ? $uri : substr($uri, 0, $pos);
	}
}
