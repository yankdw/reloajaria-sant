<?php
require_once 'includes/auth.php';

$product_id = $_GET['id'] ?? 0;

// Buscar produto
$stmt = $pdo->prepare("
    SELECT p.*, u.full_name as seller_name 
    FROM products p 
    LEFT JOIN users u ON p.seller_id = u.id 
    WHERE p.id = ?
");
$stmt->execute([$product_id]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$product) {
    header('Location: index.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($product['name']) ?> - SANT</title>
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
                    <i class="fas fa-arrow-left me-2"></i>Voltar
                </a>
            </div>
        </div>
    </nav>

    <div class="container py-5 mt-5">
        <div class="row">
            <div class="col-lg-6 mb-4">
                <img src="<?= $product['image_url'] ?>" alt="<?= htmlspecialchars($product['name']) ?>" 
                     class="img-fluid product-detail-image w-100">
            </div>
            <div class="col-lg-6">
                <div class="product-details">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="index.php">Início</a></li>
                            <li class="breadcrumb-item active"><?= htmlspecialchars($product['name']) ?></li>
                        </ol>
                    </nav>
                    
                    <h1 class="h2 mb-2"><?= htmlspecialchars($product['name']) ?></h1>
                    <p class="text-muted h5 mb-3"><?= htmlspecialchars($product['brand']) ?></p>
                    
                    <div class="price-section mb-4">
                        <span class="h3 text-primary fw-bold">R$ <?= number_format($product['price'], 2, ',', '.') ?></span>
                    </div>
                    
                    <div class="product-info mb-4">
                        <h5>Descrição</h5>
                        <p><?= nl2br(htmlspecialchars($product['description'])) ?></p>
                    </div>
                    
                    <div class="product-meta mb-4">
                        <div class="row">
                            <div class="col-6">
                                <strong>Estoque:</strong>
                                <span class="<?= $product['stock_quantity'] > 0 ? 'text-success' : 'text-danger' ?>">
                                    <?= $product['stock_quantity'] > 0 ? $product['stock_quantity'] . ' unidades' : 'Esgotado' ?>
                                </span>
                            </div>
                            <div class="col-6">
                                <strong>Vendedor:</strong>
                                <span><?= htmlspecialchars($product['seller_name'] ?? 'SANT') ?></span>
                            </div>
                        </div>
                    </div>
                    
                    <?php if (hasPermission('buyer') && $product['stock_quantity'] > 0): ?>
                        <div class="action-buttons">
                            <button class="btn btn-primary btn-lg me-3" onclick="addToCart(<?= $product['id'] ?>)">
                                <i class="fas fa-cart-plus me-2"></i>Adicionar ao Carrinho
                            </button>
                            <a href="cart.php" class="btn btn-outline-primary btn-lg">
                                <i class="fas fa-shopping-cart me-2"></i>Ver Carrinho
                            </a>
                        </div>
                    <?php elseif (!isLoggedIn()): ?>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <a href="login.php" class="alert-link">Faça login</a> para adicionar produtos ao carrinho.
                        </div>
                    <?php else: ?>
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Produto esgotado
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
