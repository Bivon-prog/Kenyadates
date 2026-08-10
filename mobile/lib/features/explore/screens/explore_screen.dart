import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../home/widgets/profile_card.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});
  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _tabs = ['For You', 'New', 'Online', 'Popular', 'Long-Time', 'Verified'];
  String _activeTab = 'For You';
  bool _showFilters = false;
  final _searchController = TextEditingController();

  final _profiles = [
    ProfileData(name: 'Amina', age: 26, city: 'Nairobi', distance: '2 km', verified: true, online: true, premium: 'gold', match: 94, emoji: '👩🏾'),
    ProfileData(name: 'Grace', age: 24, city: 'Kisumu', distance: '350 km', verified: true, online: true, premium: null, match: 91, emoji: '👩🏿'),
    ProfileData(name: 'Fatuma', age: 27, city: 'Nairobi', distance: '5 km', verified: true, online: true, premium: 'diamond', match: 96, emoji: '👩🏾'),
    ProfileData(name: 'James', age: 29, city: 'Mombasa', distance: '350 km', verified: true, online: false, premium: 'platinum', match: 87, emoji: '👨🏾'),
    ProfileData(name: 'Kevin', age: 31, city: 'Eldoret', distance: '310 km', verified: false, online: true, premium: 'gold', match: 78, emoji: '👨🏽'),
    ProfileData(name: 'Brian', age: 28, city: 'Kampala', distance: '650 km', verified: true, online: false, premium: null, match: 82, emoji: '👨🏾'),
    ProfileData(name: 'Aisha', age: 25, city: 'Nairobi', distance: '8 km', verified: true, online: true, premium: 'gold', match: 89, emoji: '👩🏾'),
    ProfileData(name: 'Cynthia', age: 23, city: 'Nairobi', distance: '3 km', verified: true, online: true, premium: 'platinum', match: 85, emoji: '👩🏽'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      body: SafeArea(
        child: Column(children: [
          // Header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
            child: Row(children: [
              const Text('Explore', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
              const Spacer(),
              GestureDetector(
                onTap: () => setState(() => _showFilters = !_showFilters),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: _showFilters ? AppColors.gradientPrimary : null,
                    color: _showFilters ? null : AppColors.bgSurface,
                    borderRadius: BorderRadius.circular(50),
                    border: _showFilters ? null : Border.all(color: const Color(0x14FFFFFF)),
                  ),
                  child: Row(children: [
                    Icon(Icons.tune_rounded, size: 16, color: _showFilters ? Colors.white : AppColors.textSecondary),
                    const SizedBox(width: 6),
                    Text('Filters', style: TextStyle(color: _showFilters ? Colors.white : AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w600)),
                  ]),
                ),
              ),
            ]),
          ),

          // Search
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
            child: TextField(
              controller: _searchController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search by name, city...',
                prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textMuted),
                suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(icon: const Icon(Icons.clear, color: AppColors.textMuted), onPressed: () { _searchController.clear(); setState(() {}); })
                  : null,
              ),
              onChanged: (_) => setState(() {}),
            ),
          ),

          // Filter panel
          if (_showFilters) Container(
            margin: const EdgeInsets.fromLTRB(20, 14, 20, 0),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.bgSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0x14FFFFFF)),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Quick Filters', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
              const SizedBox(height: 12),
              Wrap(spacing: 8, runSpacing: 8, children: [
                _filterChip('✅ Verified Only'),
                _filterChip('🟢 Online Now'),
                _filterChip('👑 Premium'),
                _filterChip('📍 Near Me'),
                _filterChip('💒 Marriage'),
              ]),
            ]),
          ),

          // Tabs
          const SizedBox(height: 14),
          SizedBox(
            height: 38,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: _tabs.length,
              separatorBuilder: (_, __) => const SizedBox(width: 6),
              itemBuilder: (context, i) {
                final active = _tabs[i] == _activeTab;
                return GestureDetector(
                  onTap: () => setState(() => _activeTab = _tabs[i]),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      gradient: active ? AppColors.gradientPrimary : null,
                      color: active ? null : AppColors.bgSurface,
                      borderRadius: BorderRadius.circular(50),
                      border: active ? null : Border.all(color: const Color(0x14FFFFFF)),
                    ),
                    child: Center(child: Text(_tabs[i], style: TextStyle(
                      fontSize: 13, fontWeight: FontWeight.w600,
                      color: active ? Colors.white : AppColors.textSecondary,
                    ))),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(children: [
              Text('${_profiles.length} people found', style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
            ]),
          ),
          const SizedBox(height: 12),

          // Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 0.65,
              ),
              itemCount: _profiles.length,
              itemBuilder: (context, i) => ProfileCard(profile: _profiles[i]),
            ),
          ),
        ]),
      ),
    );
  }

  Widget _filterChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.accentPrimary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(50),
        border: Border.all(color: AppColors.accentPrimary.withOpacity(0.3)),
      ),
      child: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.accentSecondary)),
    );
  }
}
