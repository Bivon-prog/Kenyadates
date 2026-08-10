import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gradient_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  final _pages = [
    _OnboardingPage(
      emoji: '💘',
      title: 'Find Your Perfect Match',
      subtitle: 'Meet verified singles from Kenya, Uganda, Tanzania and across East Africa.',
      gradient: AppColors.gradientPrimary,
    ),
    _OnboardingPage(
      emoji: '✅',
      title: 'Only Real People',
      subtitle: 'Every profile is face-verified with AI. No fakes. No catfishing. Just genuine people.',
      gradient: AppColors.gradientPrimary,
    ),
    _OnboardingPage(
      emoji: '💬',
      title: 'Chat, Call & Connect',
      subtitle: 'Message in 11 languages with live translation. Make voice and video calls safely in-app.',
      gradient: AppColors.gradientPrimary,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.gradientBg),
        child: SafeArea(
          child: Column(
            children: [
              // Skip button
              Align(
                alignment: Alignment.topRight,
                child: TextButton(
                  onPressed: () => context.go('/login'),
                  child: const Text('Skip', style: TextStyle(color: AppColors.textSecondary)),
                ),
              ),

              // Pages
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: _pages.length,
                  onPageChanged: (i) => setState(() => _currentPage = i),
                  itemBuilder: (context, i) => _buildPage(_pages[i], i),
                ),
              ),

              // Indicator
              SmoothPageIndicator(
                controller: _pageController,
                count: _pages.length,
                effect: ExpandingDotsEffect(
                  activeDotColor: AppColors.accentPrimary,
                  dotColor: AppColors.bgElevated,
                  dotHeight: 8, dotWidth: 8,
                  expansionFactor: 3,
                ),
              ),
              const SizedBox(height: 40),

              // Button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: _currentPage < _pages.length - 1
                  ? GradientButton(
                      text: 'Next',
                      onTap: () => _pageController.nextPage(
                        duration: const Duration(milliseconds: 400),
                        curve: Curves.easeInOut,
                      ),
                    )
                  : Column(children: [
                      GradientButton(
                        text: 'Create Free Account 🎉',
                        onTap: () => context.go('/register'),
                      ),
                      const SizedBox(height: 14),
                      TextButton(
                        onPressed: () => context.go('/login'),
                        child: const Text('Already have an account? Sign In',
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
                      ),
                    ]),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPage(_OnboardingPage page, int index) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 140, height: 140,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: page.gradient,
              boxShadow: [BoxShadow(
                color: AppColors.accentPrimary.withOpacity(0.3),
                blurRadius: 50, spreadRadius: 10,
              )],
            ),
            child: Center(child: Text(page.emoji, style: const TextStyle(fontSize: 64))),
          )
          .animate(key: ValueKey(index)).scale(duration: 600.ms, curve: Curves.elasticOut),
          const SizedBox(height: 48),
          Text(page.title,
            style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, color: Colors.white),
            textAlign: TextAlign.center,
          ).animate(key: ValueKey('t$index')).fadeIn(delay: 200.ms).slideY(begin: 0.3, end: 0),
          const SizedBox(height: 16),
          Text(page.subtitle,
            style: const TextStyle(fontSize: 16, color: AppColors.textSecondary, height: 1.6),
            textAlign: TextAlign.center,
          ).animate(key: ValueKey('s$index')).fadeIn(delay: 350.ms),
        ],
      ),
    );
  }
}

class _OnboardingPage {
  final String emoji, title, subtitle;
  final Gradient gradient;
  const _OnboardingPage({required this.emoji, required this.title, required this.subtitle, required this.gradient});
}
