<?php
declare(strict_types=1);

use App\Core\Application;

require dirname(__DIR__) . '/vendor/autoload.php';

$app = new Application(dirname(__DIR__));

require dirname(__DIR__) . '/app/bootstrap.php';
require dirname(__DIR__) . '/app/Routes/web.php';

$app->run();
