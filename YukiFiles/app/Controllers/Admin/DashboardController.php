<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\Database;
use App\Core\Response;

final class DashboardController
{
	public function index(): Response
	{
		if (($_SESSION['user_role'] ?? '') !== 'admin') {
			return new Response('Forbidden', 403);
		}
		$pdo = Database::pdo();
		$totalUsers = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
		$totalFiles = (int)$pdo->query('SELECT COUNT(*) FROM files')->fetchColumn();
		$html = '<h2>Admin Dashboard</h2>'
			. '<p>Users: ' . $totalUsers . '</p>'
			. '<p>Files: ' . $totalFiles . '</p>'
			. '<p><a href="/admin/settings">Settings</a> · <a href="/admin/transactions">Transactions</a></p>';
		return new Response($html);
	}
}
