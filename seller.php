<?php
require_once 'includes/auth.php';

if (!hasPermission('seller')) {
    header('Location: login.php');
    exit();
}

// Buscar produtos do vendedor
$stmt = $pdo->prepare("SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC");
$stmt->execute([$_SESSION['user_id']]);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Estatísticas
$stmt = $pdo->prepare("SELECT COUNT(*) as total_products, SUM(stock_quantity) as total_stock FROM products WHERE seller_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$stats = $stmt->fetch(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Vendedor - SANT</title>
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
                <a href="index.php" class="btn btn-outline-light me-2">
                    <i class="fas fa-home me-2"></i>Loja
                </a>
                <a href="logout.php" class="btn btn-outline-light">
                    <i class="fas fa-sign-out-alt me-2"></i>Sair
                </a>
            </div>
        </div>
    </nav>

    <div class="container py-5 mt-5">
        <div class="row">
            <div class="col-12 mb-4">
                <h2>Painel do Vendedor</h2>
                <p class="text-muted">Bem-vindo, <?= htmlspecialchars($_SESSION['full_name']) ?>!</p>
            </div>
        </div>

        <!-- Estatísticas -->
        <div class="row mb-4">
            <div class="col-md-6 mb-3">
                <div class="dashboard-card">
                    <i class="fas fa-box"></i>
                    <h3><?= $stats['total_products'] ?></h3>
                    <p>Produtos Cadastrados</p>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="dashboard-card">
                    <i class="fas fa-warehouse"></i>
                    <h3><?= $stats['total_stock'] ?></h3>
                    <p>Total em Estoque</p>
                </div>
            </div>
        </div>

        <!-- Ações -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Meus Produtos</h5>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
                                <i class="fas fa-plus me-2"></i>Adicionar Produto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lista de Produtos -->
        <div class="row">
            <?php if (empty($products)): ?>
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-info-circle me-2"></i>
                        Você ainda não cadastrou nenhum produto. Clique em "Adicionar Produto" para começar!
                    </div>
                </div>
            <?php else: ?>
                <?php foreach ($products as $product): ?>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100">
                            <img src="<?= $product['image_url'] ?>" class="card-img-top product-image" alt="<?= htmlspecialchars($product['name']) ?>">
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title"><?= htmlspecialchars($product['name']) ?></h6>
                                <p class="text-muted mb-2"><?= htmlspecialchars($product['brand']) ?></p>
                                <p class="card-text flex-grow-1"><?= htmlspecialchars(substr($product['description'], 0, 80)) ?>...</p>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="h6 text-primary mb-0">R$ <?= number_format($product['price'], 2, ',', '.') ?></span>
                                    <small class="text-muted">Estoque: <?= $product['stock_quantity'] ?></small>
                                </div>
                                <div class="mt-auto">
                                    <button class="btn btn-outline-primary btn-sm me-2" onclick="editProduct(<?= $product['id'] ?>)">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct(<?= $product['id'] ?>)">
                                        <i class="fas fa-trash"></i> Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <!-- Modal Adicionar Produto -->
    <div class="modal fade" id="addProductModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Adicionar Produto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="productForm">
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="name" class="form-label">Nome do Produto</label>
                                <input type="text" class="form-control" id="name" name="name" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="brand" class="form-label">Marca</label>
                                <input type="text" class="form-control" id="brand" name="brand" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Descrição</label>
                            <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="price" class="form-label">Preço (R$)</label>
                                <input type="number" class="form-control" id="price" name="price" step="0.01" min="0" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="stock_quantity" class="form-label">Quantidade em Estoque</label>
                                <input type="number" class="form-control" id="stock_quantity" name="stock_quantity" min="0" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="image_url" class="form-label">URL da Imagem</label>
                            <input type="url" class="form-control" id="image_url" name="image_url" required>
                            <small class="text-muted">Cole a URL de uma imagem do produto</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar Produto</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/main.js"></script>
    <script>
        // Adicionar produto
        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(this);
            var data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            
            fetch('api/products.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    Swal.fire('Sucesso!', 'Produto adicionado com sucesso.', 'success')
                    .then(function() {
                        location.reload();
                    });
                } else {
                    Swal.fire('Erro!', data.message, 'error');
                }
            });
        });
        
        function editProduct(id) {
            // Implementar edição de produto
            Swal.fire('Em desenvolvimento', 'Funcionalidade de edição será implementada em breve.', 'info');
        }
    </script>
</body>
</html>
