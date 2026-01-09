<?php

namespace App\Services;

use App\Repositories\CartRepository;
use App\Repositories\ProductRepository;
use Exception;

final class CartService
{
    public function __construct(
        private readonly CartRepository $carts,
        private readonly ProductRepository $products
    ) {
    }

    /**
     * @return array{cart:?array,sessionId:?string}
     */
    public function getCart(?int $userId, ?string $sessionId): array
    {
        $cart = null;
        if ($userId !== null) {
            $cart = $this->carts->findByUserId($userId);
        }
        if ($cart === null && $sessionId) {
            $cart = $this->carts->findBySessionId($sessionId);
        }

        if ($cart === null) {
            if ($userId !== null) {
                $cart = $this->carts->createForUser($userId);
            } else {
                $sessionId = $sessionId ?: self::generateSessionId();
                $cart = $this->carts->createForSession($sessionId);
            }
        }

        $items = $this->carts->getItems($cart['cart_id']);
        $resolvedSession = $cart['session_id'] ?? ($userId === null ? $sessionId : null);
        return [
            'cart' => $this->formatCart($cart, $items),
            'sessionId' => $resolvedSession,
        ];
    }

    public function addItem(?int $userId, ?string $sessionId, string $productId, int $quantity): array
    {
        $quantity = max(1, $quantity);
        [$cart, $session] = $this->ensureCart($userId, $sessionId);
        $product = $this->products->findById($productId);
        if (!$product) {
            throw new Exception('Product not found');
        }
        $this->carts->addOrIncrementItem($cart['cart_id'], $productId, $quantity, (float) $product['price']);
        $cart = $this->carts->findById($cart['cart_id']) ?? $cart;
        $items = $this->carts->getItems($cart['cart_id']);
        return [
            'cart' => $this->formatCart($cart, $items),
            'sessionId' => $session,
        ];
    }

    public function updateQuantity(?int $userId, ?string $sessionId, string $productId, int $quantity): array
    {
        [$cart, $session] = $this->ensureCart($userId, $sessionId);
        if ($quantity <= 0) {
            $this->carts->removeItem($cart['cart_id'], $productId);
        } else {
            $this->carts->updateQuantity($cart['cart_id'], $productId, $quantity);
        }
        $cart = $this->carts->findById($cart['cart_id']) ?? $cart;
        $items = $this->carts->getItems($cart['cart_id']);
        return [
            'cart' => $this->formatCart($cart, $items),
            'sessionId' => $session,
        ];
    }

    public function removeItem(?int $userId, ?string $sessionId, string $productId): array
    {
        [$cart, $session] = $this->ensureCart($userId, $sessionId);
        $this->carts->removeItem($cart['cart_id'], $productId);
        $cart = $this->carts->findById($cart['cart_id']) ?? $cart;
        $items = $this->carts->getItems($cart['cart_id']);
        return [
            'cart' => $this->formatCart($cart, $items),
            'sessionId' => $session,
        ];
    }

    public function mergeGuestCart(?string $sessionId, int $userId): void
    {
        if (!$sessionId) {
            return;
        }
        $guestCart = $this->carts->findBySessionId($sessionId);
        if (!$guestCart) {
            return;
        }
        $userCart = $this->carts->findByUserId($userId);
        if ($userCart === null) {
            $this->carts->assignUser($guestCart['cart_id'], $userId);
            return;
        }
        if ($guestCart['cart_id'] === $userCart['cart_id']) {
            $this->carts->detachSession($guestCart['cart_id']);
            return;
        }
        $items = $this->carts->getItems($guestCart['cart_id']);
        foreach ($items as $item) {
            $this->carts->addOrIncrementItem(
                $userCart['cart_id'],
                $item['product_id'],
                (int) $item['quantity'],
                (float) $item['unit_price']
            );
        }
        $this->carts->deleteCart($guestCart['cart_id']);
    }

    /**
     * @return array{0:array,1:?string}
     */
    private function ensureCart(?int $userId, ?string $sessionId): array
    {
        $result = $this->getCart($userId, $sessionId);
        if (!isset($result['cart']['id'])) {
            throw new Exception('Unable to resolve cart');
        }
        $cartRow = $this->carts->findById($result['cart']['id']);
        if ($cartRow === null) {
            throw new Exception('Cart not found');
        }
        return [$cartRow, $result['sessionId']];
    }

    private function formatCart(array $cart, array $items): array
    {
        $total = 0;
        $formattedItems = [];
        foreach ($items as $item) {
            $lineTotal = (float) $item['unit_price'] * (int) $item['quantity'];
            $total += $lineTotal;
            $formattedItems[] = [
                'productId' => $item['product_id'],
                'name' => $item['name'],
                'image' => $item['image_url'],
                'price' => (float) $item['unit_price'],
                'quantity' => (int) $item['quantity'],
            ];
        }
        return [
            'id' => $cart['cart_id'],
            'status' => $cart['status'],
            'sessionId' => $cart['session_id'],
            'userId' => $cart['user_id'],
            'items' => $formattedItems,
            'total' => $total,
        ];
    }

    private static function generateSessionId(): string
    {
        return bin2hex(random_bytes(16));
    }
}
