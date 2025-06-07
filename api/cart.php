<?php
require_once '../includes/auth.php';

header('Content-Type: application/json');

if (!isLoggedIn() || !hasPermission('buyer')) {
    echo json_encode(['success' => false, 'message' => 'Acesso negado']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'count') {
    // Contar itens no carrinho
    $stmt = $pdo->prepare("SELECT SUM(quantity) as count FROM cart WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'count' => (int)($result['count'] ?? 0)
    ]);
    exit();
}

if ($method === 'POST') {
    $action = $input['action'] ?? '';
    $product_id = $input['product_id'] ?? 0;
    
    switch ($action) {
        case 'add':
            // Verificar se produto existe e tem estoque
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND stock_quantity > 0");
            $stmt->execute([$product_id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$product) {
                echo json_encode(['success' => false, 'message' => 'Produto não encontrado ou sem estoque']);
                exit();
            }
            
            // Verificar se já está no carrinho
            $stmt = $pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$_SESSION['user_id'], $product_id]);
            $cart_item = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($cart_item) {
                // Atualizar quantidade
                $new_quantity = $cart_item['quantity'] + 1;
                if ($new_quantity > $product['stock_quantity']) {
                    echo json_encode(['success' => false, 'message' => 'Quantidade excede o estoque disponível']);
                    exit();
                }
                
                $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
                $stmt->execute([$new_quantity, $_SESSION['user_id'], $product_id]);
            } else {
                // Adicionar novo item
                $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)");
                $stmt->execute([$_SESSION['user_id'], $product_id]);
            }
            
            echo json_encode(['success' => true, 'message' => 'Produto adicionado ao carrinho']);
            break;
            
        case 'update':
            $quantity = $input['quantity'] ?? 1;
            
            if ($quantity < 1) {
                echo json_encode(['success' => false, 'message' => 'Quantidade inválida']);
                exit();
            }
            
            // Verificar estoque
            $stmt = $pdo->prepare("SELECT stock_quantity FROM products WHERE id = ?");
            $stmt->execute([$product_id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$product || $quantity > $product['stock_quantity']) {
                echo json_encode(['success' => false, 'message' => 'Quantidade excede o estoque disponível']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$quantity, $_SESSION['user_id'], $product_id]);
            
            echo json_encode(['success' => true, 'message' => 'Quantidade atualizada']);
            break;
            
        case 'remove':
            $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$_SESSION['user_id'], $product_id]);
            
            echo json_encode(['success' => true, 'message' => 'Item removido do carrinho']);
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Ação inválida']);
    }
}
?>
