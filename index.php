<?php
require_once 'includes/auth.php';

// Buscar produtos
$search = isset($_GET['search']) ? $_GET['search'] : '';
$sql = "SELECT p.*, u.full_name as seller_name FROM products p 
        LEFT JOIN users u ON p.seller_id = u.id 
        WHERE p.name LIKE ? OR p.brand LIKE ? 
        ORDER BY p.created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute(["%$search%", "%$search%"]);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SANT - Relógios de Luxo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold fs-2" href="index.php">SANT</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php">Início</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#produtos">Produtos</a>
                    </li>
                </ul>
                <div class="d-flex align-items-center">
                    <!-- Busca -->
                    <form class="d-flex me-3" method="GET">
                        <input class="form-control me-2" type="search" name="search" placeholder="Buscar relógios..." value="<?= htmlspecialchars($search) ?>">
                        <button class="btn btn-outline-light" type="submit">
                            <i class="fas fa-search"></i>
                        </button>
                    </form>
                    
                    <?php if (isLoggedIn()): ?>
                        <?php if (hasPermission('buyer')): ?>
                            <a href="cart.php" class="btn btn-outline-light me-2">
                                <i class="fas fa-shopping-cart"></i>
                                <span id="cart-count" class="badge bg-danger">0</span>
                            </a>
                        <?php endif; ?>
                        <div class="dropdown">
                            <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fas fa-user"></i> <?= $_SESSION['username'] ?>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="profile.php">Perfil</a></li>
                                <?php if (hasPermission('admin')): ?>
                                    <li><a class="dropdown-item" href="admin.php">Painel Admin</a></li>
                                <?php endif; ?>
                                <?php if (hasPermission('seller')): ?>
                                    <li><a class="dropdown-item" href="seller.php">Painel Vendedor</a></li>
                                <?php endif; ?>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="logout.php">Sair</a></li>
                            </ul>
                        </div>
                    <?php else: ?>
                        <a href="login.php" class="btn btn-outline-light me-2">Login</a>
                        <a href="register.php" class="btn btn-light">Cadastrar</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6">
                    <h1 class="display-3 fw-bold text-white mb-4">SANT</h1>
                    <h2 class="h3 text-white-50 mb-4">Relógios de Luxo Exclusivos</h2>
                    <p class="lead text-white-50 mb-5">Descubra nossa coleção única de relógios de luxo das melhores marcas do mundo. Cada peça é uma obra de arte que combina tradição, inovação e elegância atemporal.</p>
                    <a href="#produtos" class="btn btn-light btn-lg px-5">Explorar Coleção</a>
                </div>
                <div class="col-lg-6">
                    <img src="public/relogio.png">
                </div>
            </div>
        </div>
    </section>

    <!-- Produtos Section -->
    <section id="produtos" class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="display-4 fw-bold">Nossa Coleção</h2>
                    <p class="lead text-muted">Relógios exclusivos para conhecedores</p>
                </div>
            </div>
            
            <?php if ($search): ?>
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="alert alert-info">
                            <i class="fas fa-search me-2"></i>
                            Resultados para: <strong><?= htmlspecialchars($search) ?></strong>
                            <a href="index.php" class="btn btn-sm btn-outline-secondary ms-2">Limpar busca</a>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <div class="row">
                <?php foreach ($products as $product): ?>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card product-card h-100 shadow-sm">
                            <img src="<?= $product['image_url'] ?>" class="card-img-top product-image" alt="<?= htmlspecialchars($product['name']) ?>">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title"><?= htmlspecialchars($product['name']) ?></h5>
                                <p class="text-muted mb-2"><?= htmlspecialchars($product['brand']) ?></p>
                                <p class="card-text flex-grow-1"><?= htmlspecialchars(substr($product['description'], 0, 100)) ?>...</p>
                                <div class="d-flex justify-content-between align-items-center mt-auto">
                                    <span class="h5 text-primary mb-0">R$ <?= number_format($product['price'], 2, ',', '.') ?></span>
                                    <small class="text-muted">Estoque: <?= $product['stock_quantity'] ?></small>
                                </div>
                                <div class="mt-3">
                                    <a href="product-details.php?id=<?= $product['id'] ?>" class="btn btn-outline-primary me-2">Ver Detalhes</a>
                                    <?php if (hasPermission('buyer') && $product['stock_quantity'] > 0): ?>
                                        <button class="btn btn-primary" onclick="addToCart(<?= $product['id'] ?>)">
                                            <i class="fas fa-cart-plus"></i>
                                        </button>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <?php if (empty($products)): ?>
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Nenhum produto encontrado.
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <h5 class="fw-bold">SANT</h5>
                    <p>Relógios de luxo exclusivos para conhecedores que valorizam a excelência e a tradição relojoeira.</p>
                </div>
                <div class="col-lg-4 mb-4">
                    <h5>Contato</h5>
                    <p><i class="fas fa-envelope me-2"></i> iibrxyan@gmail.com</p>
                    <p><i class="fas fa-phone me-2"></i> (41) 99893-4895</p>
                </div>
                <div class="col-lg-4 mb-4">
                    <h5>Redes Sociais</h5>
                    <div class="social-links">
                        <a href="https://www.instagram.com/yanktw" class="text-white me-3"><i class="fab fa-instagram fa-2x"></i></a>
                        <a href="https://www.facebook.com/share/1A9RPrrYRm/?mibextid=wwXlfr" class="text-white me-3"><i class="fab fa-facebook fa-2x"></i></a>
                        <a href="https://www.linkedin.com/in/brayan-calisto/" class="text-white"><i class="fab fa-linkedin fa-2x"></i></a>
                    </div>
                </div>
            </div>
            <hr>
            <div class="text-center">
                <p>&copy; 2024 SANT. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
