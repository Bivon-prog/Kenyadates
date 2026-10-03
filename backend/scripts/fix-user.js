const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || 'bivonmoriasi@gmail.com';

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true, wallet: true },
  });

  if (!user) { console.log('User not found'); return; }

  const fixes = [];

  // Fix missing profile fields
  if (!user.profile?.displayName || !user.profile?.gender) {
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        displayName: user.profile?.displayName || email.split('@')[0],
        gender: user.profile?.gender || 'Man',
      },
    });
    fixes.push('profile name/gender');
  }

  // Fix wallet — create if missing, grant coins if 0
  if (!user.wallet) {
    await prisma.coinWallet.create({
      data: { userId: user.id, balance: 150 },
    });
    await prisma.coinTransaction.create({
      data: {
        walletId: (await prisma.coinWallet.findUnique({ where: { userId: user.id } })).id,
        type: 'WELCOME',
        amount: 150,
        description: 'Welcome coins (backfill)',
      },
    });
    fixes.push('wallet created with 150 coins');
  } else if (user.wallet.balance === 0) {
    await prisma.coinWallet.update({
      where: { userId: user.id },
      data: { balance: 150 },
    });
    await prisma.coinTransaction.create({
      data: {
        walletId: user.wallet.id,
        type: 'WELCOME',
        amount: 150,
        description: 'Welcome coins (backfill)',
      },
    });
    fixes.push('150 welcome coins granted');
  }

  // Ensure verified
  if (!user.emailVerified) {
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
    fixes.push('email verified');
  }

  if (fixes.length === 0) {
    console.log(`✅ ${email} — no fixes needed, everything looks good`);
  } else {
    console.log(`✅ Fixed ${email}:`);
    fixes.forEach(f => console.log(`   - ${f}`));
  }

  // Print final state
  const updated = await prisma.user.findUnique({
    where: { email },
    include: { profile: true, wallet: true },
  });
  console.log('\nFinal state:');
  console.log('  Name:    ', updated.profile?.displayName);
  console.log('  Gender:  ', updated.profile?.gender);
  console.log('  Verified:', updated.emailVerified);
  console.log('  Coins:   ', updated.wallet?.balance ?? 0);
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());
