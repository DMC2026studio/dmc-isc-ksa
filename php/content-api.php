<?php
/**
 * ISC content API stub (Phase 9)
 *
 * Serves content collections in the same JSON shape as content/{locale}/*.json
 * so the frontend can switch from static files to API without redesign.
 *
 * Usage: /php/content-api.php?collection=products&locale=en
 *
 * TODO(backend): Replace file reads with MySQL / WordPress / headless CMS queries.
 * TODO(backend): Add authentication for write endpoints when admin panel exists.
 * TODO(backend): Cache responses (ETag / Redis) for production.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$allowed = [
    'pages',
    'product-categories',
    'products',
    'sector-solutions',
    'manufacturing-technologies',
    'partners',
    'references',
    'documents',
    'careers',
    'news',
];

$collection = preg_replace('/[^a-z0-9\-]/', '', strtolower((string)($_GET['collection'] ?? '')));
$locale = strtolower((string)($_GET['locale'] ?? 'en'));
if (!in_array($locale, ['en', 'ar'], true)) {
    $locale = 'en';
}

if ($collection === '' || !in_array($collection, $allowed, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Unknown or missing collection']);
    exit;
}

/*
 * FILE MODE (current): read from content/{locale}/{collection}.json
 * DB MODE (future): SELECT … WHERE locale = ? AND status IN (…)
 */
$path = dirname(__DIR__) . '/content/' . $locale . '/' . $collection . '.json';

if (!is_readable($path)) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'Collection file not found', 'path' => $collection]);
    exit;
}

$raw = file_get_contents($path);
if ($raw === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Unable to read collection']);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Optional status filter: ?status=published or status=published,pending
if (!empty($_GET['status']) && isset($data['items']) && is_array($data['items'])) {
    $statuses = array_filter(array_map('trim', explode(',', (string)$_GET['status'])));
    $data['items'] = array_values(array_filter(
        $data['items'],
        static function (array $item) use ($statuses): bool {
            return in_array((string)($item['status'] ?? ''), $statuses, true);
        }
    ));
}

$data['ok'] = true;
$data['source'] = 'file'; // TODO(backend): change to 'mysql' | 'wordpress' | 'headless' when connected

echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
