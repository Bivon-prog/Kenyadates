const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@kenyadates.co.ke';
  const password = 'Admin@2026!';
  const name = 'Super Admin';

  // Check if already exists
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Just promote to ADMIN
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', emailVerified: true, verificationStatus: 'VERIFIED' },
    });
    console.log(`✅ Promoted ${email} to ADMIN`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      emailVerified: true,
      role: 'ADMIN',
      verificationStatus: 'VERIFIED',
      profile: {
        create: {
          displayName: name,
          age: 30,
          gender: 'Man',
          city: 'Nairobi',
          county: 'Nairobi',
        },
      },
      wallet: { create: { balance: 9999 } },
    },
  });

  console.log('\n✅ Super Admin created!');
  console.log('   Email:   ', admin.email);
  console.log('   Password:', password);
  console.log('   Role:    ', admin.role);
  console.log('\n⚠️  Change this password after first login!\n');
}

main()
  .catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
