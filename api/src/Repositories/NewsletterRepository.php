<?php

namespace App\Repositories;

use PDO;

final class NewsletterRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function subscribe(string $email): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO newsletter_subscriptions (email)
             VALUES (:email)
             ON DUPLICATE KEY UPDATE subscribed_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute(['email' => $email]);
    }
}
