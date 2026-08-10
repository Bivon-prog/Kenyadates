import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import 'profile_card.dart';

class OnlineAvatar extends StatelessWidget {
  final ProfileData profile;
  const OnlineAvatar({super.key, required this.profile});

  @override
  Widget build(BuildContext context) {
    return Column(mainAxisSize: MainAxisSize.min, children: [
      Stack(children: [
        Container(
          width: 58, height: 58,
          padding: const EdgeInsets.all(2),
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            gradient: AppColors.gradientPrimary,
          ),
          child: Container(
            decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.bgCard),
            child: Center(child: Text(profile.emoji, style: const TextStyle(fontSize: 28))),
          ),
        ),
        Positioned(bottom: 2, right: 2, child: Container(
          width: 14, height: 14,
          decoration: BoxDecoration(color: AppColors.success, shape: BoxShape.circle,
            border: Border.all(color: AppColors.bgPrimary, width: 2)),
        )),
      ]),
      const SizedBox(height: 6),
      Text(profile.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
    ]);
  }
}
