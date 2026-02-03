import bcrypt from "bcrypt";

// Script para gerar senhas hash
async function generateHashes() {
  console.log("Gerando senhas hash...\n");

  const admin123 = await bcrypt.hash("admin123", 10);
  const funcionaria123 = await bcrypt.hash("funcionaria123", 10);

  console.log("-- Execute este SQL no seu MySQL:\n");
  console.log("USE clinica_gygy;\n");
  console.log("-- Usuário ADMIN (email: admin@clinica.com, senha: admin123)");
  console.log(
    `INSERT INTO users (name, email, password, role) VALUES ('Administrador', 'admin@clinica.com', '${admin123}', 'ADMIN');\n`,
  );
  console.log(
    "-- Usuária FUNCIONARIA (email: funcionaria@clinica.com, senha: funcionaria123)",
  );
  console.log(
    `INSERT INTO users (name, email, password, role) VALUES ('Maria Funcionária', 'funcionaria@clinica.com', '${funcionaria123}', 'FUNCIONARIA');\n`,
  );
  console.log("-- Verificar usuários criados:");
  console.log("SELECT id, name, email, role FROM users;\n");
}

generateHashes();
