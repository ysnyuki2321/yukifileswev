<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Database;
use App\Core\Response;
use Ramsey\Uuid\Uuid;
use App\Services\AntiCloneService;

final class AuthController
{
	public function showLogin(): Response
	{
		$html = '<h2>Login</h2><form method="post">'
			. '<input name="email" type="email" placeholder="Email">'
			. '<input name="password" type="password" placeholder="Password">'
			. '<input name="fingerprint" type="hidden">'
			. '<button type="submit">Login</button>'
			. '</form>'
			. '<script type="module">import {getFingerprint} from "/assets/js/fingerprint.js"; getFingerprint().then(fp=>{const el=document.querySelector("input[name=fingerprint]"); if(el) el.value=fp;});</script>';
		return new Response($html);
	}

	public function showRegister(): Response
	{
		$html = '<h2>Register</h2><form method="post">'
			. '<input name="email" type="email" placeholder="Email">'
			. '<input name="password" type="password" placeholder="Password">'
			. '<input name="fingerprint" type="hidden">'
			. '<button type="submit">Create account</button>'
			. '</form>'
			. '<script type="module">import {getFingerprint} from "/assets/js/fingerprint.js"; getFingerprint().then(fp=>{const el=document.querySelector("input[name=fingerprint]"); if(el) el.value=fp;});</script>';
		return new Response($html);
	}

	public function register(): Response
	{
		$email = trim($_POST['email'] ?? '');
		$password = $_POST['password'] ?? '';
		$fingerprint = $_POST['fingerprint'] ?? '';
		if ($email === '' || $password === '') {
			return new Response('Missing email or password', 400);
		}
		$pdo = Database::pdo();
		$anti = new AntiCloneService();
		$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
		$eval = $anti->evaluateIpAndFingerprint($ip, $fingerprint);
		$log = $pdo->prepare('INSERT INTO ip_logs (user_uuid, ip, fingerprint, vpn_score, details, created_at) VALUES (:uuid,:ip,:fp,:score,:details,:created)');
		$uuid = Uuid::uuid4()->toString();
		$hash = password_hash($password, PASSWORD_DEFAULT);
		$stmt = $pdo->prepare('INSERT INTO users (uuid, email, password, role, quota_bytes, created_at, updated_at) VALUES (:uuid, :email, :password, :role, :quota, :created, :updated)');
		$stmt->execute([
			':uuid' => $uuid,
			':email' => strtolower($email),
			':password' => $hash,
			':role' => 'user',
			':quota' => (int)($_ENV['QUOTA_FREE_BYTES'] ?? 2147483648),
			':created' => date('c'),
			':updated' => date('c'),
		]);
		$log->execute([
			':uuid' => $uuid,
			':ip' => $ip,
			':fp' => $fingerprint,
			':score' => (float)($eval['score'] ?? 0.0),
			':details' => json_encode($eval),
			':created' => date('c'),
		]);
		return new Response('Registered. <a href="/login">Login</a>');
	}

	public function login(): Response
	{
		$email = trim($_POST['email'] ?? '');
		$password = $_POST['password'] ?? '';
		$fingerprint = $_POST['fingerprint'] ?? '';
		$pdo = Database::pdo();
		$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
		$stmt->execute([':email' => strtolower($email)]);
		$user = $stmt->fetch(\PDO::FETCH_ASSOC);
		if (!$user || !password_verify($password, $user['password'])) {
			return new Response('Invalid credentials', 401);
		}
		$anti = new AntiCloneService();
		$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
		$eval = $anti->evaluateIpAndFingerprint($ip, $fingerprint);
		$log = $pdo->prepare('INSERT INTO ip_logs (user_uuid, ip, fingerprint, vpn_score, details, created_at) VALUES (:uuid,:ip,:fp,:score,:details,:created)');
		$log->execute([
			':uuid' => $user['uuid'],
			':ip' => $ip,
			':fp' => $fingerprint,
			':score' => (float)($eval['score'] ?? 0.0),
			':details' => json_encode($eval),
			':created' => date('c'),
		]);
		if (!empty($eval['is_vpn']) && empty($eval['is_residential'])) {
			return new Response('Access denied: VPN/Proxy detected', 403);
		}
		$_SESSION['user_uuid'] = $user['uuid'];
		$_SESSION['user_role'] = $user['role'];
		return new Response('Logged in. <a href="/">Home</a>');
	}
}
