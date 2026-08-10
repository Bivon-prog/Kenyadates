import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class GradientButton extends StatelessWidget {
  final String text;
  final VoidCallback? onTap;
  final bool isGold;
  final double? width;

  const GradientButton({super.key, required this.text, this.onTap, this.isGold = false, this.width});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedOpacity(
        opacity: onTap == null ? 0.5 : 1.0,
        duration: const Duration(milliseconds: 200),
        child: Container(
          width: width ?? double.infinity,
          height: 54,
          decoration: BoxDecoration(
            gradient: isGold ? AppColors.gradientGold : AppColors.gradientPrimary,
            borderRadius: BorderRadius.circular(50),
            boxShadow: [BoxShadow(
              color: (isGold ? AppColors.accentGold : AppColors.accentPrimary).withOpacity(0.35),
              blurRadius: 20, offset: const Offset(0, 8),
            )],
          ),
          child: Center(child: Text(text, style: TextStyle(
            color: isGold ? const Color(0xFF0D0D0D) : Colors.white,
            fontWeight: FontWeight.w700, fontSize: 16,
          ))),
        ),
      ),
    );
  }
}
