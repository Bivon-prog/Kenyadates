import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gradient_button.dart';

class MembershipScreen extends StatefulWidget {
  const MembershipScreen({super.key});
  @override
  State<MembershipScreen> createState() => _MembershipScreenState();
}

class _MembershipScreenState extends State<MembershipScreen> {
  String _selectedPlan = 'gold';
  bool _showCoins = false;

  final _plans = [
    _Plan(id: 'basic', name: 'Basic', emoji: '🆓', color: AppColors.textSecondary, price: 'Free', period: '',
      features: ['Browse profiles', '5 likes/day', 'Basic filters', 'Standard chat']),
    _Plan(id: 'gold', name: 'Gold', emoji: '👑', color: AppColors.accentGold, price: 'KES 999', period: '/month',
      features: ['Unlimited likes', 'See who liked you', 'Advanced filters', 'Read receipts', 'Priority in search', '50 coins/month']),
    _Plan(id: 'platinum', name: 'Platinum', emoji: '💎', color: const Color(0xFFE5E4E2), price: 'KES 1,999', period: '/month',
      features: ['All Gold features', 'Video calls', 'Invisible browsing', 'Super Likes ×5', 'Profile boost ×2/week', '150 coins/month']),
    _Plan(id: 'diamond', name: 'Diamond', emoji: '💫', color: AppColors.accentPurple, price: 'KES 3,999', period: '/month',
      features: ['All Platinum features', 'AI matchmaking', 'Verified badge', 'Dedicated support', 'Unlimited Super Likes', '500 coins/month']),
  ];

  final _coinPacks = [
    _CoinPack('Starter', 100, 'KES 200', '🪙'),
    _CoinPack('Popular', 350, 'KES 600', '🔥'),
    _CoinPack('Value', 800, 'KES 1,200', '💰'),
    _CoinPack('Mega', 2000, 'KES 2,500', '🚀'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      appBar: AppBar(
        backgroundColor: AppColors.bgPrimary,
        title: const Text('Membership', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 22)),
        leading: IconButton(icon: const Icon(Icons.arrow_back_rounded, color: Colors.white), onPressed: () => Navigator.pop(context)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Toggle
          Container(
            decoration: BoxDecoration(color: AppColors.bgSurface, borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.all(4),
            child: Row(children: [
              _buildToggle('👑 Membership', !_showCoins),
              _buildToggle('🪙 Buy Coins', _showCoins),
            ]),
          ),
          const SizedBox(height: 24),

          if (!_showCoins) ...[
            // Plans
            const Text('Choose Your Plan', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            const Text('Upgrade anytime. Cancel anytime.', style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
            const SizedBox(height: 20),

            ...List.generate(_plans.length, (i) {
              final plan = _plans[i];
              final isSelected = _selectedPlan == plan.id;
              return GestureDetector(
                onTap: () => setState(() => _selectedPlan = plan.id),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: isSelected ? plan.color.withOpacity(0.08) : AppColors.bgSurface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected ? plan.color : const Color(0x14FFFFFF),
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  child: Row(children: [
                    Text(plan.emoji, style: const TextStyle(fontSize: 28)),
                    const SizedBox(width: 14),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        Text(plan.name, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: plan.color)),
                        if (plan.id == 'gold') ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(gradient: AppColors.gradientPrimary, borderRadius: BorderRadius.circular(50)),
                            child: const Text('POPULAR', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w800)),
                          ),
                        ],
                      ]),
                      const SizedBox(height: 6),
                      Wrap(spacing: 4, runSpacing: 4, children: plan.features.map((f) => Row(mainAxisSize: MainAxisSize.min, children: [
                        Icon(Icons.check_rounded, size: 12, color: plan.color),
                        const SizedBox(width: 3),
                        Text(f, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        const SizedBox(width: 8),
                      ])).toList()),
                    ])),
                    const SizedBox(width: 10),
                    Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                      Text(plan.price, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: plan.color)),
                      if (plan.period.isNotEmpty) Text(plan.period, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                    ]),
                  ]),
                ).animate(delay: Duration(milliseconds: i * 80)).fadeIn().slideX(begin: 0.1, end: 0),
              );
            }),

            const SizedBox(height: 24),
            GradientButton(
              text: 'Get ${_plans.firstWhere((p) => p.id == _selectedPlan).name} — ${_plans.firstWhere((p) => p.id == _selectedPlan).price}${_plans.firstWhere((p) => p.id == _selectedPlan).period}',
              onTap: () {},
              isGold: _selectedPlan == 'gold',
            ),
          ] else ...[
            // Coins
            const Text('Buy Coins 🪙', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            const Text('Use coins to send gifts, Super Likes, and unlock features.', style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
            const SizedBox(height: 20),
            GridView.builder(
              shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 1.1),
              itemCount: _coinPacks.length,
              itemBuilder: (context, i) {
                final pack = _coinPacks[i];
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: i == 1 ? AppColors.gradientGold : null,
                    color: i != 1 ? AppColors.bgSurface : null,
                    borderRadius: BorderRadius.circular(20),
                    border: i != 1 ? Border.all(color: const Color(0x14FFFFFF)) : null,
                    boxShadow: i == 1 ? [BoxShadow(color: AppColors.accentGold.withOpacity(0.3), blurRadius: 20)] : null,
                  ),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Text(pack.emoji, style: const TextStyle(fontSize: 32)),
                    const SizedBox(height: 8),
                    Text('${pack.coins} Coins', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: i == 1 ? const Color(0xFF0D0D0D) : Colors.white)),
                    const SizedBox(height: 4),
                    Text(pack.price, style: TextStyle(fontWeight: FontWeight.w600, color: i == 1 ? const Color(0x990D0D0D) : AppColors.textSecondary, fontSize: 14)),
                    const SizedBox(height: 10),
                    if (i == 1) Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: const Color(0xFF0D0D0D), borderRadius: BorderRadius.circular(50)),
                      child: const Text('Best Value', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700)),
                    ),
                  ]),
                ).animate(delay: Duration(milliseconds: i * 80)).fadeIn().scale(begin: const Offset(0.9, 0.9));
              },
            ),
          ],
          const SizedBox(height: 40),
        ]),
      ),
    );
  }

  Widget _buildToggle(String label, bool active) => Expanded(
    child: GestureDetector(
      onTap: () => setState(() => _showCoins = label.contains('Coins')),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(gradient: active ? AppColors.gradientPrimary : null, borderRadius: BorderRadius.circular(8)),
        child: Center(child: Text(label, style: TextStyle(color: active ? Colors.white : AppColors.textSecondary, fontWeight: FontWeight.w600, fontSize: 14))),
      ),
    ),
  );
}

class _Plan {
  final String id, name, emoji, price, period;
  final Color color;
  final List<String> features;
  const _Plan({required this.id, required this.name, required this.emoji, required this.color, required this.price, required this.period, required this.features});
}

class _CoinPack {
  final String name, price, emoji;
  final int coins;
  const _CoinPack(this.name, this.coins, this.price, this.emoji);
}
