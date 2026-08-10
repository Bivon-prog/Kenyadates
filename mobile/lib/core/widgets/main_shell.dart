import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';

class MainShell extends StatelessWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  int _locationToIndex(String location) {
    if (location.startsWith('/home')) return 0;
    if (location.startsWith('/explore')) return 1;
    if (location.startsWith('/favorites')) return 2;
    if (location.startsWith('/chat')) return 3;
    if (location.startsWith('/me')) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    final currentIndex = _locationToIndex(location);

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.bgSurface,
          border: const Border(top: BorderSide(color: Color(0x14FFFFFF))),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, -5))],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(icon: Icons.home_rounded, label: 'Home', index: 0, currentIndex: currentIndex, onTap: () => context.go('/home')),
                _NavItem(icon: Icons.explore_rounded, label: 'Explore', index: 1, currentIndex: currentIndex, onTap: () => context.go('/explore')),
                _NavItem(icon: Icons.favorite_rounded, label: 'Favorites', index: 2, currentIndex: currentIndex, onTap: () => context.go('/favorites')),
                _NavItem(icon: Icons.chat_bubble_rounded, label: 'Chat', index: 3, currentIndex: currentIndex, onTap: () => context.go('/chat'), badge: '3'),
                _NavItem(icon: Icons.person_rounded, label: 'Me', index: 4, currentIndex: currentIndex, onTap: () => context.go('/me')),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final int index, currentIndex;
  final VoidCallback onTap;
  final String? badge;

  const _NavItem({required this.icon, required this.label, required this.index, required this.currentIndex, required this.onTap, this.badge});

  @override
  Widget build(BuildContext context) {
    final isActive = index == currentIndex;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? AppColors.accentPrimary.withOpacity(0.12) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Stack(children: [
            ShaderMask(
              shaderCallback: (bounds) => (isActive ? AppColors.gradientPrimary : const LinearGradient(colors: [AppColors.textMuted, AppColors.textMuted])).createShader(bounds),
              child: Icon(icon, color: Colors.white, size: 24),
            ),
            if (badge != null) Positioned(
              top: -2, right: -4,
              child: Container(
                padding: const EdgeInsets.all(3),
                decoration: const BoxDecoration(gradient: AppColors.gradientPrimary, shape: BoxShape.circle),
                child: Text(badge!, style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w700)),
              ),
            ),
          ]),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(
            fontSize: 11, fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
            color: isActive ? AppColors.accentPrimary : AppColors.textMuted,
          )),
        ]),
      ),
    );
  }
}
