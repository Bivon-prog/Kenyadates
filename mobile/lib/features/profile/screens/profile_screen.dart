import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 320,
            pinned: true,
            backgroundColor: AppColors.bgPrimary,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(children: [
                Container(
                  decoration: const BoxDecoration(gradient: AppColors.gradientBg),
                  child: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    const SizedBox(height: 60),
                    Stack(children: [
                      Container(
                        width: 110, height: 110,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: AppColors.gradientPrimary,
                          boxShadow: [BoxShadow(color: AppColors.accentPrimary.withOpacity(0.4), blurRadius: 30)],
                        ),
                        child: const Center(child: Text('👩🏾', style: TextStyle(fontSize: 60))),
                      ),
                      Positioned(bottom: 4, right: 4, child: Container(
                        width: 32, height: 32,
                        decoration: const BoxDecoration(gradient: AppColors.gradientPrimary, shape: BoxShape.circle),
                        child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 16),
                      )),
                    ]),
                    const SizedBox(height: 14),
                    const Text('Wanjiku Kamau', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 4),
                    Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                      const Icon(Icons.location_on_rounded, size: 14, color: AppColors.textMuted),
                      const Text('Nairobi, Kenya', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          gradient: AppColors.gradientGold, borderRadius: BorderRadius.circular(50)),
                        child: const Text('GOLD', style: TextStyle(color: Color(0xFF0D0D0D), fontSize: 10, fontWeight: FontWeight.w800)),
                      ),
                    ]),
                  ])),
                ),
              ]),
            ),
            actions: [
              IconButton(icon: const Icon(Icons.settings_rounded, color: Colors.white), onPressed: () {}),
            ],
          ),

          SliverToBoxAdapter(child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(children: [
              // Stats
              Row(children: [
                _statCard('Profile Views', '247', Icons.visibility_rounded),
                const SizedBox(width: 12),
                _statCard('Likes Received', '83', Icons.favorite_rounded),
                const SizedBox(width: 12),
                _statCard('Matches', '12', Icons.people_rounded),
              ]),

              const SizedBox(height: 24),

              // Coins
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: AppColors.gradientGold,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: AppColors.accentGold.withOpacity(0.3), blurRadius: 20)],
                ),
                child: Row(children: [
                  const Text('🪙', style: TextStyle(fontSize: 32)),
                  const SizedBox(width: 14),
                  const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('350 Coins', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: Color(0xFF0D0D0D))),
                    Text('Buy more to unlock premium features', style: TextStyle(fontSize: 12, color: Color(0x990D0D0D))),
                  ])),
                  GestureDetector(
                    onTap: () => context.go('/membership'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(color: const Color(0xFF0D0D0D), borderRadius: BorderRadius.circular(50)),
                      child: const Text('Buy', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                    ),
                  ),
                ]),
              ),

              const SizedBox(height: 24),

              // Profile completion
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: AppColors.bgSurface, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0x14FFFFFF))),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    const Text('Profile Completion', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                    const Spacer(),
                    const Text('75%', style: TextStyle(color: AppColors.accentSecondary, fontWeight: FontWeight.w800, fontSize: 15)),
                  ]),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(50),
                    child: LinearProgressIndicator(
                      value: 0.75, minHeight: 8,
                      backgroundColor: AppColors.bgCard,
                      valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accentPrimary),
                    ),
                  ),
                  const SizedBox(height: 14),
                  _todoItem('Add 3 more photos', false),
                  _todoItem('Complete bio', true),
                  _todoItem('Face verification', false),
                  _todoItem('Add interests', true),
                ]),
              ),

              const SizedBox(height: 24),

              // Menu items
              _menuSection('Account', [
                _MenuItem(Icons.edit_rounded, 'Edit Profile', () {}),
                _MenuItem(Icons.verified_user_rounded, 'Face Verification', () {}),
                _MenuItem(Icons.language_rounded, 'Languages', () {}),
                _MenuItem(Icons.notifications_rounded, 'Notifications', () {}),
              ]),
              const SizedBox(height: 16),
              _menuSection('Membership', [
                _MenuItem(Icons.workspace_premium_rounded, 'Upgrade Plan', () => context.go('/membership')),
                _MenuItem(Icons.monetization_on_rounded, 'Buy Coins', () {}),
                _MenuItem(Icons.card_giftcard_rounded, 'Send Gift', () {}),
              ]),
              const SizedBox(height: 16),
              _menuSection('Support', [
                _MenuItem(Icons.help_rounded, 'Help Center', () {}),
                _MenuItem(Icons.privacy_tip_rounded, 'Privacy & Safety', () {}),
                _MenuItem(Icons.logout_rounded, 'Logout', () => context.go('/login'), isDestructive: true),
              ]),

              const SizedBox(height: 80),
            ]),
          )),
        ],
      ),
    );
  }

  Widget _statCard(String label, String value, IconData icon) => Expanded(
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(color: AppColors.bgSurface, borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0x14FFFFFF))),
      child: Column(children: [
        ShaderMask(
          shaderCallback: (b) => AppColors.gradientPrimary.createShader(b),
          child: Icon(icon, color: Colors.white, size: 22),
        ),
        const SizedBox(height: 6),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10), textAlign: TextAlign.center),
      ]),
    ),
  );

  Widget _todoItem(String label, bool done) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(children: [
      Icon(done ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
        color: done ? AppColors.success : AppColors.textMuted, size: 18),
      const SizedBox(width: 10),
      Text(label, style: TextStyle(fontSize: 13, color: done ? AppColors.textSecondary : AppColors.textPrimary)),
    ]),
  );

  Widget _menuSection(String title, List<_MenuItem> items) => Container(
    decoration: BoxDecoration(color: AppColors.bgSurface, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0x14FFFFFF))),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Padding(padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
        child: Text(title, style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w700))),
      ...items.map((item) => ListTile(
        leading: Container(width: 36, height: 36, decoration: BoxDecoration(
          color: (item.isDestructive ? AppColors.error : AppColors.accentPrimary).withOpacity(0.1),
          borderRadius: BorderRadius.circular(10)),
          child: Icon(item.icon, color: item.isDestructive ? AppColors.error : AppColors.accentSecondary, size: 18)),
        title: Text(item.label, style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14,
          color: item.isDestructive ? AppColors.error : AppColors.textPrimary)),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 13, color: AppColors.textMuted),
        onTap: item.onTap,
        dense: true,
      )),
    ]),
  );
}

class _MenuItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool isDestructive;
  const _MenuItem(this.icon, this.label, this.onTap, {this.isDestructive = false});
}
