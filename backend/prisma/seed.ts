const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Coin Packages...');
  const packages = [
    { name: 'Starter', priceKsh: 100, coins: 100, bonusCoins: 0 },
    { name: 'Basic', priceKsh: 250, coins: 275, bonusCoins: 0 },
    { name: 'Popular', priceKsh: 500, coins: 600, bonusCoins: 0 },
    { name: 'Premium', priceKsh: 1000, coins: 1300, bonusCoins: 0 },
    { name: 'VIP', priceKsh: 2500, coins: 3500, bonusCoins: 0 },
    { name: 'Ultimate', priceKsh: 5000, coins: 7500, bonusCoins: 0 },
  ];

  for (const pkg of packages) {
    await prisma.coinPackage.upsert({
      where: { name: pkg.name },
      update: pkg,
      create: pkg,
    });
  }

  console.log('Seeding Memberships...');
  const memberships = [
    { name: 'Free', priceKsh: 0, monthlyCoins: 0, benefits: { msgLimit: 'limited' } },
    { name: 'Gold', priceKsh: 999, monthlyCoins: 100, benefits: { msgLimit: 'unlimited', visibility: 'high' } },
    { name: 'Platinum', priceKsh: 1999, monthlyCoins: 250, benefits: { msgLimit: 'unlimited', calls: 'enabled' } },
    { name: 'Diamond', priceKsh: 3999, monthlyCoins: 500, benefits: { priority: true, support: 'priority' } },
  ];

  for (const plan of memberships) {
    await prisma.membershipPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
