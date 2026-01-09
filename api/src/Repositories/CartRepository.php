<?php

namespace App\Repositories;

use PDO;

final class CartRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function findByUserId(int $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM carts WHERE user_id = :user ORDER BY updated_at DESC LIMIT 1');
        $stmt->execute(['user' => $userId]);
        $cart = $stmt->fetch();
        return $cart ?: null;
    }

    public function findBySessionId(string $sessionId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM carts WHERE session_id = :session ORDER BY updated_at DESC LIMIT 1');
        $stmt->execute(['session' => $sessionId]);
        $cart = $stmt->fetch();
        return $cart ?: null;
    }

    public function findById(string $cartId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM carts WHERE cart_id = :cart LIMIT 1');
        $stmt->execute(['cart' => $cartId]);
        $cart = $stmt->fetch();
        return $cart ?: null;
    }

    public function createForUser(int $userId): array
    {
        $stmt = $this->pdo->prepare('INSERT INTO carts (user_id, status) VALUES (:user, "open")');
        $stmt->execute(['user' => $userId]);
        $cart = $this->findByUserId($userId);
        if ($cart === null) {
            throw new \RuntimeException('Failed to create cart for user');
        }
        return $cart;
    }

    public function createForSession(string $sessionId): array
    {
        $stmt = $this->pdo->prepare('INSERT INTO carts (session_id, status) VALUES (:session, "open")');
        $stmt->execute(['session' => $sessionId]);
        $cart = $this->findBySessionId($sessionId);
        if ($cart === null) {
            throw new \RuntimeException('Failed to create cart for session');
        }
        return $cart;
    }

    public function detachSession(string $cartId): void
    {
        $stmt = $this->pdo->prepare('UPDATE carts SET session_id = NULL WHERE cart_id = :cart');
        $stmt->execute(['cart' => $cartId]);
    }

    public function assignUser(string $cartId, int $userId): void
    {
        $stmt = $this->pdo->prepare('UPDATE carts SET user_id = :user, session_id = NULL WHERE cart_id = :cart');
        $stmt->execute(['cart' => $cartId, 'user' => $userId]);
    }

    public function getItems(string $cartId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT ci.product_id, ci.quantity, ci.unit_price, p.name, p.image_url
             FROM cart_items ci
             JOIN products p ON p.product_id = ci.product_id
             WHERE ci.cart_id = :cart'
        );
        $stmt->execute(['cart' => $cartId]);
        return $stmt->fetchAll();
    }

    public function addOrIncrementItem(string $cartId, string $productId, int $quantity, float $unitPrice): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
             VALUES (:cart, :product, :quantity, :price)
             ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)'
        );
        $stmt->execute([
            'cart' => $cartId,
            'product' => $productId,
            'quantity' => $quantity,
            'price' => $unitPrice,
        ]);
    }

    public function updateQuantity(string $cartId, string $productId, int $quantity): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE cart_items SET quantity = :quantity WHERE cart_id = :cart AND product_id = :product'
        );
        $stmt->execute([
            'cart' => $cartId,
            'product' => $productId,
            'quantity' => $quantity,
        ]);
    }

    public function removeItem(string $cartId, string $productId): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM cart_items WHERE cart_id = :cart AND product_id = :product');
        $stmt->execute(['cart' => $cartId, 'product' => $productId]);
    }

    public function deleteCart(string $cartId): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM cart_items WHERE cart_id = :cart');
        $stmt->execute(['cart' => $cartId]);
        $stmt = $this->pdo->prepare('DELETE FROM carts WHERE cart_id = :cart');
        $stmt->execute(['cart' => $cartId]);
    }
}
