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

      // Cores do tema
      const COLOR_PRIMARY = "1F4E79";      // Azul escuro (títulos)
      const COLOR_HEADER = "1F4E79";       // Azul escuro (headers)
      const COLOR_TEXT = "000000";         // Preto
      const COLOR_GRAY = "666666";         // Cinza
      const COLOR_STATUS_ACEITO = "C6EFCE"; // Verde claro
      const COLOR_STATUS_NEGOCIACAO = "FFEB9C"; // Amarelo claro
      const COLOR_STATUS_RECUSADO = "FFC7CE"; // Vermelho claro

      // ============================================
      // SHEET 1: CAPA
      // ============================================
      const capaSheet = workbook.addWorksheet("Capa");
      
      // Configurar larguras das colunas
      capaSheet.columns = [
        { width: 5 },   // A
        { width: 25 },  // B
        { width: 15 },  // C
        { width: 25 },  // D
        { width: 15 },  // E
      ];

      // Linha 2: Título principal
      capaSheet.mergeCells("B2:E2");
      capaSheet.getCell("B2").value = "RELATÓRIO DE ORÇAMENTOS";
      capaSheet.getCell("B2").font = { bold: true, size: 18, color: { argb: COLOR_PRIMARY } };
      capaSheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };
      capaSheet.getRow(2).height = 30;

      // Linha 3: Subtítulo
      capaSheet.mergeCells("B3:E3");
      capaSheet.getCell("B3").value = "Clínica Odontológica - Análise de Orçamentos";
      capaSheet.getCell("B3").font = { size: 11, color: { argb: COLOR_GRAY } };
      capaSheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };

      // Linha 5: Data
      capaSheet.mergeCells("B5:E5");
      capaSheet.getCell("B5").value = `Data do Relatório: ${new Date().toLocaleDateString("pt-BR")}`;
      capaSheet.getCell("B5").font = { size: 10, color: { argb: COLOR_GRAY } };
      capaSheet.getCell("B5").alignment = { horizontal: "center" };

      // Linha 7: Seção Métricas Chave
      capaSheet.mergeCells("B7:E7");
      capaSheet.getCell("B7").value = "MÉTRICAS CHAVE";
      capaSheet.getCell("B7").font = { bold: true, size: 12, color: { argb: COLOR_PRIMARY } };
      capaSheet.getCell("B7").alignment = { horizontal: "left" };
      capaSheet.getRow(7).height = 22;

      // Linha 9-10: Total de Orçamentos | Valor Total
      capaSheet.getCell("B9").value = "Total de Orçamentos";
      capaSheet.getCell("B9").font = { size: 10, color: { argb: COLOR_GRAY } };
      capaSheet.getCell("B10").value = totalOrcamentos;
      capaSheet.getCell("B10").font = { bold: true, size: 14, color: { argb: COLOR_TEXT } };

      capaSheet.getCell("D9").value = "Valor Total";
      capaSheet.getCell("D9").font = { size: 10, color: { argb: COLOR_GRAY } };
      capaSheet.getCell("D10").value = valorTotal;
      capaSheet.getCell("D10").font = { bold: true, size: 14, color: { argb: COLOR_TEXT } };
      capaSheet.getCell("D10").numFmt = '"R$" #,##0.00';

      // Linha 11-12: Orçamentos Aceitos | Em Negociação
      capaSheet.getCell("B11").value = "Orçamentos Aceitos";
      capaSheet.getCell("B11").font = { size: 10, color: { argb: COLOR_GRAY } };
      capaSheet.getCell("B12").value = aceitos;
      capaSheet.getCell("B12").font = { bold: true, size: 14, color: { argb: COLOR_TEXT } };

      capaSheet.getCell("D11").value = "Em Negociação";
      capaSheet.getCell("D11").font = { size: 10, color: { argb: COLOR_GRAY } };
      capaSheet.getCell("D12").value = emNegociacao;
      capaSheet.getCell("D12").font = { bold: true, size: 14, color: { argb: COLOR_TEXT } };

      // Linha 13-14: Ticket Médio
      capaSheet.getCell("B13").value = "Ticket Médio";
      capaSheet.getCell("B13").font = { size: 10, color: { argb: COLOR_GRAY } };
      capaSheet.getCell("B14").value = ticketMedio;
      capaSheet.getCell("B14").font = { bold: true, size: 14, color: { argb: COLOR_TEXT } };
      capaSheet.getCell("B14").numFmt = '"R$" #,##0.00';

      // Linha 16: Conteúdo do Relatório
      capaSheet.mergeCells("B16:E16");
      capaSheet.getCell("B16").value = "CONTEÚDO DO RELATÓRIO";
      capaSheet.getCell("B16").font = { bold: true, size: 12, color: { argb: COLOR_PRIMARY } };
      capaSheet.getCell("B16").alignment = { horizontal: "left" };
      capaSheet.getRow(16).height = 22;

      // Linha 18-19: Links para abas
      capaSheet.getCell("B18").value = "Orçamentos";
      capaSheet.getCell("B18").font = { bold: true, size: 11, color: { argb: COLOR_PRIMARY } };
      capaSheet.getCell("D18").value = "Lista completa de orçamentos com filtros";
      capaSheet.getCell("D18").font = { size: 10, color: { argb: COLOR_GRAY } };

      capaSheet.getCell("B19").value = "Dashboard";
      capaSheet.getCell("B19").font = { bold: true, size: 11, color: { argb: COLOR_PRIMARY } };
      capaSheet.getCell("D19").value = "Gráficos e análises visuais";
      capaSheet.getCell("D19").font = { size: 10, color: { argb: COLOR_GRAY } };

      // ============================================
      // SHEET 2: ORÇAMENTOS
      // ============================================
      const budgetsSheet = workbook.addWorksheet("Orcamentos", {
        views: [{ state: "frozen", ySplit: 3 }],
      });

      // Configurar colunas (sem ID visível)
      budgetsSheet.columns = [
        { key: "id", width: 8, hidden: true },  // ID oculto
        { key: "patient", width: 22 },          // Paciente
        { key: "phone", width: 16 },            // Telefone
        { key: "email", width: 28 },            // Email
        { key: "dentist", width: 18 },          // Dentista
        { key: "cro", width: 12 },              // CRO
        { key: "total", width: 14 },            // Valor Total
        { key: "status", width: 14 },           // Status
        { key: "notes", width: 25 },            // Observações
        { key: "user", width: 16 },             // Criado por
      ];

      // Linha 1: Título
      budgetsSheet.mergeCells("A1:J1");
      budgetsSheet.getCell("A1").value = "ORÇAMENTOS";
      budgetsSheet.getCell("A1").font = { bold: true, size: 16, color: { argb: COLOR_PRIMARY } };
      budgetsSheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
      budgetsSheet.getRow(1).height = 28;

      // Linha 2: Vazia (espaço)
      budgetsSheet.getRow(2).height = 5;

      // Linha 3: Headers
      const headers = ["Paciente", "Telefone", "Email", "Dentista", "CRO", "Valor Total", "Status", "Observações", "Criado por"];
      headers.forEach((header, idx) => {
        const cell = budgetsSheet.getCell(3, idx + 2); // Começa na coluna B (índice 2)
        cell.value = header;
        cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "D9D9D9" } },
          bottom: { style: "thin", color: { argb: "D9D9D9" } },
          left: { style: "thin", color: { argb: "D9D9D9" } },
          right: { style: "thin", color: { argb: "D9D9D9" } },
        };
      });
      budgetsSheet.getRow(3).height = 20;

      // Adicionar dados
      budgets.forEach((budget) => {
        const rowData = {
          id: budget.id,
          patient: budget.patient?.name || "-",
          phone: budget.patient?.phone || "-",
          email: budget.patient?.email || "-",
          dentist: budget.dentist?.name || "-",
          cro: budget.dentist?.cro || "-",
          total: parseFloat(budget.finalTotal || budget.total || 0),
          status: getStatusLabel(budget.status),
          notes: budget.notes || "-",
          user: budget.user?.name || "-",
        };

        const row = budgetsSheet.addRow(rowData);
        const rowNum = row.number;

        // Formatar cada célula
        for (let col = 2; col <= 10; col++) {
          const cell = budgetsSheet.getCell(rowNum, col);
          cell.border = {
            top: { style: "thin", color: { argb: "E7E6E6" } },
            bottom: { style: "thin", color: { argb: "E7E6E6" } },
            left: { style: "thin", color: { argb: "E7E6E6" } },
            right: { style: "thin", color: { argb: "E7E6E6" } },
          };
          cell.alignment = { vertical: "middle", wrapText: true };
        }

        // Formato moeda para Valor Total (coluna G = 7)
        budgetsSheet.getCell(rowNum, 7).numFmt = '"R$" #,##0.00';
        budgetsSheet.getCell(rowNum, 7).alignment = { horizontal: "right", vertical: "middle" };

        // Status com cor de fundo (coluna H = 8)
        const statusCell = budgetsSheet.getCell(rowNum, 8);
        if (budget.status === "ACEITO") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_STATUS_ACEITO } };
          statusCell.font = { color: { argb: "006100" } }; // Verde escuro
        } else if (budget.status === "EM_NEGOCIACAO") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_STATUS_NEGOCIACAO } };
          statusCell.font = { color: { argb: "9C5700" } }; // Laranja/Amarelo escuro
        } else if (budget.status === "RECUSADO") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_STATUS_RECUSADO } };
          statusCell.font = { color: { argb: "9C0006" } }; // Vermelho escuro
        }
        statusCell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Linha de Totais
      const lastDataRow = budgetsSheet.rowCount;
      const totalRow = lastDataRow + 2;

      // "Total:"
      budgetsSheet.getCell(totalRow, 6).value = "Total:";
      budgetsSheet.getCell(totalRow, 6).font = { bold: true, size: 11 };
      budgetsSheet.getCell(totalRow, 6).alignment = { horizontal: "right", vertical: "middle" };

      // Valor total
      budgetsSheet.getCell(totalRow, 7).value = valorTotal;
      budgetsSheet.getCell(totalRow, 7).font = { bold: true, size: 11, color: { argb: COLOR_PRIMARY } };
      budgetsSheet.getCell(totalRow, 7).numFmt = '"R$" #,##0.00';
      budgetsSheet.getCell(totalRow, 7).alignment = { horizontal: "right", vertical: "middle" };
      budgetsSheet.getCell(totalRow, 7).border = {
        top: { style: "medium", color: { argb: COLOR_PRIMARY } },
        bottom: { style: "medium", color: { argb: COLOR_PRIMARY } },
      };

      // "Média:"
      budgetsSheet.getCell(totalRow, 8).value = "Média:";
      budgetsSheet.getCell(totalRow, 8).font = { bold: true, size: 11 };
      budgetsSheet.getCell(totalRow, 8).alignment = { horizontal: "right", vertical: "middle" };

      // Valor médio (span duas colunas para a direita)
      budgetsSheet.mergeCells(`I${totalRow}:J${totalRow}`);
      budgetsSheet.getCell(totalRow, 9).value = ticketMedio;
      budgetsSheet.getCell(totalRow, 9).font = { bold: true, size: 11, color: { argb: COLOR_PRIMARY } };
      budgetsSheet.getCell(totalRow, 9).numFmt = '"R$" #,##0.00';
      budgetsSheet.getCell(totalRow, 9).alignment = { horizontal: "right", vertical: "middle" };
      budgetsSheet.getCell(totalRow, 9).border = {
        top: { style: "medium", color: { argb: COLOR_PRIMARY } },
        bottom: { style: "medium", color: { argb: COLOR_PRIMARY } },
      };

      // Auto-filter
      budgetsSheet.autoFilter = {
        from: { row: 3, column: 2 },
        to: { row: 3, column: 10 },
      };

      // ============================================
      // SHEET 3: DASHBOARD COM GRÁFICOS
      // ============================================
      const dashboardSheet = workbook.addWorksheet("Dashboard");

      // Configurar colunas para layout lado a lado
      dashboardSheet.columns = [
        { width: 3 },   // A
        { width: 12 },  // B
        { width: 12 },  // C
        { width: 14 },  // D
        { width: 12 },  // E
        { width: 3 },   // F (espaço)
        { width: 18 },  // G
        { width: 18 },  // H
        { width: 18 },  // I
        { width: 3 },   // J (espaço)
        { width: 18 },  // K
        { width: 18 },  // L
      ];

      // Título principal
      dashboardSheet.mergeCells("B1:L1");
      dashboardSheet.getCell("B1").value = "DASHBOARD DE ORÇAMENTOS";
      dashboardSheet.getCell("B1").font = { bold: true, size: 16, color: { argb: COLOR_PRIMARY } };
      dashboardSheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };
      dashboardSheet.getRow(1).height = 28;

      // ============================================
      // TABELA: ANÁLISE POR STATUS
      // ============================================
      dashboardSheet.getCell("B3").value = "ANÁLISE POR STATUS";
      dashboardSheet.getCell("B3").font = { bold: true, size: 11, color: { argb: COLOR_PRIMARY } };

      // Headers
      const statusHeaders = ["Status", "Quantidade", "Valor Total", "% do Total"];
      statusHeaders.forEach((h, i) => {
        const cell = dashboardSheet.getCell(4, i + 2);
        cell.value = h;
        cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 10 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "D9D9D9" } },
          bottom: { style: "thin", color: { argb: "D9D9D9" } },
          left: { style: "thin", color: { argb: "D9D9D9" } },
          right: { style: "thin", color: { argb: "D9D9D9" } },
        };
      });

      // Dados por status
      const statusRows = [
        { label: "Aceito", count: aceitos, color: COLOR_STATUS_ACEITO, textColor: "006100" },
        { label: "Em Negociação", count: emNegociacao, color: COLOR_STATUS_NEGOCIACAO, textColor: "9C5700" },
        { label: "Recusado", count: recusados, color: COLOR_STATUS_RECUSADO, textColor: "9C0006" },
      ];

      let rowIdx = 5;
      statusRows.forEach(({ label, count, color, textColor }) => {
        const valor = budgets
          .filter(b => getStatusLabel(b.status) === label)
          .reduce((sum, b) => sum + parseFloat(b.finalTotal || b.total || 0), 0);
        const percent = totalOrcamentos > 0 ? count / totalOrcamentos : 0;

        // Status
        dashboardSheet.getCell(rowIdx, 2).value = label;
        dashboardSheet.getCell(rowIdx, 2).font = { bold: true, color: { argb: textColor } };
        dashboardSheet.getCell(rowIdx, 2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
        dashboardSheet.getCell(rowIdx, 2).alignment = { horizontal: "center" };

        // Quantidade
        dashboardSheet.getCell(rowIdx, 3).value = count;
        dashboardSheet.getCell(rowIdx, 3).alignment = { horizontal: "center" };

        // Valor Total
        dashboardSheet.getCell(rowIdx, 4).value = valor;
        dashboardSheet.getCell(rowIdx, 4).numFmt = '"R$" #,##0.00';
        dashboardSheet.getCell(rowIdx, 4).alignment = { horizontal: "right" };

        // Percentual
        dashboardSheet.getCell(rowIdx, 5).value = percent;
        dashboardSheet.getCell(rowIdx, 5).numFmt = "0.00%";
        dashboardSheet.getCell(rowIdx, 5).alignment = { horizontal: "center" };

        // Bordas
        for (let c = 2; c <= 5; c++) {
          dashboardSheet.getCell(rowIdx, c).border = {
            top: { style: "thin", color: { argb: "E7E6E6" } },
            bottom: { style: "thin", color: { argb: "E7E6E6" } },
            left: { style: "thin", color: { argb: "E7E6E6" } },
            right: { style: "thin", color: { argb: "E7E6E6" } },
          };
        }
        rowIdx++;
      });

      // Linha TOTAL
      dashboardSheet.getCell(rowIdx, 2).value = "TOTAL";
      dashboardSheet.getCell(rowIdx, 2).font = { bold: true };
      dashboardSheet.getCell(rowIdx, 3).value = totalOrcamentos;
      dashboardSheet.getCell(rowIdx, 3).font = { bold: true };
      dashboardSheet.getCell(rowIdx, 3).alignment = { horizontal: "center" };
      dashboardSheet.getCell(rowIdx, 4).value = valorTotal;
      dashboardSheet.getCell(rowIdx, 4).font = { bold: true };
      dashboardSheet.getCell(rowIdx, 4).numFmt = '"R$" #,##0.00';
      dashboardSheet.getCell(rowIdx, 4).alignment = { horizontal: "right" };
      dashboardSheet.getCell(rowIdx, 5).value = 1;
      dashboardSheet.getCell(rowIdx, 5).font = { bold: true };
      dashboardSheet.getCell(rowIdx, 5).numFmt = "0.00%";
      dashboardSheet.getCell(rowIdx, 5).alignment = { horizontal: "center" };

      for (let c = 2; c <= 5; c++) {
        dashboardSheet.getCell(rowIdx, c).border = {
          top: { style: "medium", color: { argb: COLOR_PRIMARY } },
          bottom: { style: "medium", color: { argb: COLOR_PRIMARY } },
        };
      }

      // ============================================
      // TABELA: ANÁLISE POR DENTISTA
      // ============================================
      rowIdx += 2;
      dashboardSheet.getCell(rowIdx, 2).value = "ANÁLISE POR DENTISTA";
      dashboardSheet.getCell(rowIdx, 2).font = { bold: true, size: 11, color: { argb: COLOR_PRIMARY } };

      rowIdx++;
      const dentistHeaders = ["Dentista", "Quantidade", "Valor Total", "Ticket Médio"];
      dentistHeaders.forEach((h, i) => {
        const cell = dashboardSheet.getCell(rowIdx, i + 2);
        cell.value = h;
        cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 10 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "D9D9D9" } },
          bottom: { style: "thin", color: { argb: "D9D9D9" } },
          left: { style: "thin", color: { argb: "D9D9D9" } },
          right: { style: "thin", color: { argb: "D9D9D9" } },
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
        dashboardSheet.getCell(rowIdx, 2).value = name;
        dashboardSheet.getCell(rowIdx, 2).alignment = { horizontal: "left" };
        dashboardSheet.getCell(rowIdx, 3).value = stats.count;
        dashboardSheet.getCell(rowIdx, 3).alignment = { horizontal: "center" };
        dashboardSheet.getCell(rowIdx, 4).value = stats.total;
        dashboardSheet.getCell(rowIdx, 4).numFmt = '"R$" #,##0.00';
        dashboardSheet.getCell(rowIdx, 4).alignment = { horizontal: "right" };
        dashboardSheet.getCell(rowIdx, 5).value = stats.total / stats.count;
        dashboardSheet.getCell(rowIdx, 5).numFmt = '"R$" #,##0.00';
        dashboardSheet.getCell(rowIdx, 5).alignment = { horizontal: "right" };

        for (let c = 2; c <= 5; c++) {
          dashboardSheet.getCell(rowIdx, c).border = {
            top: { style: "thin", color: { argb: "E7E6E6" } },
            bottom: { style: "thin", color: { argb: "E7E6E6" } },
            left: { style: "thin", color: { argb: "E7E6E6" } },
            right: { style: "thin", color: { argb: "E7E6E6" } },
          };
        }
        rowIdx++;
      });

      // ============================================
      // TABELA: ANÁLISE POR PACIENTE
      // ============================================
      rowIdx += 2;
      dashboardSheet.getCell(rowIdx, 2).value = "ANÁLISE POR PACIENTE";
      dashboardSheet.getCell(rowIdx, 2).font = { bold: true, size: 11, color: { argb: COLOR_PRIMARY } };

      rowIdx++;
      const patientHeaders = ["Paciente", "Orçamentos", "Valor Total"];
      patientHeaders.forEach((h, i) => {
        const cell = dashboardSheet.getCell(rowIdx, i + 2);
        cell.value = h;
        cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 10 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "D9D9D9" } },
          bottom: { style: "thin", color: { argb: "D9D9D9" } },
          left: { style: "thin", color: { argb: "D9D9D9" } },
          right: { style: "thin", color: { argb: "D9D9D9" } },
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
        dashboardSheet.getCell(rowIdx, 2).value = name;
        dashboardSheet.getCell(rowIdx, 2).alignment = { horizontal: "left" };
        dashboardSheet.getCell(rowIdx, 3).value = stats.count;
        dashboardSheet.getCell(rowIdx, 3).alignment = { horizontal: "center" };
        dashboardSheet.getCell(rowIdx, 4).value = stats.total;
        dashboardSheet.getCell(rowIdx, 4).numFmt = '"R$" #,##0.00';
        dashboardSheet.getCell(rowIdx, 4).alignment = { horizontal: "right" };

        for (let c = 2; c <= 4; c++) {
          dashboardSheet.getCell(rowIdx, c).border = {
            top: { style: "thin", color: { argb: "E7E6E6" } },
            bottom: { style: "thin", color: { argb: "E7E6E6" } },
            left: { style: "thin", color: { argb: "E7E6E6" } },
            right: { style: "thin", color: { argb: "E7E6E6" } },
          };
        }
        rowIdx++;
      });

      // ============================================
      // GRÁFICOS
      // ============================================
      
      // Gráfico de Pizza - Distribuição por Status
      const pieChart = workbook.addChart({
        type: "pie",
        title: "Distribuição por Status",
      });

      pieChart.addData({
        labels: ["Aceito", "Em Negociação"],
        values: [aceitos, emNegociacao],
        seriesName: "Quantidade",
      });

      pieChart.setPosition("G3", "I13");
      dashboardSheet.addChart(pieChart);

      // Gráfico de Barras - Valor por Dentista
      const barChart = workbook.addChart({
        type: "bar",
        title: "Valor Total por Dentista",
        xAxis: { title: "Dentista" },
        yAxis: { title: "Valor (R$)" },
      });

      const dentistNames = Object.keys(dentistStats);
      const dentistValues = dentistNames.map(name => dentistStats[name].total);

      barChart.addData({
        labels: dentistNames,
        values: dentistValues,
        seriesName: "Valor Total",
      });

      barChart.setPosition("G15", "I28");
      dashboardSheet.addChart(barChart);

      // Gráfico de Barras Horizontal - Valor por Paciente
      const patientBarChart = workbook.addChart({
        type: "bar",
        subtype: "horizontal",
        title: "Valor Total por Paciente",
        xAxis: { title: "Valor (R$)" },
        yAxis: { title: "Paciente" },
      });

      const patientNames = Object.keys(patientStats);
      const patientValues = patientNames.map(name => patientStats[name].total);

      patientBarChart.addData({
        labels: patientNames,
        values: patientValues,
        seriesName: "Valor Total",
      });

      patientBarChart.setPosition("K3", "L20");
      dashboardSheet.addChart(patientBarChart);

      // ============================================
      // GERAR E ENVIAR
      // ============================================
      const buffer = await workbook.xlsx.writeBuffer();

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
        fgColor: { argb: "FF1F4E79" },
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
