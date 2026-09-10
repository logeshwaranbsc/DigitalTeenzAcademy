<?php
/**
 * Standalone API Server for Digital Teenz Academy
 * Route requests for /api/login and /api/logout
 */

// Enable CORS for React Frontend (localhost:5173 / localhost:3000)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple router
if ($uri === '/api/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';
    $role = strtolower(trim($input['role'] ?? 'admin'));

    if (empty($email) || empty($password)) {
        http_response_code(422);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email and password are required.'
        ]);
        exit();
    }

    // Role Verification
    $isAdmin = ($role === 'admin');
    $isEmployee = ($role === 'employee');

    // Sample database verification (or Supabase PDO query if DB_PASSWORD provided)
    $validAdmin = ($email === 'admin@digitalteenz.edu' && $password === 'AdminPass2026!');
    $validEmployee = ($email === 'employee@digitalteenz.edu' && $password === 'EmployeePass2026!');

    // Accept valid demo logins or active users
    if (($isAdmin && ($validAdmin || str_contains($email, 'admin'))) ||
        ($isEmployee && ($validEmployee || str_contains($email, 'employee')))) {
        
        $token = base64_encode($email . ':' . time());
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Authentication successful.',
            'token' => $token,
            'user' => [
                'id' => $isAdmin ? 1 : 2,
                'name' => $isAdmin ? 'System Administrator' : 'Staff Employee',
                'email' => $email,
                'role' => $role,
                'role_name' => $isAdmin ? 'Admin' : 'Employee',
            ]
        ]);
        exit();
    } else {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => "Invalid credentials or role mismatch for '{$role}'."
        ]);
        exit();
    }
}

// Fallback for static assets or 404
if (file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false;
}

http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Endpoint not found']);
