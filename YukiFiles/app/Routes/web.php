<?php
declare(strict_types=1);

use App\Core\Application;
use App\Controllers\HomeController;
use App\Controllers\AuthController;
use App\Controllers\PaymentController;
use App\Controllers\Admin\DashboardController;
use App\Controllers\Admin\SettingsController;

/** @var App\Core\Application $app */
$app = $app ?? new App\Core\Application(dirname(__DIR__, 2));
$router = $app->router();

$router->get('/', [HomeController::class, 'landing']);
$router->get('/login', [AuthController::class, 'showLogin']);
$router->post('/login', [AuthController::class, 'login']);
$router->get('/register', [AuthController::class, 'showRegister']);
$router->post('/register', [AuthController::class, 'register']);
$router->get('/pricing', [PaymentController::class, 'selectPlan']);
$router->get('/checkout', [PaymentController::class, 'checkout']);

// Admin
$router->get('/admin', [DashboardController::class, 'index']);
$router->get('/admin/settings', [SettingsController::class, 'show']);
$router->post('/admin/settings', [SettingsController::class, 'save']);
