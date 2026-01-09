<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

use App\Database;
use PDO;
use PDOStatement;
use Throwable;

function db(): PDO
{
	return Database::connection();
}

function executeQuery(string $sql, array $params = []): PDOStatement
{
	$pdo = db();
	$statement = $pdo->prepare($sql);
	$statement->execute($params);
	return $statement;
}

function fetchAll(string $sql, array $params = []): array
{
	try {
		return executeQuery($sql, $params)->fetchAll();
	} catch (Throwable) {
		return [];
	}
}

function fetchOne(string $sql, array $params = []): ?array
{
	try {
		$result = executeQuery($sql, $params)->fetch();
		return $result !== false ? $result : null;
	} catch (Throwable) {
		return null;
	}
}

?>