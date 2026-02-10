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

      // Calcular métricas
      const totalOrcamentos = budgets.length;
      const valorTotal = budgets.reduce((sum, b) => sum + parseFloat(b.finalTotal || b.total || 0), 0);
      const aceitos = budgets.filter(b => b.status === "ACEITO").length;
      const emNegociacao = budgets.filter(b => b.status === "EM_NEGOCIACAO").length;
      const recusados = budgets.filter(b => b.status === "RECUSADO").length;
      const ticketMedio = totalOrcamentos > 0 ? valorTotal / totalOrcamentos : 0;

      // Sheet 1: Capa
      const capaSheet = workbook.addWorksheet("Capa");
      
      // Configurar larguras das colunas
      capaSheet.columns = [
        { width: 3 },
        { width: 30 },
        { width: 3 },
        { width: 30 },
      ];

      // Estilos
      const titleStyle = {
        font: { bold: true, size: 20, color: { argb: "FF0369A1" } },
        alignment: { horizontal: "center", vertical: "middle" },
      };
      
      const subtitleStyle = {
        font: { size: 12, color: { argb: "FF666666" } },
        alignment: { horizontal: "center", vertical: "middle" },
      };
      
      const sectionStyle = {
        font: { bold: true, size: 14, color: { argb: "FF0369A1" } },
        alignment: { horizontal: "center", vertical: "middle" },
      };
      
      const metricLabelStyle = {
        font: { bold: true, size: 11, color: { argb: "FF444444" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F9FF" } },
      };
      
      const metricValueStyle = {
        font: { bold: true, size: 16, color: { argb: "FF0369A1" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0F2FE" } },
      };

      // Título
      capaSheet.mergeCells("B2:D2");
      capaSheet.getCell("B2").value = "RELATÓRIO DE ORÇAMENTOS";
      capaSheet.getCell("B2").font = titleStyle.font;
      capaSheet.getCell("B2").alignment = titleStyle.alignment;
      capaSheet.getRow(2).height = 35;

      // Subtítulo
      capaSheet.mergeCells("B3:D3");
      capaSheet.getCell("B3").value = "Clínica Odontológica - Análise de Orçamentos";
      capaSheet.getCell("B3").font = subtitleStyle.font;
      capaSheet.getCell("B3").alignment = subtitleStyle.alignment;

      // Data
      capaSheet.mergeCells("B5:D5");
      capaSheet.getCell("B5").value = `Data do Relatório: ${new Date().toLocaleDateString("pt-BR")}`;
      capaSheet.getCell("B5").font = { size: 11, color: { argb: "FF666666" } };
      capaSheet.getCell("B5").alignment = { horizontal: "center" };

      // Seção Métricas
      capaSheet.mergeCells("B7:D7");
      capaSheet.getCell("B7").value = "MÉTRICAS CHAVE";
      capaSheet.getCell("B7").font = sectionStyle.font;
      capaSheet.getCell("B7").alignment = sectionStyle.alignment;
      capaSheet.getRow(7).height = 25;

      // Métricas - Linha 1
      capaSheet.getCell("B9").value = "Total de Orçamentos";
      capaSheet.getCell("B9").font = metricLabelStyle.font;
      capaSheet.getCell("B9").alignment = metricLabelStyle.alignment;
      capaSheet.getCell("B9").fill = metricLabelStyle.fill;
      capaSheet.getCell("B9").border = {
        top: { style: "thin", color: { argb: "FF0369A1" } },
        left: { style: "thin", color: { argb: "FF0369A1" } },
        right: { style: "thin", color: { argb: "FF0369A1" } },
      };

      capaSheet.getCell("D9").value = "Valor Total";
      capaSheet.getCell("D9").font = metricLabelStyle.font;
      capaSheet.getCell("D9").alignment = metricLabelStyle.alignment;
      capaSheet.getCell("D9").fill = metricLabelStyle.fill;
      capaSheet.getCell("D9").border = {
        top: { style: "thin", color: { argb: "FF0369A1" } },
        left: { style: "thin", color: { argb: "FF0369A1" } },
        right: { style: "thin", color: { argb: "FF0369A1" } },
      };

      capaSheet.getCell("B10").value = totalOrcamentos;
      capaSheet.getCell("B10").font = metricValueStyle.font;
      capaSheet.getCell("B10").alignment = metricValueStyle.alignment;
      capaSheet.getCell("B10").fill = metricValueStyle.fill;
      capaSheet.getCell("B10").border = {
        left: { style: "thin", color: { argb: "FF0369A1" } },
        bottom: { style: "thin", color: { argb: "FF0369A1" } },
        right: { style: "thin", color: { argb: "FF0369A1" } },
      };

      capaSheet.getCell("D10").value = valorTotal;
      capaSheet.getCell("D10").font = metricValueStyle.font;
      capaSheet.getCell("D10").alignment = metricValueStyle.alignment;
      capaSheet.getCell("D10").fill = metricValueStyle.fill;
      capaSheet.getCell("D10").numFmt = "R$ #,##0.00";
      capaSheet.getCell("D10").border = {
        left: { style: "thin", color: { argb: "FF0369A1" } },
        bottom: { style: "thin", color: { argb: "FF0369A1" } },
        right: { style: "thin", color: { argb: "FF0369A1" } },
      };

      // Métricas - Linha 2
      capaSheet.getCell("B11").value = "Orçamentos Aceitos";
      capaSheet.getCell("B11").font = metricLabelStyle.font;
      capaSheet.getCell("B11").alignment = metricLabelStyle.alignment;
      capaSheet.getCell("B11").fill = metricLabelStyle.fill;
      capaSheet.getCell("B11").border = {
        top: { style: "thin", color: { argb: "FF10B981" } },
        left: { style: "thin", color: { argb: "FF10B981" } },
        right: { style: "thin", color: { argb: "FF10B981" } },
      };

      capaSheet.getCell("D11").value = "Em Negociação";
      capaSheet.getCell("D11").font = metricLabelStyle.font;
      capaSheet.getCell("D11").alignment = metricLabelStyle.alignment;
      capaSheet.getCell("D11").fill = metricLabelStyle.fill;
      capaSheet.getCell("D11").border = {
        top: { style: "thin", color: { argb: "FFF59E0B" } },
        left: { style: "thin", color: { argb: "FFF59E0B" } },
        right: { style: "thin", color: { argb: "FFF59E0B" } },
      };

      capaSheet.getCell("B12").value = aceitos;
      capaSheet.getCell("B12").font = { bold: true, size: 16, color: { argb: "FF10B981" } };
      capaSheet.getCell("B12").alignment = metricValueStyle.alignment;
      capaSheet.getCell("B12").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } };
      capaSheet.getCell("B12").border = {
        left: { style: "thin", color: { argb: "FF10B981" } },
        bottom: { style: "thin", color: { argb: "FF10B981" } },
        right: { style: "thin", color: { argb: "FF10B981" } },
      };

      capaSheet.getCell("D12").value = emNegociacao;
      capaSheet.getCell("D12").font = { bold: true, size: 16, color: { argb: "FFF59E0B" } };
      capaSheet.getCell("D12").alignment = metricValueStyle.alignment;
      capaSheet.getCell("D12").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
      capaSheet.getCell("D12").border = {
        left: { style: "thin", color: { argb: "FFF59E0B" } },
        bottom: { style: "thin", color: { argb: "FFF59E0B" } },
        right: { style: "thin", color: { argb: "FFF59E0B" } },
      };

      // Ticket Médio
      capaSheet.getCell("B13").value = "Ticket Médio";
      capaSheet.getCell("B13").font = metricLabelStyle.font;
      capaSheet.getCell("B13").alignment = metricLabelStyle.alignment;
      capaSheet.getCell("B13").fill = metricLabelStyle.fill;
      capaSheet.getCell("B13").border = {
        top: { style: "thin", color: { argb: "FF8B5CF6" } },
        left: { style: "thin", color: { argb: "FF8B5CF6" } },
        right: { style: "thin", color: { argb: "FF8B5CF6" } },
      };

      capaSheet.getCell("B14").value = ticketMedio;
      capaSheet.getCell("B14").font = { bold: true, size: 16, color: { argb: "FF8B5CF6" } };
      capaSheet.getCell("B14").alignment = metricValueStyle.alignment;
      capaSheet.getCell("B14").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEDE9FE" } };
      capaSheet.getCell("B14").numFmt = "R$ #,##0.00";
      capaSheet.getCell("B14").border = {
        left: { style: "thin", color: { argb: "FF8B5CF6" } },
        bottom: { style: "thin", color: { argb: "FF8B5CF6" } },
        right: { style: "thin", color: { argb: "FF8B5CF6" } },
      };

      // Seção Conteúdo
      capaSheet.mergeCells("B16:D16");
      capaSheet.getCell("B16").value = "CONTEÚDO DO RELATÓRIO";
      capaSheet.getCell("B16").font = sectionStyle.font;
      capaSheet.getCell("B16").alignment = sectionStyle.alignment;
      capaSheet.getRow(16).height = 25;

      // Descrição das abas
      const contentStyle = {
        font: { size: 11 },
        alignment: { vertical: "middle" },
      };

      capaSheet.getCell("B18").value = "Orçamentos";
      capaSheet.getCell("B18").font = { bold: true, size: 11, color: { argb: "FF0369A1" } };
      capaSheet.getCell("D18").value = "Lista completa de orçamentos com filtros";
      capaSheet.getCell("D18").font = contentStyle.font;

      capaSheet.getCell("B19").value = "Dashboard";
      capaSheet.getCell("B19").font = { bold: true, size: 11, color: { argb: "FF0369A1" } };
      capaSheet.getCell("D19").value = "Gráficos e análises visuais";
      capaSheet.getCell("D19").font = contentStyle.font;

      // Sheet 2: Orçamentos
      const budgetsSheet = workbook.addWorksheet("Orcamentos", {
        views: [{ state: "frozen", ySplit: 3 }],
      });

      // Título da aba
      budgetsSheet.mergeCells("A1:K1");
      budgetsSheet.getCell("A1").value = "ORÇAMENTOS";
      budgetsSheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF0369A1" } };
      budgetsSheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
      budgetsSheet.getRow(1).height = 30;

      // Linha em branco
      budgetsSheet.getRow(2).height = 5;

      // Define columns
      budgetsSheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Data", key: "date", width: 15 },
        { header: "Paciente", key: "patient", width: 25 },
        { header: "Telefone", key: "phone", width: 18 },
        { header: "Email", key: "email", width: 30 },
        { header: "Dentista", key: "dentist", width: 25 },
        { header: "CRO", key: "cro", width: 15 },
        { header: "Valor Total", key: "total", width: 15 },
        { header: "Status", key: "status", width: 18 },
        { header: "Observações", key: "notes", width: 35 },
        { header: "Criado por", key: "user", width: 20 },
      ];

      // Style header row (linha 3)
      budgetsSheet.getRow(3).font = {
        bold: true,
        size: 11,
        color: { argb: "FFFFFFFF" },
      };
      budgetsSheet.getRow(3).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0369A1" },
      };
      budgetsSheet.getRow(3).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      budgetsSheet.getRow(3).height = 22;

      // Add data
      budgets.forEach((budget) => {
        const row = budgetsSheet.addRow({
          id: budget.id,
          date: new Date(budget.createdAt).toLocaleDateString("pt-BR"),
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
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          };
          cell.alignment = { vertical: "middle", wrapText: true };
        });
      });

      // Linha de Totais
      const totalRow = budgetsSheet.addRow({});
      const startRow = budgetsSheet.rowCount;
      budgetsSheet.mergeCells(`A${startRow}:G${startRow}`);
      budgetsSheet.getCell(`A${startRow}`).value = "TOTAIS";
      budgetsSheet.getCell(`A${startRow}`).font = { bold: true, size: 12, color: { argb: "FF0369A1" } };
      budgetsSheet.getCell(`A${startRow}`).alignment = { horizontal: "right", vertical: "middle" };
      budgetsSheet.getCell(`A${startRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F9FF" } };

      budgetsSheet.getCell(`H${startRow}`).value = valorTotal;
      budgetsSheet.getCell(`H${startRow}`).font = { bold: true, size: 12, color: { argb: "FF0369A1" } };
      budgetsSheet.getCell(`H${startRow}`).numFmt = "R$ #,##0.00";
      budgetsSheet.getCell(`H${startRow}`).alignment = { horizontal: "center", vertical: "middle" };
      budgetsSheet.getCell(`H${startRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F9FF" } };

      budgetsSheet.getCell(`I${startRow}`).value = `Média: ${ticketMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
      budgetsSheet.getCell(`I${startRow}`).font = { bold: true, size: 11, color: { argb: "FF666666" } };
      budgetsSheet.getCell(`I${startRow}`).alignment = { horizontal: "center", vertical: "middle" };
      budgetsSheet.getCell(`I${startRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F9FF" } };

      // Bordas na linha de totais
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"].forEach(col => {
        budgetsSheet.getCell(`${col}${startRow}`).border = {
          top: { style: "medium", color: { argb: "FF0369A1" } },
          bottom: { style: "medium", color: { argb: "FF0369A1" } },
        };
      });

      // Apply auto-filter
      budgetsSheet.autoFilter = {
        from: "A3",
        to: "K3",
      };

      // Sheet 3: Dashboard
      const dashboardSheet = workbook.addWorksheet("Dashboard");
      
      // Título
      dashboardSheet.mergeCells("A1:D1");
      dashboardSheet.getCell("A1").value = "DASHBOARD DE ORÇAMENTOS";
      dashboardSheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF0369A1" } };
      dashboardSheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
      dashboardSheet.getRow(1).height = 30;

      // Análise por Status
      dashboardSheet.getCell("A3").value = "ANÁLISE POR STATUS";
      dashboardSheet.getCell("A3").font = { bold: true, size: 13, color: { argb: "FF0369A1" } };
      dashboardSheet.getRow(3).height = 22;

      // Header Status
      const statusHeaders = ["Status", "Quantidade", "Valor Total", "% do Total"];
      statusHeaders.forEach((header, idx) => {
        const cell = dashboardSheet.getCell(4, idx + 1);
        cell.value = header;
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0369A1" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Dados por status
      const statusData = [
        { status: "Aceito", count: aceitos, color: "FF10B981", bgColor: "FFD1FAE5" },
        { status: "Em Negociação", count: emNegociacao, color: "FFF59E0B", bgColor: "FFFEF3C7" },
        { status: "Recusado", count: recusados, color: "FFEF4444", bgColor: "FFFEE2E2" },
      ];

      let rowIdx = 5;
      statusData.forEach(({ status, count, color, bgColor }) => {
        const valor = budgets
          .filter(b => getStatusLabel(b.status) === status)
          .reduce((sum, b) => sum + parseFloat(b.finalTotal || b.total || 0), 0);
        const percent = totalOrcamentos > 0 ? (count / totalOrcamentos) : 0;

        dashboardSheet.getCell(rowIdx, 1).value = status;
        dashboardSheet.getCell(rowIdx, 1).font = { bold: true, color: { argb: color } };
        dashboardSheet.getCell(rowIdx, 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
        
        dashboardSheet.getCell(rowIdx, 2).value = count;
        dashboardSheet.getCell(rowIdx, 2).alignment = { horizontal: "center" };
        
        dashboardSheet.getCell(rowIdx, 3).value = valor;
        dashboardSheet.getCell(rowIdx, 3).numFmt = "R$ #,##0.00";
        dashboardSheet.getCell(rowIdx, 3).alignment = { horizontal: "center" };
        
        dashboardSheet.getCell(rowIdx, 4).value = percent;
        dashboardSheet.getCell(rowIdx, 4).numFmt = "0.00%";
        dashboardSheet.getCell(rowIdx, 4).alignment = { horizontal: "center" };

        // Bordas
        for (let col = 1; col <= 4; col++) {
          dashboardSheet.getCell(rowIdx, col).border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          };
        }
        rowIdx++;
      });

      // Linha TOTAL
      dashboardSheet.getCell(rowIdx, 1).value = "TOTAL";
      dashboardSheet.getCell(rowIdx, 1).font = { bold: true };
      dashboardSheet.getCell(rowIdx, 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F9FF" } };
      
      dashboardSheet.getCell(rowIdx, 2).value = totalOrcamentos;
      dashboardSheet.getCell(rowIdx, 2).font = { bold: true };
      dashboardSheet.getCell(rowIdx, 2).alignment = { horizontal: "center" };
      dashboardSheet.getCell(rowIdx, 2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F9FF" } };
      
      dashboardSheet.getCell(rowIdx, 3).value = valorTotal;
      dashboardSheet.getCell(rowIdx, 3).font = { bold: true };
      dashboardSheet.getCell(rowIdx, 3).numFmt = "R$ #,##0.00";
      dashboardSheet.getCell(rowIdx, 3).alignment = { horizontal: "center" };
      dashboardSheet.getCell(rowIdx, 3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F9FF" } };
      
      dashboardSheet.getCell(rowIdx, 4).value = 1;
      dashboardSheet.getCell(rowIdx, 4).font = { bold: true };
      dashboardSheet.getCell(rowIdx, 4).numFmt = "0.00%";
      dashboardSheet.getCell(rowIdx, 4).alignment = { horizontal: "center" };
      dashboardSheet.getCell(rowIdx, 4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F9FF" } };

      for (let col = 1; col <= 4; col++) {
        dashboardSheet.getCell(rowIdx, col).border = {
          top: { style: "medium", color: { argb: "FF0369A1" } },
          bottom: { style: "medium", color: { argb: "FF0369A1" } },
        };
      }

      // Análise por Dentista
      rowIdx += 3;
      dashboardSheet.getCell(rowIdx, 1).value = "ANÁLISE POR DENTISTA";
      dashboardSheet.getCell(rowIdx, 1).font = { bold: true, size: 13, color: { argb: "FF0369A1" } };
      dashboardSheet.getRow(rowIdx).height = 22;

      rowIdx++;
      // Header Dentista
      const dentistHeaders = ["Dentista", "Quantidade", "Valor Total", "Ticket Médio"];
      dentistHeaders.forEach((header, idx) => {
        const cell = dashboardSheet.getCell(rowIdx, idx + 1);
        cell.value = header;
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0369A1" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Agrupar por dentista
      const dentistStats = {};
      budgets.forEach(b => {
        const name = b.dentist?.name || "Não informado";
        if (!dentistStats[name]) {
          dentistStats[name] = { count: 0, total: 0 };
        }
        dentistStats[name].count++;
        dentistStats[name].total += parseFloat(b.finalTotal || b.total || 0);
      });

      rowIdx++;
      Object.entries(dentistStats).forEach(([name, stats]) => {
        dashboardSheet.getCell(rowIdx, 1).value = name;
        dashboardSheet.getCell(rowIdx, 2).value = stats.count;
        dashboardSheet.getCell(rowIdx, 2).alignment = { horizontal: "center" };
        dashboardSheet.getCell(rowIdx, 3).value = stats.total;
        dashboardSheet.getCell(rowIdx, 3).numFmt = "R$ #,##0.00";
        dashboardSheet.getCell(rowIdx, 3).alignment = { horizontal: "center" };
        dashboardSheet.getCell(rowIdx, 4).value = stats.total / stats.count;
        dashboardSheet.getCell(rowIdx, 4).numFmt = "R$ #,##0.00";
        dashboardSheet.getCell(rowIdx, 4).alignment = { horizontal: "center" };

        for (let col = 1; col <= 4; col++) {
          dashboardSheet.getCell(rowIdx, col).border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          };
        }
        rowIdx++;
      });

      // Análise por Paciente
      rowIdx += 2;
      dashboardSheet.getCell(rowIdx, 1).value = "ANÁLISE POR PACIENTE";
      dashboardSheet.getCell(rowIdx, 1).font = { bold: true, size: 13, color: { argb: "FF0369A1" } };
      dashboardSheet.getRow(rowIdx).height = 22;

      rowIdx++;
      // Header Paciente
      const patientHeaders = ["Paciente", "Orçamentos", "Valor Total"];
      patientHeaders.forEach((header, idx) => {
        const cell = dashboardSheet.getCell(rowIdx, idx + 1);
        cell.value = header;
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0369A1" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Agrupar por paciente
      const patientStats = {};
      budgets.forEach(b => {
        const name = b.patient?.name || "Não informado";
        if (!patientStats[name]) {
          patientStats[name] = { count: 0, total: 0 };
        }
        patientStats[name].count++;
        patientStats[name].total += parseFloat(b.finalTotal || b.total || 0);
      });

      rowIdx++;
      Object.entries(patientStats).forEach(([name, stats]) => {
        dashboardSheet.getCell(rowIdx, 1).value = name;
        dashboardSheet.getCell(rowIdx, 2).value = stats.count;
        dashboardSheet.getCell(rowIdx, 2).alignment = { horizontal: "center" };
        dashboardSheet.getCell(rowIdx, 3).value = stats.total;
        dashboardSheet.getCell(rowIdx, 3).numFmt = "R$ #,##0.00";
        dashboardSheet.getCell(rowIdx, 3).alignment = { horizontal: "center" };

        for (let col = 1; col <= 3; col++) {
          dashboardSheet.getCell(rowIdx, col).border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          };
        }
        rowIdx++;
      });

      // Ajustar larguras do Dashboard
      dashboardSheet.columns = [
        { width: 30 },
        { width: 15 },
        { width: 18 },
        { width: 15 },
      ];

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
