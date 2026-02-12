import prisma from "../config/database.js";

export const budgetService = {
  async getAll() {
    return await prisma.budget.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        dentist: {
          select: {
            id: true,
            name: true,
            cro: true,
            specialty: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });
  },

  async getById(id) {
    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        dentist: {
          select: {
            id: true,
            name: true,
            cro: true,
            specialty: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    if (!budget) {
      throw { statusCode: 404, message: "Orçamento não encontrado" };
    }

    return budget;
  },

  async getByPatientId(patientId) {
    return await prisma.budget.findMany({
      where: { patientId: parseInt(patientId) },
      orderBy: { createdAt: "desc" },
      include: {
        dentist: {
          select: {
            id: true,
            name: true,
            cro: true,
            specialty: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });
  },

  async create({ patientId, dentistId, userId, items, notes, discount = 0 }) {
    console.log("Creating budget:", { patientId, dentistId, userId });
    
    // Calculate totals
    const total = items.reduce(
      (sum, item) =>
        sum +
        parseFloat(item.unitPrice || item.price) * parseInt(item.quantity || 1),
      0,
    );
    const discountAmount = parseFloat(discount) || 0;
    const finalTotal = total - discountAmount;

    // Create budget with items
    const budget = await prisma.budget.create({
      data: {
        patientId: parseInt(patientId),
        dentistId: dentistId ? parseInt(dentistId) : null,
        createdBy: parseInt(userId),
        total,
        discount: discountAmount,
        finalTotal,
        notes: notes || null,
        items: {
          create: items.map((item) => {
            const unitPrice = parseFloat(item.unitPrice || item.price);
            const quantity = parseInt(item.quantity || 1);
            return {
              description: item.description,
              unitPrice,
              quantity,
              total: unitPrice * quantity,
            };
          }),
        },
      },
      select: {
        id: true,
      },
    });

    console.log("Budget created with id:", budget.id);

    // Buscar o orçamento completo separadamente
    return await this.getById(budget.id);
  },

  async update(id, data) {
    const { items, discount, ...budgetData } = data;

    try {
      // If items are provided, update them
      if (items && items.length > 0) {
        // Calculate new totals
        const total = items.reduce(
          (sum, item) =>
            sum +
            parseFloat(item.unitPrice || item.price) *
              parseInt(item.quantity || 1),
          0,
        );
        const discountAmount = parseFloat(discount) || 0;
        const finalTotal = total - discountAmount;

        budgetData.total = total;
        budgetData.discount = discountAmount;
        budgetData.finalTotal = finalTotal;

        // Delete old items and create new ones
        await prisma.budgetItem.deleteMany({
          where: { budgetId: parseInt(id) },
        });

        return await prisma.budget.update({
          where: { id: parseInt(id) },
          data: {
            ...budgetData,
            dentistId: budgetData.dentistId
              ? parseInt(budgetData.dentistId)
              : null,
            items: {
              create: items.map((item) => {
                const unitPrice = parseFloat(item.unitPrice || item.price);
                const quantity = parseInt(item.quantity || 1);
                return {
                  description: item.description,
                  unitPrice,
                  quantity,
                  total: unitPrice * quantity,
                };
              }),
            },
          },
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            dentist: {
              select: {
                id: true,
                name: true,
                cro: true,
                specialty: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: true,
          },
        });
      }

      // If only updating budget data (status, notes, discount)
      if (discount !== undefined) {
        const currentBudget = await prisma.budget.findUnique({
          where: { id: parseInt(id) },
          include: { items: true },
        });

        const total = currentBudget.items.reduce(
          (sum, item) => sum + parseFloat(item.total),
          0,
        );
        const discountAmount = parseFloat(discount);
        budgetData.total = total;
        budgetData.discount = discountAmount;
        budgetData.finalTotal = total - discountAmount;
      }

      return await prisma.budget.update({
        where: { id: parseInt(id) },
        data: {
          ...budgetData,
          dentistId: budgetData.dentistId
            ? parseInt(budgetData.dentistId)
            : null,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          dentist: {
            select: {
              id: true,
              name: true,
              cro: true,
              specialty: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw { statusCode: 404, message: "Orçamento não encontrado" };
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      await prisma.budget.delete({
        where: { id: parseInt(id) },
      });
      return { message: "Orçamento excluído com sucesso" };
    } catch (error) {
      if (error.code === "P2025") {
        throw { statusCode: 404, message: "Orçamento não encontrado" };
      }
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      return await prisma.budget.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          dentist: {
            select: {
              id: true,
              name: true,
              cro: true,
              specialty: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw { statusCode: 404, message: "Orçamento não encontrado" };
      }
      throw error;
    }
  },
};
