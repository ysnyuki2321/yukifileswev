<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>YukiFiles</title>
	<link rel="stylesheet" href="/assets/css/global.css">
</head>
<body>
	<?php include __DIR__ . '/header.php'; ?>
	<main>
		<?php echo $content ?? ''; ?>
	</main>
	<?php include __DIR__ . '/footer.php'; ?>
	<script src="/assets/js/main.js"></script>
</body>
</html>
