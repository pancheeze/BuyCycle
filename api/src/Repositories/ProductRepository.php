<?php

namespace App\Repositories;

use PDO;

final class ProductRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function all(): array
    {
        $stmt = $this->pdo->query(
            'SELECT product_id AS id,
                    name,
                    brand,
                    description,
                    price,
                    rating,
                    image_url AS image,
                    category_id AS category
             FROM products
             ORDER BY created_at DESC'
        );
        return $stmt->fetchAll();
    }

    public function findById(string $productId): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT product_id AS id,
                    name,
                    brand,
                    description,
                    price,
                    rating,
                    image_url AS image,
                    category_id AS category
             FROM products
             WHERE product_id = :id
             LIMIT 1'
        );
        $stmt->execute(['id' => $productId]);
        $product = $stmt->fetch();
        return $product ?: null;
    }
}
