<?php
declare(strict_types=1);

namespace App\Services;

use GuzzleHttp\Client;

final class AntiCloneService
{
	private Client $http;

	public function __construct()
	{
		$this->http = new Client(['timeout' => 8]);
	}

	public function evaluateIpAndFingerprint(string $ip, string $fingerprint): array
	{
		$result = [
			'is_vpn' => false,
			'is_residential' => true,
			'score' => 0.0,
			'provider' => $_ENV['ANTI_VPN_PROVIDER'] ?? 'none',
		];
		// TODO: integrate IPQS or other provider using API key
		return $result;
	}
}
