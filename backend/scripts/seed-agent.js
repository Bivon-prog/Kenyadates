const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || 'agent@kenyadates.co.ke';
  const password = process.argv[3] || 'Agent@2026!';
  const name = process.argv[4] || 'KenyaDates Agent';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'MODERATOR', emailVerified: true },
    });
    console.log(`✅ Promoted ${email} to AGENT (MODERATOR)`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      emailVerified: true,
      role: 'MODERATOR',
      verificationStatus: 'VERIFIED',
      profile: {
        create: {
          displayName: name,
          age: 25,
          gender: 'Man',
          city: 'Nairobi',
          county: 'Nairobi',
        },
      },
      wallet: { create: { balance: 0 } },
    },
  });

  console.log(`\n✅ Agent created: ${email} / ${password}`);
}

main()
  .catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
