<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Response;
use App\Services\PaymentService;

final class PaymentController
{
	public function selectPlan(): Response
	{
		return new Response('<h2>Choose a plan</h2><a href="/checkout?plan=paid">Upgrade $1/month</a>');
	}

	public function checkout(): Response
	{
		$service = new PaymentService();
		$order = $service->createPaypalOrder(100, 'USD');
		return new Response('<h2>Checkout</h2><pre>' . htmlspecialchars(json_encode($order, JSON_PRETTY_PRINT)) . '</pre>');
	}
}
