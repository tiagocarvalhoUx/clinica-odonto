import ExcelJS from "exceljs";
import { budgetService } from "../services/budget.service.js";
import { patientService } from "../services/patient.service.js";

export const reportController = {
  async exportBudgets(req, res, next) {
    try {
      const budgets = await budgetService.getAll();

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Clínica Odontológica";
      workbook.created = new Date();

      // Sheet 1: Orçamentos
      const budgetsSheet = workbook.addWorksheet("Orçamentos", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      // Define columns
      budgetsSheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Data", key: "date", width: 18 },
        { header: "Paciente", key: "patient", width: 25 },
        { header: "Telefone", key: "phone", width: 18 },
        { header: "Email", key: "email", width: 30 },
        { header: "Dentista", key: "dentist", width: 25 },
        { header: "CRO", key: "cro", width: 15 },
        { header: "Valor Total", key: "total", width: 15 },
        { header: "Status", key: "status", width: 18 },
        { header: "Observações", key: "notes", width: 40 },
        { header: "Criado por", key: "user", width: 25 },
      ];

      // Style header row
      budgetsSheet.getRow(1).font = {
        bold: true,
        size: 12,
        color: { argb: "FFFFFFFF" },
      };
      budgetsSheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0369A1" },
      };
      budgetsSheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      budgetsSheet.getRow(1).height = 25;

      // Add data
      console.log("Total budgets:", budgets.length);
      budgets.forEach((budget) => {
        console.log("Budget ID:", budget.id, "dentistId:", budget.dentistId, "Dentist obj:", JSON.stringify(budget.dentist));
        const row = budgetsSheet.addRow({
          id: budget.id,
          date: new Date(budget.createdAt).toLocaleString("pt-BR"),
          patient: budget.patient?.name || "-",
          phone: budget.patient?.phone || "-",
          email: budget.patient?.email || "-",
          dentist: budget.dentist?.name || "-",
          cro: budget.dentist?.cro || "-",
          total: parseFloat(budget.finalTotal || budget.total || 0),
          status: getStatusLabel(budget.status),
          notes: budget.notes || "-",
          user: budget.user?.name || "-",
        });

        // Format currency
        row.getCell("total").numFmt = "R$ #,##0.00";

        // Conditional formatting for status
        const statusCell = row.getCell("status");
        if (budget.status === "ACEITO") {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF10B981" },
          };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else if (budget.status === "RECUSADO") {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEF4444" },
          };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else if (budget.status === "EM_NEGOCIACAO") {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF59E0B" },
          };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        }

        // Add borders
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { vertical: "middle", wrapText: true };
        });
      });

      // Sheet 2: Itens dos Orçamentos
      const itemsSheet = workbook.addWorksheet("Itens dos Orçamentos", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      itemsSheet.columns = [
        { header: "ID Orçamento", key: "budgetId", width: 15 },
        { header: "Paciente", key: "patient", width: 25 },
        { header: "Dentista", key: "dentist", width: 25 },
        { header: "Descrição", key: "description", width: 40 },
        { header: "Valor", key: "price", width: 15 },
      ];

      // Style header
      itemsSheet.getRow(1).font = {
        bold: true,
        size: 12,
        color: { argb: "FFFFFFFF" },
      };
      itemsSheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0369A1" },
      };
      itemsSheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      itemsSheet.getRow(1).height = 25;

      // Add items data
      budgets.forEach((budget) => {
        budget.items.forEach((item) => {
          const row = itemsSheet.addRow({
            budgetId: budget.id,
            patient: budget.patient.name,
            dentist: budget.dentist ? budget.dentist.name : "-",
            description: item.description,
            price: parseFloat(item.total || item.price),
          });

          row.getCell("price").numFmt = "R$ #,##0.00";

          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.alignment = { vertical: "middle", wrapText: true };
          });
        });
      });

      // Sheet 3: Pacientes
      const patients = await patientService.getAll();
      const patientsSheet = workbook.addWorksheet("Pacientes", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      patientsSheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Nome", key: "name", width: 30 },
        { header: "Telefone", key: "phone", width: 18 },
        { header: "Email", key: "email", width: 35 },
        { header: "Total de Orçamentos", key: "budgetCount", width: 20 },
        { header: "Data de Cadastro", key: "createdAt", width: 20 },
      ];

      // Style header
      patientsSheet.getRow(1).font = {
        bold: true,
        size: 12,
        color: { argb: "FFFFFFFF" },
      };
      patientsSheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0369A1" },
      };
      patientsSheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      patientsSheet.getRow(1).height = 25;

      // Add patients data
      patients.forEach((patient) => {
        const row = patientsSheet.addRow({
          id: patient.id,
          name: patient.name,
          phone: patient.phone || "-",
          email: patient.email || "-",
          budgetCount: patient._count.budgets,
          createdAt: new Date(patient.createdAt).toLocaleDateString("pt-BR"),
        });

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { vertical: "middle" };
        });
      });

      // Apply auto-filter
      budgetsSheet.autoFilter = {
        from: "A1",
        to: "K1",
      };

      patientsSheet.autoFilter = {
        from: "A1",
        to: "F1",
      };

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=clinica-gygy-relatorio-${Date.now()}.xlsx`,
      );

      res.send(buffer);
    } catch (error) {
      next(error);
    }
  },

  async exportPatients(req, res, next) {
    try {
      const patients = await patientService.getAll();

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Clínica Odontológica";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Pacientes", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Nome", key: "name", width: 30 },
        { header: "Telefone", key: "phone", width: 18 },
        { header: "Email", key: "email", width: 35 },
        { header: "Total de Orçamentos", key: "budgetCount", width: 20 },
        { header: "Data de Cadastro", key: "createdAt", width: 20 },
      ];

      // Style header
      sheet.getRow(1).font = {
        bold: true,
        size: 12,
        color: { argb: "FFFFFFFF" },
      };
      sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0369A1" },
      };
      sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
      sheet.getRow(1).height = 25;

      // Add data
      patients.forEach((patient) => {
        const row = sheet.addRow({
          id: patient.id,
          name: patient.name,
          phone: patient.phone || "-",
          email: patient.email || "-",
          budgetCount: patient._count.budgets,
          createdAt: new Date(patient.createdAt).toLocaleDateString("pt-BR"),
        });

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { vertical: "middle" };
        });
      });

      sheet.autoFilter = {
        from: "A1",
        to: "F1",
      };

      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=pacientes-${Date.now()}.xlsx`,
      );

      res.send(buffer);
    } catch (error) {
      next(error);
    }
  },
};

function getStatusLabel(status) {
  const labels = {
    EM_NEGOCIACAO: "Em Negociação",
    ACEITO: "Aceito",
    RECUSADO: "Recusado",
  };
  return labels[status] || status;
}
