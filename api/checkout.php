<?php
require_once '../includes/auth.php';

header('Content-Type: application/json');

if (!isLoggedIn() || !hasPermission('buyer')) {
    echo json_encode(['success' => false, 'message' => 'Acesso negado']);
    exit();
}

try {
    $pdo->beginTransaction();
    
    // Buscar itens do carrinho
    $stmt = $pdo->prepare("
        SELECT c.*, p.price, p.stock_quantity 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($cart_items)) {
        throw new Exception('Carrinho vazio');
    }
    
    $total = 0;
    
    // Verificar estoque e calcular total
    foreach ($cart_items as $item) {
        if ($item['quantity'] > $item['stock_quantity']) {
            throw new Exception('Estoque insuficiente para: ' . $item['name']);
        }
        $total += $item['quantity'] * $item['price'];
    }
    
    // Criar pedido
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'confirmed')");
    $stmt->execute([$_SESSION['user_id'], $total]);
    $order_id = $pdo->lastInsertId();
    
    // Adicionar itens do pedido e atualizar estoque
    foreach ($cart_items as $item) {
        // Adicionar item do pedido
        $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->execute([$order_id, $item['product_id'], $item['quantity'], $item['price']]);
        
        // Atualizar estoque
        $stmt = $pdo->prepare("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?");
        $stmt->execute([$item['quantity'], $item['product_id']]);
    }
    
    // Limpar carrinho
    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    
    $pdo->commit();
    
    echo json_encode(['success' => true, 'message' => 'Pedido realizado com sucesso', 'order_id' => $order_id]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
