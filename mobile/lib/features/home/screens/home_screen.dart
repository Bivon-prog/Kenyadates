import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../widgets/profile_card.dart';
import '../widgets/section_header.dart';
import '../widgets/online_avatar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _sections = ['✨ Recommended', '🆕 New Members', '🟢 Online Now', '📍 Near You', '🔥 Popular', '✅ Verified'];
  String _activeSection = '✨ Recommended';

  final _profiles = [
    ProfileData(name: 'Amina', age: 26, city: 'Nairobi', distance: '2 km', verified: true, online: true, premium: 'gold', match: 94, emoji: '👩🏾'),
    ProfileData(name: 'Grace', age: 24, city: 'Kisumu', distance: '350 km', verified: true, online: true, premium: null, match: 91, emoji: '👩🏿'),
    ProfileData(name: 'Fatuma', age: 27, city: 'Nairobi', distance: '5 km', verified: true, online: true, premium: 'diamond', match: 96, emoji: '👩🏾'),
    ProfileData(name: 'James', age: 29, city: 'Mombasa', distance: '350 km', verified: true, online: false, premium: 'platinum', match: 87, emoji: '👨🏾'),
    ProfileData(name: 'Kevin', age: 31, city: 'Eldoret', distance: '310 km', verified: false, online: true, premium: 'gold', match: 78, emoji: '👨🏽'),
    ProfileData(name: 'Brian', age: 28, city: 'Kampala', distance: '650 km', verified: true, online: false, premium: null, match: 82, emoji: '👨🏾'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            floating: true, snap: true, pinned: false,
            backgroundColor: AppColors.bgPrimary,
            title: RichText(text: const TextSpan(children: [
              TextSpan(text: 'Kenya', style: TextStyle(fontFamily: 'Georgia', fontSize: 22, fontWeight: FontWeight.w700, color: Colors.white)),
              TextSpan(text: 'dates', style: TextStyle(fontFamily: 'Georgia', fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.accentSecondary)),
            ])),
            actions: [
              Stack(children: [
                IconButton(icon: const Icon(Icons.notifications_rounded, color: Colors.white), onPressed: () {}),
                Positioned(top: 10, right: 10, child: Container(
                  width: 8, height: 8,
                  decoration: const BoxDecoration(color: AppColors.accentPrimary, shape: BoxShape.circle),
                )),
              ]),
              IconButton(icon: const Icon(Icons.tune_rounded, color: Colors.white), onPressed: () {}),
            ],
          ),

          SliverToBoxAdapter(child: Column(children: [
            // Greeting
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
              child: Row(children: [
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text('Good morning, Wanjiku 👋', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 4),
                  Text('You have 3 new matches!', style: TextStyle(color: AppColors.accentSecondary, fontSize: 13, fontWeight: FontWeight.w600)),
                ])),
              ]).animate().fadeIn(duration: 400.ms),
            ),
            const SizedBox(height: 20),

            // Coins banner
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                decoration: BoxDecoration(
                  gradient: AppColors.gradientGold,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: AppColors.accentGold.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 8))],
                ),
                child: Row(children: [
                  const Text('🪙', style: TextStyle(fontSize: 28)),
                  const SizedBox(width: 12),
                  const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('150 Free Coins!', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0D0D0D))),
                    Text('Complete face verification to claim', style: TextStyle(fontSize: 12, color: Color(0x990D0D0D))),
                  ])),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(color: const Color(0xFF0D0D0D), borderRadius: BorderRadius.circular(50)),
                    child: const Text('Claim', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12)),
                  ),
                ]),
              ).animate().fadeIn(delay: 200.ms).slideX(begin: 0.1, end: 0),
            ),
            const SizedBox(height: 24),

            // Section tabs
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: _sections.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final active = _sections[i] == _activeSection;
                  return GestureDetector(
                    onTap: () => setState(() => _activeSection = _sections[i]),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        gradient: active ? AppColors.gradientPrimary : null,
                        color: active ? null : AppColors.bgSurface,
                        borderRadius: BorderRadius.circular(50),
                        border: active ? null : Border.all(color: const Color(0x14FFFFFF)),
                      ),
                      child: Text(_sections[i], style: TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600,
                        color: active ? Colors.white : AppColors.textSecondary,
                      )),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),

            // Online Now strip
            SectionHeader(title: '🟢 Online Now', onSeeAll: () => context.go('/explore')),
            const SizedBox(height: 14),
            SizedBox(
              height: 90,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: _profiles.where((p) => p.online).length,
                separatorBuilder: (_, __) => const SizedBox(width: 14),
                itemBuilder: (context, i) {
                  final online = _profiles.where((p) => p.online).toList();
                  return OnlineAvatar(profile: online[i]);
                },
              ),
            ),
            const SizedBox(height: 28),

            // Super Likes banner
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                decoration: BoxDecoration(
                  color: AppColors.accentPrimary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.accentPrimary.withOpacity(0.2)),
                ),
                child: Row(children: [
                  Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(gradient: AppColors.gradientPrimary, borderRadius: BorderRadius.circular(12)),
                    child: const Icon(Icons.bolt_rounded, color: Colors.white),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('2 Super Likes left today', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    Text('Stand out — 3× more responses', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  ])),
                  const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textMuted),
                ]),
              ),
            ),
            const SizedBox(height: 28),

            // Recommended grid
            SectionHeader(title: '✨ Recommended', onSeeAll: () => context.go('/explore')),
            const SizedBox(height: 14),
            GridView.builder(
              shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 20),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 0.65,
              ),
              itemCount: _profiles.length,
              itemBuilder: (context, i) => ProfileCard(profile: _profiles[i])
                .animate(delay: Duration(milliseconds: i * 80))
                .fadeIn().slideY(begin: 0.2, end: 0),
            ),
            const SizedBox(height: 100),
          ])),
        ],
      ),
    );
  }
}
