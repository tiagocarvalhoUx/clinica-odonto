import prisma from "../config/database.js";

export const patientService = {
  async getAll() {
    return await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { budgets: true },
        },
      },
    });
  },

  async getById(id) {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) },
      include: {
        budgets: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      throw { statusCode: 404, message: "Paciente não encontrado" };
    }

    return patient;
  },

  async create(data) {
    return await prisma.patient.create({
      data,
      include: {
        _count: {
          select: { budgets: true },
        },
      },
    });
  },

  async update(id, data) {
    try {
      return await prisma.patient.update({
        where: { id: parseInt(id) },
        data,
        include: {
          _count: {
            select: { budgets: true },
          },
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw { statusCode: 404, message: "Paciente não encontrado" };
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      await prisma.patient.delete({
        where: { id: parseInt(id) },
      });
      return { message: "Paciente excluído com sucesso" };
    } catch (error) {
      if (error.code === "P2025") {
        throw { statusCode: 404, message: "Paciente não encontrado" };
      }
      throw error;
    }
  },
};
