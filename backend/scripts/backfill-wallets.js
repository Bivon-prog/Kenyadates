const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find all users without a wallet
  const usersWithoutWallet = await prisma.user.findMany({
    where: { wallet: null },
    select: { id: true, email: true, emailVerified: true },
  });

  console.log(`Found ${usersWithoutWallet.length} users without wallets. Creating...`);

  for (const user of usersWithoutWallet) {
    // Create wallet with 0 coins (they didn't get welcome coins originally)
    await prisma.coinWallet.create({
      data: {
        userId: user.id,
        balance: 0,
      },
    });
    console.log(`  ✅ Created wallet for ${user.email}`);
  }

  // Also fix unverified users from test registrations
  const unverified = await prisma.user.count({ where: { emailVerified: false } });
  if (unverified > 0) {
    await prisma.user.updateMany({
      where: { emailVerified: false },
      data: { emailVerified: true },
    });
    console.log(`\n✅ Marked ${unverified} unverified test users as verified`);
  }

  // Final summary
  const totalUsers = await prisma.user.count();
  const totalWallets = await prisma.coinWallet.count();
  console.log(`\n===== FINAL STATE =====`);
  console.log(`Users:   ${totalUsers}`);
  console.log(`Wallets: ${totalWallets}`);
  console.log(totalUsers === totalWallets ? '✅ All users have wallets' : '⚠️  Mismatch!');
}

main()
  .catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
