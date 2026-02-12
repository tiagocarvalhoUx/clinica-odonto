import bcrypt from 'bcrypt';
import prisma from './src/config/database.js';

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  console.log('Hash gerado:', hashedPassword);
  
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@clinica.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Usuário criado:', user);
  } catch (error) {
    console.error('Erro:', error);
  }
}

createAdmin();
