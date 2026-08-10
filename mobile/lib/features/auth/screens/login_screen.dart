import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gradient_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscure = true;
  bool _usePhone = true;
  bool _loading = false;

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
                // Logo
                Center(
                  child: Column(children: [
                    Container(
                      width: 64, height: 64,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle, gradient: AppColors.gradientPrimary,
                        boxShadow: [BoxShadow(color: AppColors.accentPrimary.withOpacity(0.4), blurRadius: 24)],
                      ),
                      child: const Icon(Icons.favorite, color: Colors.white, size: 32),
                    ),
                    const SizedBox(height: 12),
                    RichText(text: const TextSpan(children: [
                      TextSpan(text: 'Kenya', style: TextStyle(fontFamily: 'Georgia', fontSize: 26, fontWeight: FontWeight.w700, color: Colors.white)),
                      TextSpan(text: 'dates', style: TextStyle(fontFamily: 'Georgia', fontSize: 26, fontWeight: FontWeight.w700, color: AppColors.accentSecondary)),
                    ])),
                  ]),
                ).animate().fadeIn(duration: 400.ms),

                const SizedBox(height: 40),
                const Text('Welcome back 👋', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)).animate().fadeIn(delay: 100.ms),
                const SizedBox(height: 6),
                const Text('Sign in to continue your journey', style: TextStyle(color: AppColors.textSecondary, fontSize: 15)).animate().fadeIn(delay: 150.ms),
                const SizedBox(height: 32),

                // Toggle
                Container(
                  decoration: BoxDecoration(color: AppColors.bgSurface, borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.all(4),
                  child: Row(children: [
                    _buildToggle('📱 Phone', true),
                    _buildToggle('📧 Email', false),
                  ]),
                ).animate().fadeIn(delay: 200.ms),

                const SizedBox(height: 20),

                // Phone / Email field
                if (_usePhone) ...[
                  const Text('Phone Number', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      prefixText: '🇰🇪 +254  ',
                      prefixStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 15),
                      hintText: '7XX XXX XXX',
                    ),
                  ),
                ] else ...[
                  const Text('Email Address', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(hintText: 'you@example.com'),
                  ),
                ],

                const SizedBox(height: 16),
                const Text('Password', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscure,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Enter your password',
                    suffixIcon: IconButton(
                      icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility, color: AppColors.textMuted),
                      onPressed: () => setState(() => _obscure = !_obscure),
                    ),
                  ),
                ),

                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {},
                    child: const Text('Forgot password?', style: TextStyle(color: AppColors.accentSecondary, fontSize: 13)),
                  ),
                ),

                const SizedBox(height: 8),
                GradientButton(
                  text: _loading ? 'Signing in...' : 'Sign In',
                  onTap: _loading ? null : () async {
                    setState(() => _loading = true);
                    await Future.delayed(const Duration(seconds: 1));
                    if (mounted) context.go('/home');
                  },
                ),

                const SizedBox(height: 32),
                Center(
                  child: RichText(text: TextSpan(
                    text: "Don't have an account? ",
                    style: const TextStyle(color: AppColors.textMuted, fontSize: 14),
                    children: [
                      WidgetSpan(child: GestureDetector(
                        onTap: () => context.go('/register'),
                        child: const Text('Join Free', style: TextStyle(color: AppColors.accentSecondary, fontWeight: FontWeight.w700, fontSize: 14)),
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

  Widget _buildToggle(String label, bool isPhone) {
    final active = _usePhone == isPhone;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _usePhone = isPhone),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            gradient: active ? AppColors.gradientPrimary : null,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Center(child: Text(label, style: TextStyle(
            color: active ? Colors.white : AppColors.textSecondary,
            fontWeight: FontWeight.w600, fontSize: 14,
          ))),
        ),
      ),
    );
  }
}
