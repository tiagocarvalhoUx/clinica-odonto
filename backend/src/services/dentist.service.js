import prisma from "../config/database.js";

export const dentistService = {
  async getAll() {
    return await prisma.dentist.findMany({
      orderBy: { name: "asc" },
    });
  },

  async getActive() {
    return await prisma.dentist.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  },

  async getById(id) {
    const dentist = await prisma.dentist.findUnique({
      where: { id: parseInt(id) },
    });

    if (!dentist) {
      throw { statusCode: 404, message: "Dentista não encontrado" };
    }

    return dentist;
  },

  async create(data) {
    try {
      return await prisma.dentist.create({
        data: {
          name: data.name,
          cro: data.cro,
          phone: data.phone || null,
          email: data.email || null,
          specialty: data.specialty || null,
          active: data.active !== undefined ? data.active : true,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw { statusCode: 400, message: "CRO já cadastrado" };
      }
      throw error;
    }
  },

  async update(id, data) {
    try {
      return await prisma.dentist.update({
        where: { id: parseInt(id) },
        data: {
          name: data.name,
          cro: data.cro,
          phone: data.phone || null,
          email: data.email || null,
          specialty: data.specialty || null,
          active: data.active !== undefined ? data.active : undefined,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw { statusCode: 400, message: "CRO já cadastrado" };
      }
      if (error.code === "P2025") {
        throw { statusCode: 404, message: "Dentista não encontrado" };
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      await prisma.dentist.delete({
        where: { id: parseInt(id) },
      });
      return { message: "Dentista excluído com sucesso" };
    } catch (error) {
      if (error.code === "P2025") {
        throw { statusCode: 404, message: "Dentista não encontrado" };
      }
      throw error;
    }
  },
};
