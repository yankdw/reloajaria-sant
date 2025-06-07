<?php
session_start();
require_once 'config/database.php';

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
}

function hasPermission($required_type) {
    if (!isLoggedIn()) return false;
    
    if ($required_type === 'admin') {
        return $_SESSION['user_type'] === 'admin';
    } elseif ($required_type === 'seller') {
        return in_array($_SESSION['user_type'], ['admin', 'seller']);
    } elseif ($required_type === 'buyer') {
        return in_array($_SESSION['user_type'], ['admin', 'buyer']);
    }
    
    return false;
}

function getCurrentUser() {
    global $pdo;
    if (!isLoggedIn()) return null;
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
?>
