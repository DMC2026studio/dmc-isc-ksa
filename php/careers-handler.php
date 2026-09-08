<?php
/**
 * ISC careers application handler (Phase 7)
 *
 * Validates general application + optional CV upload.
 *
 * TODO(backend): Connect HR inbox / ATS / storage for CV files.
 * TODO(backend): Virus-scan uploaded CVs before persistence.
 * TODO(backend): Add CSRF token verification when sessions are introduced.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$allowedExt = ['pdf', 'doc', 'docx'];
$maxBytes = 10 * 1024 * 1024;

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$position = trim((string)($_POST['position'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

/* TODO(backend): honeypot + rate limiting + CAPTCHA */
$honeypot = trim((string)($_POST['company_website'] ?? ''));
if ($honeypot !== '') {
    http_response_code(200);
    echo json_encode(['ok' => true, 'message' => 'Thank you. Your application has been received.']);
    exit;
}

if ($name === '' || $email === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Required fields missing (name, email).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

$fileErrors = [];
if (!empty($_FILES['cv'])) {
    $file = $_FILES['cv'];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        if (($file['error'] ?? 0) !== UPLOAD_ERR_OK) {
            $fileErrors[] = 'CV upload failed.';
        } else {
            $ext = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, $allowedExt, true)) {
                $fileErrors[] = 'CV must be PDF, DOC or DOCX.';
            }
            if (($file['size'] ?? 0) > $maxBytes) {
                $fileErrors[] = 'CV exceeds 10MB limit.';
            }
        }
    }
}

if ($fileErrors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'CV validation failed', 'files' => $fileErrors]);
    exit;
}

// TODO(backend): move_uploaded_file(...) to secure storage
// TODO(backend): notify HR mailbox / ATS webhook
// TODO(backend): return ['ok' => true, 'message' => 'Application received.']

http_response_code(501);
echo json_encode([
    'ok' => false,
    'error' => 'Application delivery is not configured yet. [SMTP / ATS TO BE PROVIDED]',
    'received' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'position' => $position,
        'has_cv' => !empty($_FILES['cv']) && ($_FILES['cv']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK,
    ],
]);
