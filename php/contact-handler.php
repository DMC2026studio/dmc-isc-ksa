<?php
/**
 * ISC contact enquiry handler (Phase 7)
 *
 * Validates general enquiry POST and returns JSON.
 *
 * TODO(backend): Connect SMTP / ticketing / CRM here.
 * TODO(backend): Add CSRF token verification when sessions are introduced.
 * TODO(backend): Persist enquiry to storage or forward to operations inbox.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$name = trim((string)($_POST['name'] ?? ''));
$company = trim((string)($_POST['company'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

/* TODO(backend): honeypot + rate limiting + CAPTCHA */
$honeypot = trim((string)($_POST['company_website'] ?? ''));
if ($honeypot !== '') {
    http_response_code(200);
    echo json_encode(['ok' => true, 'message' => 'Thank you. Your message has been received.']);
    exit;
}
if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Required fields missing (name, email, message).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

// TODO(backend): mail($to, $subject, $body, $headers) or API call
// TODO(backend): return ['ok' => true, 'message' => '...'] after successful delivery

http_response_code(501);
echo json_encode([
    'ok' => false,
    'error' => 'Enquiry delivery is not configured yet. [SMTP / API TO BE PROVIDED]',
    'received' => [
        'name' => $name,
        'company' => $company,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
    ],
]);
