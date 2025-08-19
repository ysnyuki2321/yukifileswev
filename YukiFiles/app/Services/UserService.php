<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use Ramsey\Uuid\Uuid;

final class UserService
{
	public static function bootstrapDefaultAdmin(string $email, string $password): void
	{
		$pdo = Database::pdo();
		$stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
		$stmt->execute([':email' => strtolower($email)]);
		if ($stmt->fetch()) {
			return;
		}
		$uuid = Uuid::uuid4()->toString();
		$hash = password_hash($password, PASSWORD_DEFAULT);
		$insert = $pdo->prepare('INSERT INTO users (uuid, email, password, role, quota_bytes, created_at, updated_at) VALUES (:uuid, :email, :password, :role, :quota, :created, :updated)');
		$insert->execute([
			':uuid' => $uuid,
			':email' => strtolower($email),
			':password' => $hash,
			':role' => 'admin',
			':quota' => (int)($_ENV['QUOTA_PAID_BYTES'] ?? 5368709120),
			':created' => date('c'),
			':updated' => date('c'),
		]);
	}
}
