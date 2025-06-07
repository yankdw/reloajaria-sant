<?php
require_once 'includes/auth.php';
requireLogin();

$user = getCurrentUser();
$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    
    if (empty($full_name) || empty($email)) {
        $error = 'Nome e email são obrigatórios.';
    } else {
        // Verificar se email já existe (exceto o atual)
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->execute([$email, $_SESSION['user_id']]);
        
        if ($stmt->fetch()) {
            $error = 'Este email já está em uso.';
        } else {
            $update_password = false;
            $hashed_password = '';
            
            // Se senha foi fornecida, validar
            if (!empty($new_password)) {
                if (empty($current_password)) {
                    $error = 'Senha atual é obrigatória para alterar a senha.';
                } elseif (!password_verify($current_password, $user['password'])) {
                    $error = 'Senha atual incorreta.';
                } elseif (strlen($new_password) < 6) {
                    $error = 'Nova senha deve ter pelo menos 6 caracteres.';
                } else {
                    $update_password = true;
                    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
                }
            }
            
            if (empty($error)) {
                // Upload de imagem
                $profile_image = $user['profile_image'];
                if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
                    $upload_dir = 'uploads/profiles/';
                    if (!is_dir($upload_dir)) {
                        mkdir($upload_dir, 0777, true);
                    }
                    
                    $file_extension = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
                    $new_filename = 'profile_' . $_SESSION['user_id'] . '_' . time() . '.' . $file_extension;
                    $upload_path = $upload_dir . $new_filename;
                    
                    if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $upload_path)) {
                        // Deletar imagem anterior
                        if ($profile_image && file_exists($profile_image)) {
                            unlink($profile_image);
                        }
                        $profile_image = $upload_path;
                    }
                }
                
                // Atualizar dados
                if ($update_password) {
                    $stmt = $pdo->prepare("UPDATE users SET full_name = ?, email = ?, password = ?, profile_image = ? WHERE id = ?");
                    $stmt->execute([$full_name, $email, $hashed_password, $profile_image, $_SESSION['user_id']]);
                } else {
                    $stmt = $pdo->prepare("UPDATE users SET full_name = ?, email = ?, profile_image = ? WHERE id = ?");
                    $stmt->execute([$full_name, $email, $profile_image, $_SESSION['user_id']]);
                }
                
                $message = 'Perfil atualizado com sucesso!';
                $user = getCurrentUser(); // Recarregar dados
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil - SANT</title>
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
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">
                            <i class="fas fa-user me-2"></i>Meu Perfil
                        </h4>
                    </div>
                    <div class="card-body">
                        <?php if ($message): ?>
                            <div class="alert alert-success">
                                <i class="fas fa-check-circle me-2"></i>
                                <?= htmlspecialchars($message) ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($error): ?>
                            <div class="alert alert-danger">
                                <i class="fas fa-exclamation-circle me-2"></i>
                                <?= htmlspecialchars($error) ?>
                            </div>
                        <?php endif; ?>
                        
                        <form method="POST" enctype="multipart/form-data">
                            <div class="row">
                                <div class="col-md-4 text-center mb-4">
                                    <div class="profile-image-container">
                                        <?php if ($user['profile_image'] && file_exists($user['profile_image'])): ?>
                                            <img src="<?= $user['profile_image'] ?>" alt="Foto do Perfil" class="profile-image mb-3" id="image-preview">
                                        <?php else: ?>
                                            <img src="https://via.placeholder.com/150x150/6c757d/ffffff?text=Foto" alt="Foto do Perfil" class="profile-image mb-3" id="image-preview">
                                        <?php endif; ?>
                                        <div>
                                            <label for="profile_image" class="btn btn-outline-primary btn-sm">
                                                <i class="fas fa-camera me-2"></i>Alterar Foto
                                            </label>
                                            <input type="file" id="profile_image" name="profile_image" class="d-none" accept="image/*" onchange="previewImage(this)">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="mb-3">
                                        <label for="username" class="form-label">Usuário</label>
                                        <input type="text" class="form-control" id="username" value="<?= htmlspecialchars($user['username']) ?>" disabled>
                                        <small class="text-muted">O nome de usuário não pode ser alterado.</small>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="user_type" class="form-label">Tipo de Conta</label>
                                        <input type="text" class="form-control" id="user_type" value="<?= ucfirst($user['user_type']) ?>" disabled>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="full_name" class="form-label">Nome Completo</label>
                                        <input type="text" class="form-control" id="full_name" name="full_name" value="<?= htmlspecialchars($user['full_name']) ?>" required>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($user['email']) ?>" required>
                                    </div>
                                </div>
                            </div>
                            
                            <hr>
                            <h5>Alterar Senha</h5>
                            <p class="text-muted">Deixe em branco se não quiser alterar a senha.</p>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="current_password" class="form-label">Senha Atual</label>
                                    <input type="password" class="form-control" id="current_password" name="current_password">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="new_password" class="form-label">Nova Senha</label>
                                    <input type="password" class="form-control" id="new_password" name="new_password">
                                </div>
                            </div>
                            
                            <div class="text-end">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
