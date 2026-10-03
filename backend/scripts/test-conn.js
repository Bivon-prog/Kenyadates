const { PrismaClient } = require('@prisma/client');

async function tryConnect(attempt) {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.user.count();
    console.log(`✅ Connected (attempt ${attempt})! Users: ${count}`);
    await prisma.$disconnect();
    return true;
  } catch (e) {
    console.log(`❌ Attempt ${attempt} failed: ${e.message.split('\n')[0]}`);
    await prisma.$disconnect();
    return false;
  }
}

async function main() {
  for (let i = 1; i <= 5; i++) {
    const ok = await tryConnect(i);
    if (ok) break;
    await new Promise(r => setTimeout(r, 2000));
  }
}

main();
