-- Script para criar usuários diretamente no MySQL
USE clinica_gygy;

-- Criar usuário ADMIN
-- Email: admin@clinica.com
-- Senha: admin123
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@clinica.com', '$2b$10$rGk1YqQQX7Kl4p3WZJvKxOqF6PzY9LQvxR2hEhZN3JJ8KvJH5yGKm', 'ADMIN');

-- Criar usuária FUNCIONARIA
-- Email: funcionaria@clinica.com  
-- Senha: funcionaria123
INSERT INTO users (name, email, password, role) VALUES 
('Maria Funcionária', 'funcionaria@clinica.com', '$2b$10$rGk1YqQQX7Kl4p3WZJvKxOqF6PzY9LQvxR2hEhZN3JJ8KvJH5yGKm', 'FUNCIONARIA');

-- Verificar se foram criados
SELECT id, name, email, role FROM users;
