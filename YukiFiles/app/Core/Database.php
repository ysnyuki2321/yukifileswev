<?php
declare(strict_types=1);

namespace App\Core;

use PDO;

final class Database
{
	private static ?PDO $pdo = null;

	public static function init(array $config): void
	{
		if (($config['connection'] ?? 'sqlite') === 'sqlite') {
			$dir = dirname($config['database']);
			if (!is_dir($dir)) { mkdir($dir, 0777, true); }
			self::$pdo = new PDO('sqlite:' . $config['database']);
			self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			self::migrate();
		}
	}

	public static function pdo(): PDO
	{
		return self::$pdo;
	}

	private static function migrate(): void
	{
		$sql = [
			"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, uuid TEXT UNIQUE, email TEXT UNIQUE, password TEXT, role TEXT, quota_bytes INTEGER, used_bytes INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT)",
			"CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, user_uuid TEXT, path TEXT, name TEXT, size INTEGER, mime TEXT, is_public INTEGER DEFAULT 0, created_at TEXT)",
			"CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_uuid TEXT, provider TEXT, tx_id TEXT, amount_cents INTEGER, currency TEXT, status TEXT, meta TEXT, created_at TEXT)",
			"CREATE TABLE IF NOT EXISTS subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_uuid TEXT, plan TEXT, status TEXT, renews_at TEXT, created_at TEXT)",
			"CREATE TABLE IF NOT EXISTS ip_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_uuid TEXT, ip TEXT, fingerprint TEXT, vpn_score REAL, details TEXT, created_at TEXT)"
		];
		foreach ($sql as $stmt) {
			self::$pdo->exec($stmt);
		}
	}
}
