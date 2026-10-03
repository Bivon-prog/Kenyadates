const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const profileCount = await prisma.profile.count();
  const walletCount = await prisma.coinWallet.count();

  console.log('\n===== DATABASE SUMMARY =====');
  console.log('Total Users:    ', userCount);
  console.log('Total Profiles: ', profileCount);
  console.log('Total Wallets:  ', walletCount);

  const users = await prisma.user.findMany({
    include: { profile: true, wallet: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  console.log('\n===== LAST 10 REGISTRATIONS =====');
  users.forEach((u, i) => {
    console.log(`\n[${i + 1}] ${u.profile?.displayName || '(no profile)'}`);
    console.log('     Email:    ', u.email);
    console.log('     Phone:    ', u.phoneNumber || '(not provided)');
    console.log('     Verified: ', u.emailVerified ? 'YES' : 'NO');
    console.log('     Age/Gender:', u.profile?.age, u.profile?.gender);
    console.log('     Location: ', `${u.profile?.city}, ${u.profile?.county}`);
    console.log('     Photos:   ', u.profile?.photos?.length ?? 0, 'uploaded');
    console.log('     Interests:', u.profile?.interests?.length ?? 0);
    console.log('     Coins:    ', u.wallet?.balance ?? 0);
    console.log('     Joined:   ', u.createdAt.toISOString().split('T')[0]);
  });

  // Check for any missing data issues
  console.log('\n===== DATA INTEGRITY CHECK =====');
  const usersWithoutProfile = await prisma.user.count({ where: { profile: null } });
  const usersWithoutWallet = await prisma.user.count({ where: { wallet: null } });
  const unverifiedUsers = await prisma.user.count({ where: { emailVerified: false } });

  console.log('Users missing profile: ', usersWithoutProfile);
  console.log('Users missing wallet:  ', usersWithoutWallet);
  console.log('Unverified users:      ', unverifiedUsers);

  if (usersWithoutProfile > 0) {
    console.log('\n⚠️  WARNING: Some users have no profile — registration may have partial failures');
  }
  if (usersWithoutWallet > 0) {
    console.log('\n⚠️  WARNING: Some users have no wallet — welcome coins may not be granted');
  }
  if (usersWithoutProfile === 0 && usersWithoutWallet === 0) {
    console.log('\n✅ All user data looks complete');
  }
}

main()
  .catch(e => { console.error('DB Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
