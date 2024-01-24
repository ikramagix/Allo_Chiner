<?php
require_once 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$API_KEY = $_ENV['API_KEY'];

header('Content-Type: application/json');
echo json_encode($_ENV);
?>