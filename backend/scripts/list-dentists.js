// Script para listar dentistas e orçamentos sem dentista
import prisma from "../src/config/database.js";

async function main() {
  try {
    // 1. Listar todos os dentistas
    console.log("\n=== DENTISTAS CADASTRADOS ===");
    const dentists = await prisma.dentist.findMany({
      orderBy: { id: "asc" },
    });
    
    if (dentists.length === 0) {
      console.log("❌ Nenhum dentista cadastrado!");
      console.log("Cadastre um dentista primeiro antes de atualizar os orçamentos.");
      process.exit(1);
    }

    dentists.forEach((d) => {
      console.log(`ID: ${d.id} | Nome: ${d.name} | CRO: ${d.cro} | Ativo: ${d.active ? "Sim" : "Não"}`);
    });

    // 2. Ver orçamentos sem dentista
    console.log("\n=== ORÇAMENTOS SEM DENTISTA ===");
    const budgetsWithoutDentist = await prisma.budget.findMany({
      where: { dentistId: null },
      include: { patient: { select: { name: true } } },
    });

    console.log(`Total: ${budgetsWithoutDentist.length} orçamentos sem dentista`);
    budgetsWithoutDentist.forEach((b) => {
      console.log(`- Orçamento #${b.id} | Paciente: ${b.patient?.name || "N/A"} | Data: ${b.createdAt.toLocaleDateString("pt-BR")}`);
    });

    // 3. Instruções
    if (budgetsWithoutDentist.length > 0) {
      console.log("\n=== COMO ATUALIZAR ===");
      console.log("Execute este SQL no console do seu banco (Railway/PlanetScale):");
      console.log("\n  UPDATE budgets SET dentist_id = 1 WHERE dentist_id IS NULL;");
      console.log("\nSubstitua '1' pelo ID do dentista que você quer usar.");
    }

  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
