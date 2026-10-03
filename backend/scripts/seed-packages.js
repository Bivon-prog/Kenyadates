const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Coin packages
  const packages = [
    { name: 'Starter',  priceKsh: 100,  coins: 100,  bonusCoins: 0    },
    { name: 'Basic',    priceKsh: 250,  coins: 275,  bonusCoins: 25   },
    { name: 'Popular',  priceKsh: 500,  coins: 600,  bonusCoins: 100  },
    { name: 'Premium',  priceKsh: 1000, coins: 1300, bonusCoins: 300  },
    { name: 'VIP',      priceKsh: 2500, coins: 3500, bonusCoins: 1000 },
    { name: 'Ultimate', priceKsh: 5000, coins: 7500, bonusCoins: 2500 },
  ];

  for (const pkg of packages) {
    await prisma.coinPackage.upsert({
      where: { name: pkg.name },
      update: pkg,
      create: pkg,
    });
    console.log(`  ✅ Package: ${pkg.name} — KSh ${pkg.priceKsh} → ${pkg.coins + pkg.bonusCoins} coins`);
  }

  // Membership plans
  const plans = [
    { name: 'Free',     priceKsh: 0,    monthlyCoins: 0,   benefits: { likes: 5, superLikes: 0, boosts: 0 } },
    { name: 'Gold',     priceKsh: 999,  monthlyCoins: 200, benefits: { likes: -1, superLikes: 3, boosts: 1, seeWhoLiked: true } },
    { name: 'Platinum', priceKsh: 1899, monthlyCoins: 500, benefits: { likes: -1, superLikes: 5, boosts: 3, videoCalls: true, incognito: true } },
    { name: 'Diamond',  priceKsh: 3499, monthlyCoins: 1000, benefits: { likes: -1, superLikes: -1, boosts: -1, videoCalls: true, incognito: true, topPlacement: true } },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
    console.log(`  ✅ Plan: ${plan.name} — KSh ${plan.priceKsh}/month`);
  }

  console.log('\n✅ All packages and plans seeded!');
}

main()
  .catch(e => { console.error('Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
