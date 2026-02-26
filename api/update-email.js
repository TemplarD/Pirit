const { PrismaClient } = require('@prisma/client');

async function updateEmail() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.user.update({
      where: { email: 'admin@grindermaster.ru' },
      data: { email: 'admin@gmail.com' }
    });
    console.log('✅ Email обновлен на admin@gmail.com');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateEmail();
