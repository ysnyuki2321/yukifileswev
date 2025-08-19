<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\Response;

final class SettingsController
{
	private string $file;

	public function __construct()
	{
		$this->file = dirname(__DIR__, 3) . '/storage/settings.json';
	}

	public function show(): Response
	{
		if (($_SESSION['user_role'] ?? '') !== 'admin') {
			return new Response('Forbidden', 403);
		}
		$settings = is_file($this->file) ? json_decode((string)file_get_contents($this->file), true) : [];
		$html = '<h2>Settings</h2>'
			. '<form method="post">'
			. '<h3>PayPal</h3>'
			. '<input name="paypal_client_id" placeholder="Client ID" value="' . htmlspecialchars($settings['paypal_client_id'] ?? '') . '">' 
			. '<input name="paypal_client_secret" placeholder="Client Secret" value="' . htmlspecialchars($settings['paypal_client_secret'] ?? '') . '">' 
			. '<h3>Crypto (BlockCypher)</h3>'
			. '<input name="blockcypher_token" placeholder="API Token" value="' . htmlspecialchars($settings['blockcypher_token'] ?? '') . '">' 
			. '<input name="crypto_addresses" placeholder="Comma addresses (btc,ltc,eth)" value="' . htmlspecialchars($settings['crypto_addresses'] ?? '') . '">' 
			. '<button type="submit">Save</button>'
			. '</form>';
		return new Response($html);
	}

	public function save(): Response
	{
		if (($_SESSION['user_role'] ?? '') !== 'admin') {
			return new Response('Forbidden', 403);
		}
		$payload = [
			'paypal_client_id' => trim($_POST['paypal_client_id'] ?? ''),
			'paypal_client_secret' => trim($_POST['paypal_client_secret'] ?? ''),
			'blockcypher_token' => trim($_POST['blockcypher_token'] ?? ''),
			'crypto_addresses' => trim($_POST['crypto_addresses'] ?? ''),
		];
		if (!is_dir(dirname($this->file))) { mkdir(dirname($this->file), 0777, true); }
		file_put_contents($this->file, json_encode($payload, JSON_PRETTY_PRINT));
		return new Response('Saved. <a href="/admin/settings">Back</a>');
	}
}
