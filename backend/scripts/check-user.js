const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || 'bivonmoriasi@gmail.com';
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
      wallet: { include: { transactions: { orderBy: { createdAt: 'desc' }, take: 5 } } },
      sentLikes: true,
      matches1: true,
      matches2: true,
    },
  });

  if (!user) {
    console.log(`No user found with email: ${email}`);
    return;
  }

  console.log('\n===== USER RECORD =====');
  console.log('ID:           ', user.id);
  console.log('Email:        ', user.email);
  console.log('Phone:        ', user.phoneNumber || '(not set)');
  console.log('Verified:     ', user.emailVerified ? '✅ YES' : '❌ NO');
  console.log('Role:         ', user.role);
  console.log('KYC Status:   ', user.verificationStatus);
  console.log('Created:      ', user.createdAt.toISOString().split('T')[0]);

  if (user.profile) {
    console.log('\n===== PROFILE =====');
    console.log('Name:         ', user.profile.displayName);
    console.log('Age:          ', user.profile.age);
    console.log('Gender:       ', user.profile.gender);
    console.log('City:         ', user.profile.city);
    console.log('County:       ', user.profile.county);
    console.log('Bio:          ', user.profile.bio || '(empty)');
    console.log('Photos:       ', user.profile.photos.length, 'uploaded');
    console.log('Interests:    ', user.profile.interests.join(', ') || '(none set)');
  } else {
    console.log('\n⚠️  NO PROFILE FOUND');
  }

  if (user.wallet) {
    console.log('\n===== WALLET =====');
    console.log('Balance:      ', user.wallet.balance, 'coins');
    console.log('Transactions: ', user.wallet.transactions.length);
    user.wallet.transactions.forEach(t => {
      console.log(`  ${t.type}: ${t.amount > 0 ? '+' : ''}${t.amount} — ${t.description || ''} (${t.createdAt.toISOString().split('T')[0]})`);
    });
  }

  console.log('\n===== ACTIVITY =====');
  console.log('Likes sent:   ', user.sentLikes.length);
  console.log('Matches:      ', user.matches1.length + user.matches2.length);
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect());
