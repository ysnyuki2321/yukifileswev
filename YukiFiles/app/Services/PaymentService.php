<?php
declare(strict_types=1);

namespace App\Services;

use GuzzleHttp\Client;

final class PaymentService
{
	private Client $http;

	public function __construct()
	{
		$this->http = new Client(['timeout' => 10]);
	}

	public function createPaypalOrder(int $amountCents, string $currency = 'USD'): array
	{
		return ['id' => 'stub-paypal-order', 'amount' => $amountCents, 'currency' => $currency];
	}

	public function verifyPaypalWebhook(array $payload): bool
	{
		return true; // TODO: implement
	}

	public function watchCryptoPayment(string $chain, string $address): array
	{
		return ['status' => 'pending', 'address' => $address, 'chain' => $chain];
	}
}
