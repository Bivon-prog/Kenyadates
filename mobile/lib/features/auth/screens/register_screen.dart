import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gradient_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _phoneController = TextEditingController();
  bool _agreed = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.gradientBg),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => context.go('/onboarding')),
                ]),
                const SizedBox(height: 24),

                Center(child: Container(
                  width: 64, height: 64,
                  decoration: BoxDecoration(shape: BoxShape.circle, gradient: AppColors.gradientPrimary,
                    boxShadow: [BoxShadow(color: AppColors.accentPrimary.withOpacity(0.4), blurRadius: 24)]),
                  child: const Icon(Icons.favorite, color: Colors.white, size: 32),
                ).animate().scale(duration: 600.ms, curve: Curves.elasticOut)),

                const SizedBox(height: 32),
                const Text('Create your account ✨', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)).animate().fadeIn(delay: 100.ms),
                const SizedBox(height: 6),
                const Text('Join 50,000+ verified singles across East Africa', style: TextStyle(color: AppColors.textSecondary, fontSize: 15, height: 1.5)).animate().fadeIn(delay: 150.ms),
                const SizedBox(height: 36),

                const Text('Phone Number', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(color: Colors.white, fontSize: 16),
                  decoration: const InputDecoration(
                    prefixText: '🇰🇪 +254  ',
                    prefixStyle: TextStyle(color: AppColors.textSecondary, fontSize: 16),
                    hintText: '7XX XXX XXX',
                  ),
                ).animate().fadeIn(delay: 200.ms),

                const SizedBox(height: 24),

                // Benefits chips
                Wrap(spacing: 8, runSpacing: 8, children: [
                  _chip('✅ Face Verified'),
                  _chip('🎁 150 Free Coins'),
                  _chip('🔒 100% Secure'),
                  _chip('🇰🇪 East African'),
                ]).animate().fadeIn(delay: 250.ms),

                const SizedBox(height: 28),

                // Terms checkbox
                Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  GestureDetector(
                    onTap: () => setState(() => _agreed = !_agreed),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 22, height: 22,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(6),
                        gradient: _agreed ? AppColors.gradientPrimary : null,
                        border: Border.all(color: _agreed ? Colors.transparent : AppColors.textMuted),
                      ),
                      child: _agreed ? const Icon(Icons.check, color: Colors.white, size: 14) : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: RichText(text: const TextSpan(
                      text: 'By continuing, I agree to the ',
                      style: TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.5),
                      children: [
                        TextSpan(text: 'Terms of Service', style: TextStyle(color: AppColors.accentSecondary, fontWeight: FontWeight.w600)),
                        TextSpan(text: ' and '),
                        TextSpan(text: 'Privacy Policy', style: TextStyle(color: AppColors.accentSecondary, fontWeight: FontWeight.w600)),
                        TextSpan(text: '. I am 18 or older.'),
                      ],
                    )),
                  ),
                ]).animate().fadeIn(delay: 300.ms),

                const SizedBox(height: 32),

                GradientButton(
                  text: 'Send Verification Code',
                  onTap: _agreed ? () => context.go('/otp?phone=${_phoneController.text}') : null,
                ).animate().fadeIn(delay: 350.ms),

                const SizedBox(height: 24),
                Center(
                  child: RichText(text: TextSpan(
                    text: 'Already have an account? ',
                    style: const TextStyle(color: AppColors.textMuted, fontSize: 14),
                    children: [
                      WidgetSpan(child: GestureDetector(
                        onTap: () => context.go('/login'),
                        child: const Text('Sign In', style: TextStyle(color: AppColors.accentSecondary, fontWeight: FontWeight.w700, fontSize: 14)),
                      )),
                    ],
                  )),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _chip(String label) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
    decoration: BoxDecoration(
      color: AppColors.accentPrimary.withOpacity(0.1),
      borderRadius: BorderRadius.circular(50),
      border: Border.all(color: AppColors.accentPrimary.withOpacity(0.3)),
    ),
    child: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.accentSecondary)),
  );
}
