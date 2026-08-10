import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class ProfileData {
  final String name, city, distance, emoji;
  final int age, match;
  final bool verified, online;
  final String? premium;

  const ProfileData({
    required this.name, required this.age, required this.city,
    required this.distance, required this.verified, required this.online,
    required this.match, required this.emoji, this.premium,
  });
}

class ProfileCard extends StatefulWidget {
  final ProfileData profile;
  const ProfileCard({super.key, required this.profile});

  @override
  State<ProfileCard> createState() => _ProfileCardState();
}

class _ProfileCardState extends State<ProfileCard> {
  bool _liked = false;

  Color get _premiumColor {
    switch (widget.profile.premium) {
      case 'gold': return AppColors.accentGold;
      case 'platinum': return const Color(0xFFE5E4E2);
      case 'diamond': return AppColors.accentPurple;
      default: return Colors.transparent;
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.profile;
    return GestureDetector(
      onTap: () => context.go('/me'),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.bgCard,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0x14FFFFFF)),
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(children: [
          // Photo placeholder
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft, end: Alignment.bottomRight,
                  colors: [AppColors.bgSurface, AppColors.bgElevated],
                ),
              ),
              child: Center(child: Text(p.emoji, style: const TextStyle(fontSize: 72))),
            ),
          ),

          // Gradient overlay
          Positioned.fill(child: Container(
            decoration: const BoxDecoration(gradient: AppColors.gradientCard),
          )),

          // Top badges
          Positioned(top: 10, left: 10, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            if (p.verified) _badge('✓ Verified', AppColors.success),
            if (p.premium != null) ...[
              const SizedBox(height: 4),
              _badge(p.premium!.toUpperCase(), _premiumColor),
            ],
          ])),

          // Match %
          Positioned(top: 10, right: 10, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(gradient: AppColors.gradientPrimary, borderRadius: BorderRadius.circular(50)),
            child: Text('${p.match}%', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800)),
          )),

          // Online dot
          if (p.online) Positioned(top: 60, left: 12, child: Container(
            width: 10, height: 10,
            decoration: BoxDecoration(color: AppColors.success, shape: BoxShape.circle,
              border: Border.all(color: AppColors.bgCard, width: 2)),
          )),

          // Info
          Positioned(bottom: 0, left: 0, right: 0, child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Text('${p.name}, ', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                Text('${p.age}', style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14, color: Colors.white70)),
              ]),
              const SizedBox(height: 4),
              Row(children: [
                const Icon(Icons.location_on_rounded, size: 11, color: AppColors.textMuted),
                const SizedBox(width: 2),
                Text('${p.city} · ${p.distance}', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
              ]),
            ]),
          )),

          // Like button
          Positioned(bottom: 10, right: 10, child: GestureDetector(
            onTap: () => setState(() => _liked = !_liked),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 36, height: 36,
              decoration: BoxDecoration(
                gradient: _liked ? AppColors.gradientPrimary : null,
                color: _liked ? null : Colors.white.withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(
                _liked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                color: Colors.white, size: 18,
              ),
            ),
          )),
        ]),
      ),
    );
  }

  Widget _badge(String label, Color color) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(
      color: color.withOpacity(0.15),
      borderRadius: BorderRadius.circular(50),
      border: Border.all(color: color.withOpacity(0.4)),
    ),
    child: Text(label, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w700)),
  );
}
