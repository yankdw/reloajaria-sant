<?php
require_once '../includes/auth.php';

header('Content-Type: application/json');

if (!hasPermission('seller')) {
    echo json_encode(['success' => false, 'message' => 'Acesso negado']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    // Adicionar produto
    $name = $input['name'] ?? '';
    $brand = $input['brand'] ?? '';
    $description = $input['description'] ?? '';
    $price = $input['price'] ?? 0;
    $stock_quantity = $input['stock_quantity'] ?? 0;
    $image_url = $input['image_url'] ?? '';
    
    if (empty($name) || empty($brand) || empty($description) || $price <= 0) {
        echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
        exit();
    }
    
    $stmt = $pdo->prepare("INSERT INTO products (name, brand, description, price, stock_quantity, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    if ($stmt->execute([$name, $brand, $description, $price, $stock_quantity, $image_url, $_SESSION['user_id']])) {
        echo json_encode(['success' => true, 'message' => 'Produto adicionado com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao adicionar produto']);
    }
    
} elseif ($method === 'DELETE') {
    // Deletar produto
    $product_id = $input['id'] ?? 0;
    
    // Verificar se o produto pertence ao vendedor ou se é admin
    if ($_SESSION['user_type'] === 'admin') {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $result = $stmt->execute([$product_id]);
    } else {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ? AND seller_id = ?");
        $result = $stmt->execute([$product_id, $_SESSION['user_id']]);
    }
    
    if ($result && $stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Produto deletado com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Produto não encontrado ou sem permissão']);
    }
}
?>
