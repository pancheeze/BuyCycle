<?php

namespace App\Repositories;

use PDO;

final class CategoryRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function all(): array
    {
        $stmt = $this->pdo->query(
            'SELECT category_id AS value,
                    label,
                    badge,
                    product_count,
                    display_order
             FROM categories
             ORDER BY display_order ASC'
        );
        return $stmt->fetchAll();
    }
}
