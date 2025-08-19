<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Response;

final class HomeController
{
	public function landing(): Response
	{
		$html = '<!doctype html><html><head><meta charset="utf-8"><title>YukiFiles</title></head><body><h1>YukiFiles</h1><p>Modern file upload & sharing.</p><p><a href="/login">Login</a> · <a href="/register">Register</a></p></body></html>';
		return new Response($html);
	}
}
