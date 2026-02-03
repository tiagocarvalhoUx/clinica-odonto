-- Script de inicialização do banco de dados
-- Execute este script após criar o banco de dados

-- Criar usuário administrador padrão
-- IMPORTANTE: Altere a senha em produção!
INSERT INTO users (name, email, password, role) 
VALUES (
  'Administrador',
  'admin@clinica.com',
  '$2b$10$YourHashedPasswordHere', -- Substitua por uma senha hash gerada com bcrypt
  'ADMIN'
);

-- Criar usuária funcionária de exemplo
INSERT INTO users (name, email, password, role) 
VALUES (
  'Maria Funcionária',
  'maria@clinica.com',
  '$2b$10$YourHashedPasswordHere', -- Substitua por uma senha hash gerada com bcrypt
  'FUNCIONARIA'
);

-- Criar alguns pacientes de exemplo
INSERT INTO patients (name, phone, email) VALUES
('João Silva', '(11) 98765-4321', 'joao@email.com'),
('Ana Santos', '(11) 97654-3210', 'ana@email.com'),
('Carlos Oliveira', '(11) 96543-2109', 'carlos@email.com');

-- Nota: Para gerar uma senha hash para o usuário, você pode usar:
-- Node.js: bcrypt.hash('senha123', 10)
-- Ou criar o usuário via API POST /api/auth/register
