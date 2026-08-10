import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../home/widgets/profile_card.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});
  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final _liked = [
    ProfileData(name: 'Amina', age: 26, city: 'Nairobi', distance: '2 km', verified: true, online: true, premium: 'gold', match: 94, emoji: '👩🏾'),
    ProfileData(name: 'Grace', age: 24, city: 'Kisumu', distance: '350 km', verified: true, online: true, premium: null, match: 91, emoji: '👩🏿'),
    ProfileData(name: 'Fatuma', age: 27, city: 'Nairobi', distance: '5 km', verified: true, online: true, premium: 'diamond', match: 96, emoji: '👩🏾'),
  ];

  final _likedMe = [
    ProfileData(name: 'James', age: 29, city: 'Mombasa', distance: '350 km', verified: true, online: false, premium: 'platinum', match: 87, emoji: '👨🏾'),
    ProfileData(name: 'Kevin', age: 31, city: 'Eldoret', distance: '310 km', verified: false, online: true, premium: 'gold', match: 78, emoji: '👨🏽'),
  ];

  final _mutual = [
    ProfileData(name: 'Fatuma', age: 27, city: 'Nairobi', distance: '5 km', verified: true, online: true, premium: 'diamond', match: 96, emoji: '👩🏾'),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      appBar: AppBar(
        backgroundColor: AppColors.bgPrimary,
        title: const Text('Favorites', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 22)),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.accentPrimary,
          indicatorSize: TabBarIndicatorSize.label,
          labelColor: AppColors.accentPrimary,
          unselectedLabelColor: AppColors.textMuted,
          labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
          tabs: [
            Tab(text: 'I Liked (${_liked.length})'),
            Tab(text: 'Liked Me (${_likedMe.length})'),
            Tab(text: '💘 Mutual (${_mutual.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildGrid(_liked),
          _buildGrid(_likedMe, blurred: true),
          _buildGrid(_mutual, showMatch: true),
        ],
      ),
    );
  }

  Widget _buildGrid(List<ProfileData> profiles, {bool blurred = false, bool showMatch = false}) {
    if (profiles.isEmpty) return Center(
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        const Text('💝', style: TextStyle(fontSize: 60)),
        const SizedBox(height: 16),
        const Text('Nothing here yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        const Text('Start exploring to find matches', style: TextStyle(color: AppColors.textSecondary)),
      ]),
    );

    return Stack(children: [
      GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 0.65,
        ),
        itemCount: profiles.length,
        itemBuilder: (context, i) {
          final card = ProfileCard(profile: profiles[i]);
          if (blurred && i > 0) {
            return Stack(children: [
              card,
              Positioned.fill(child: Container(
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.7),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const Icon(Icons.lock_rounded, color: Colors.white, size: 28),
                  const SizedBox(height: 8),
                  const Text('Unlock with\nGold', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13), textAlign: TextAlign.center),
                ]),
              )),
            ]);
          }
          return card;
        },
      ),
      if (blurred) Positioned(
        bottom: 24, left: 20, right: 20,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          decoration: BoxDecoration(gradient: AppColors.gradientGold, borderRadius: BorderRadius.circular(16)),
          child: Row(children: [
            const Text('👑', style: TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            const Expanded(child: Text('Upgrade to see who liked you', style: TextStyle(color: Color(0xFF0D0D0D), fontWeight: FontWeight.w700, fontSize: 14))),
            Container(padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(color: const Color(0xFF0D0D0D), borderRadius: BorderRadius.circular(50)),
              child: const Text('Upgrade', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12))),
          ]),
        ),
      ),
    ]);
  }
}
