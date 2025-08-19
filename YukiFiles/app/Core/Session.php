<?php
declare(strict_types=1);

namespace App\Core;

final class Session
{
	public static function init(string $driver, string $path): void
	{
		if ($driver === 'file') {
			if (!is_dir($path)) {
				mkdir($path, 0777, true);
			}
			session_save_path($path);
		}
		if (session_status() === PHP_SESSION_NONE) {
			session_start();
		}
	}
}
