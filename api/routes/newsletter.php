<?php

use App\Http\Request;
use App\Http\Response;
use App\Repositories\NewsletterRepository;

$router->post('/newsletter', function (Request $request, array $params, array $context): void {
    /** @var NewsletterRepository $newsletter */
    $newsletter = $context['repositories']['newsletter'];
    $email = trim((string) ($request->body('email') ?? ''));
    if ($email === '') {
        Response::json(['message' => 'email is required.'], 400);
        return;
    }
    try {
        $newsletter->subscribe($email);
        Response::json(['message' => 'Subscription recorded.'], 201);
    } catch (\Throwable $exception) {
        Response::json(['message' => 'Unable to subscribe', 'error' => $exception->getMessage()], 500);
    }
});
