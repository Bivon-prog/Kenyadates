import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) context.go('/onboarding');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.gradientBg),
        child: Stack(
          children: [
            // Glow circles
            Positioned(top: -100, right: -100,
              child: Container(width: 350, height: 350,
                decoration: BoxDecoration(shape: BoxShape.circle,
                  color: AppColors.accentPrimary.withOpacity(0.08)),
              )),
            Positioned(bottom: -80, left: -80,
              child: Container(width: 280, height: 280,
                decoration: BoxDecoration(shape: BoxShape.circle,
                  color: AppColors.accentPurple.withOpacity(0.06)),
              )),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo
                  Container(
                    width: 100, height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: AppColors.gradientPrimary,
                      boxShadow: [BoxShadow(
                        color: AppColors.accentPrimary.withOpacity(0.4),
                        blurRadius: 40, spreadRadius: 10,
                      )],
                    ),
                    child: const Icon(Icons.favorite, color: Colors.white, size: 50),
                  )
                  .animate().scale(duration: 800.ms, curve: Curves.elasticOut)
                  .fadeIn(duration: 400.ms),

                  const SizedBox(height: 24),

                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(text: 'Kenya', style: TextStyle(
                          fontFamily: 'Georgia', fontSize: 38, fontWeight: FontWeight.w700,
                          color: Colors.white,
                        )),
                        TextSpan(text: 'dates', style: TextStyle(
                          fontFamily: 'Georgia', fontSize: 38, fontWeight: FontWeight.w700,
                          color: AppColors.accentSecondary,
                        )),
                      ],
                    ),
                  )
                  .animate().fadeIn(delay: 400.ms, duration: 600.ms)
                  .slideY(begin: 0.3, end: 0),

                  const SizedBox(height: 8),
                  const Text('Real People. Real Connections.',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 15),
                  )
                  .animate().fadeIn(delay: 700.ms, duration: 600.ms),

                  const SizedBox(height: 60),
                  SizedBox(
                    width: 36, height: 36,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppColors.accentPrimary.withOpacity(0.7)),
                    ),
                  )
                  .animate().fadeIn(delay: 1200.ms),
                ],
              ),
            ),
            // Kenya flag ribbon at bottom
            Positioned(
              bottom: 40, left: 0, right: 0,
              child: Row(mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('🇰🇪 ', style: TextStyle(fontSize: 18)),
                  Text('Made in Kenya', style: TextStyle(
                    color: AppColors.textMuted, fontSize: 13)),
                ],
              ).animate().fadeIn(delay: 1500.ms),
            ),
          ],
        ),
      ),
    );
  }
}
