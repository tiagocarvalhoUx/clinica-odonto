import bcrypt from "bcrypt";
import prisma from "./src/config/database.js";

async function createInitialUser() {
  try {
    console.log("🔧 Criando usuário inicial...\n");

    // Verificar se já existe algum usuário
    const existingUsers = await prisma.user.count();

    if (existingUsers > 0) {
      console.log("⚠️  Já existem usuários cadastrados no sistema.");
      console.log("   Total de usuários:", existingUsers);
      process.exit(0);
    }

    // Dados do usuário admin
    const adminData = {
      name: "Administrador",
      email: "admin@clinica.com",
      password: "admin123",
      role: "ADMIN",
    };

    // Dados da funcionária
    const funcionariaData = {
      name: "Maria Funcionária",
      email: "funcionaria@clinica.com",
      password: "funcionaria123",
      role: "FUNCIONARIA",
    };

    // Criptografar senhas
    const hashedAdminPassword = await bcrypt.hash(adminData.password, 10);
    const hashedFuncionariaPassword = await bcrypt.hash(
      funcionariaData.password,
      10,
    );

    // Criar usuários
    const admin = await prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password: hashedAdminPassword,
        role: adminData.role,
      },
    });

    const funcionaria = await prisma.user.create({
      data: {
        name: funcionariaData.name,
        email: funcionariaData.email,
        password: hashedFuncionariaPassword,
        role: funcionariaData.role,
      },
    });

    console.log("✅ Usuários criados com sucesso!\n");
    console.log("📋 Credenciais de acesso:\n");
    console.log("👤 ADMINISTRADOR:");
    console.log("   Email:", adminData.email);
    console.log("   Senha:", adminData.password);
    console.log("");
    console.log("👤 FUNCIONÁRIA:");
    console.log("   Email:", funcionariaData.email);
    console.log("   Senha:", funcionariaData.password);
    console.log("");
    console.log("⚠️  IMPORTANTE: Altere estas senhas após o primeiro login!\n");
  } catch (error) {
    console.error("❌ Erro ao criar usuários:", error.message);

    if (error.code === "P1001") {
      console.log(
        "\n💡 Dica: Verifique se o MySQL está rodando e as credenciais no .env estão corretas.",
      );
    } else if (error.code === "P1003") {
      console.log("\n💡 Dica: O banco de dados não existe. Execute primeiro:");
      console.log("   CREATE DATABASE clinica_gygy;");
    } else if (error.code === "P2002") {
      console.log("\n💡 Dica: Este email já está cadastrado.");
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialUser();
