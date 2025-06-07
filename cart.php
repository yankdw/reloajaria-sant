<?php
require_once 'includes/auth.php';

if (!isLoggedIn() || !hasPermission('buyer')) {
    header('Location: login.php');
    exit();
}

// Buscar itens do carrinho
$stmt = $pdo->prepare("
    SELECT c.*, p.name, p.brand, p.price, p.image_url, p.stock_quantity,
           (c.quantity * p.price) as subtotal
    FROM cart c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
");
$stmt->execute([$_SESSION['user_id']]);
$cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

$total = array_sum(array_column($cart_items, 'subtotal'));
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrinho - SANT</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand fw-bold fs-2" href="index.php">SANT</a>
            <div class="d-flex">
                <a href="index.php" class="btn btn-outline-light">
                    <i class="fas fa-arrow-left me-2"></i>Continuar Comprando
                </a>
            </div>
        </div>
    </nav>

    <div class="container py-5 mt-5">
        <div class="row">
            <div class="col-12">
                <h2 class="mb-4">
                    <i class="fas fa-shopping-cart me-2"></i>Meu Carrinho
                </h2>
            </div>
        </div>

        <?php if (empty($cart_items)): ?>
            <div class="row">
                <div class="col-12 text-center">
                    <div class="card">
                        <div class="card-body py-5">
                            <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                            <h4>Seu carrinho está vazio</h4>
                            <p class="text-muted">Adicione alguns produtos incríveis à sua coleção!</p>
                            <a href="index.php" class="btn btn-primary">Explorar Produtos</a>
                        </div>
                    </div>
                </div>
            </div>
        <?php else: ?>
            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <?php foreach ($cart_items as $item): ?>
                                <div class="cart-item">
                                    <div class="row align-items-center">
                                        <div class="col-md-2">
                                            <img src="<?= $item['image_url'] ?>" alt="<?= htmlspecialchars($item['name']) ?>" class="img-fluid rounded">
                                        </div>
                                        <div class="col-md-4">
                                            <h6 class="mb-1"><?= htmlspecialchars($item['name']) ?></h6>
                                            <small class="text-muted"><?= htmlspecialchars($item['brand']) ?></small>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="quantity-controls">
                                                <button type="button" onclick="updateQuantity(<?= $item['product_id'] ?>, <?= $item['quantity'] - 1 ?>)">
                                                    <i class="fas fa-minus"></i>
                                                </button>
                                                <span class="mx-2"><?= $item['quantity'] ?></span>
                                                <button type="button" onclick="updateQuantity(<?= $item['product_id'] ?>, <?= $item['quantity'] + 1 ?>)" 
                                                        <?= $item['quantity'] >= $item['stock_quantity'] ? 'disabled' : '' ?>>
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                            <small class="text-muted d-block">Estoque: <?= $item['stock_quantity'] ?></small>
                                        </div>
                                        <div class="col-md-2 text-end">
                                            <strong>R$ <?= number_format($item['subtotal'], 2, ',', '.') ?></strong>
                                        </div>
                                        <div class="col-md-2 text-end">
                                            <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(<?= $item['product_id'] ?>)">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Resumo do Pedido</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>R$ <?= number_format($total, 2, ',', '.') ?></span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Frete:</span>
                                <span class="text-success">Grátis</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong class="text-primary">R$ <?= number_format($total, 2, ',', '.') ?></strong>
                            </div>
                            <button class="btn btn-primary w-100" onclick="checkout()">
                                <i class="fas fa-credit-card me-2"></i>Finalizar Compra
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
