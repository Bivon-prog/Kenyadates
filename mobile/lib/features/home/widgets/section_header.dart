import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class SectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onSeeAll;
  const SectionHeader({super.key, required this.title, this.onSeeAll});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(children: [
        Text(title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
        const Spacer(),
        if (onSeeAll != null) GestureDetector(
          onTap: onSeeAll,
          child: const Row(children: [
            Text('See all', style: TextStyle(color: AppColors.accentSecondary, fontSize: 13, fontWeight: FontWeight.w600)),
            SizedBox(width: 2),
            Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppColors.accentSecondary),
          ]),
        ),
      ]),
    );
  }
}
