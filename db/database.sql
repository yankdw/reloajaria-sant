-- Criar banco de dados SANT
CREATE DATABASE IF NOT EXISTS sant_watches;
USE sant_watches;

-- Tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    user_type ENUM('admin', 'buyer', 'seller') NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    stock_quantity INT DEFAULT 0,
    seller_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela do carrinho
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Tabela de pedidos
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de itens do pedido
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Inserir usuário administrador padrão (senha: password)
INSERT INTO users (username, email, password, full_name, user_type) VALUES 
('admin', 'admin@sant.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador SANT', 'admin');

-- Inserir alguns produtos de exemplo
INSERT INTO products (name, brand, description, price, image_url, stock_quantity, seller_id) VALUES 
('Rolex Submariner', 'Rolex', 'Relógio de mergulho icônico com resistência à água de 300m', 45000.00, 'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=400', 5, 1),
('Omega Speedmaster', 'Omega', 'O relógio que foi à lua - cronógrafo profissional', 28000.00, 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400', 8, 1),
('TAG Heuer Monaco', 'TAG Heuer', 'Cronógrafo quadrado icônico usado por Steve McQueen', 35000.00, 'https://images.unsplash.com/photo-1548181622-6ac4ac7b5b5d?w=400', 3, 1),
('Patek Philippe Calatrava', 'Patek Philippe', 'Elegância atemporal em ouro branco 18k', 85000.00, 'https://images.unsplash.com/photo-1509048191080-d2abbc854b89?w=400', 2, 1),
('Audemars Piguet Royal Oak', 'Audemars Piguet', 'Design revolucionário em aço inoxidável', 95000.00, 'https://images.unsplash.com/photo-1606859428249-2d2bb5e2d8b6?w=400', 1, 1);
