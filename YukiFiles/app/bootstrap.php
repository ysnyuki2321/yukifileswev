<?php
declare(strict_types=1);

use App\Core\Config;
use App\Core\Database;
use App\Core\Session;
use App\Services\UserService;

\Dotenv\Dotenv::createImmutable(dirname(__DIR__))->safeLoad();

Config::init([
	'app_env' => $_ENV['APP_ENV'] ?? 'local',
	'app_debug' => (bool)($_ENV['APP_DEBUG'] ?? true),
	'log_path' => $_ENV['LOG_PATH'] ?? dirname(__DIR__) . '/storage/logs/app.log',
]);

Database::init([ 
	'connection' => $_ENV['DB_CONNECTION'] ?? 'sqlite',
	'database' => $_ENV['DB_DATABASE'] ?? dirname(__DIR__) . '/storage/database.sqlite',
]);

Session::init($_ENV['SESSION_DRIVER'] ?? 'file', $_ENV['SESSION_PATH'] ?? (dirname(__DIR__) . '/storage/sessions'));

UserService::bootstrapDefaultAdmin(
	$_ENV['ADMIN_EMAIL'] ?? 'admin@example.com',
	$_ENV['ADMIN_PASSWORD'] ?? 'password'
);
