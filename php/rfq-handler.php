<?php
/**
 * ISC RFQ handler (Phase 7)
 *
 * Accepts multipart RFQ with line items + attachments.
 *
 * TODO(backend): Connect SMTP / procurement inbox / CRM.
 * TODO(backend): Persist attachments to secure object storage.
 * TODO(backend): Add CSRF token verification when sessions are introduced.
 * TODO(backend): After delivery succeeds, return { "ok": true, "message": "..." }.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$allowedExt = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
$maxBytes = 10 * 1024 * 1024;

$company = trim((string)($_POST['company'] ?? ''));
$contact = trim((string)($_POST['contact_person'] ?? $_POST['contact_name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$industry = trim((string)($_POST['industry'] ?? ''));
$delivery = trim((string)($_POST['delivery_location'] ?? ''));
$docTypes = $_POST['doc_types'] ?? [];

/* TODO(backend): honeypot + rate limiting + CAPTCHA */
$honeypot = trim((string)($_POST['company_website'] ?? ''));
if ($honeypot !== '') {
    http_response_code(200);
    echo json_encode(['ok' => true, 'message' => 'Thank you. Your RFQ has been received.']);
    exit;
}

if ($company === '' || $contact === '' || $email === '' || $phone === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Required fields missing (company, contact person, email, phone).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid email']);
    exit;
}

$products = $_POST['line_product'] ?? [];
if (!is_array($products) || count(array_filter(array_map('trim', array_map('strval', $products)))) < 1) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'At least one line item (product / requirement) is required.']);
    exit;
}

$fileErrors = [];
if (!empty($_FILES['attachments'])) {
    $names = $_FILES['attachments']['name'];
    $sizes = $_FILES['attachments']['size'];
    $errors = $_FILES['attachments']['error'];
    if (!is_array($names)) {
        $names = [$names];
        $sizes = [$sizes];
        $errors = [$errors];
    }
    foreach ($names as $i => $name) {
        if (($errors[$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if (($errors[$i] ?? 0) !== UPLOAD_ERR_OK) {
            $fileErrors[] = 'Upload failed: ' . $name;
            continue;
        }
        $ext = strtolower(pathinfo((string)$name, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExt, true)) {
            $fileErrors[] = 'Unsupported type: ' . $name;
        }
        if (($sizes[$i] ?? 0) > $maxBytes) {
            $fileErrors[] = 'File too large: ' . $name;
        }
    }
}

if ($fileErrors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'File validation failed', 'files' => $fileErrors]);
    exit;
}

// TODO(backend): Compose RFQ email with line items + attachments
// TODO(backend): Store enquiry ID and return confirmation reference

http_response_code(501);
echo json_encode([
    'ok' => false,
    'error' => 'RFQ delivery is not configured yet. [SMTP / STORAGE TO BE PROVIDED]',
    'received' => [
        'company' => $company,
        'contact_person' => $contact,
        'email' => $email,
        'phone' => $phone,
        'industry' => $industry,
        'delivery_location' => $delivery,
        'doc_types' => is_array($docTypes) ? array_values($docTypes) : [],
        'line_count' => is_array($products) ? count($products) : 0,
    ],
]);
