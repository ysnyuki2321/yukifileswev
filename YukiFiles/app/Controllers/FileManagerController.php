<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Response;

final class FileManagerController
{
	public function index(): Response
	{
		return new Response('<h2>File Manager</h2><p>Coming soon.</p>');
	}
}
