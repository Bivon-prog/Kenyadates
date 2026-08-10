import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:pinput/pinput.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gradient_button.dart';

class OtpScreen extends StatefulWidget {
  final String phone;
  const OtpScreen({super.key, required this.phone});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final _pinController = TextEditingController();
  bool _loading = false;
  int _secondsLeft = 59;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() async {
    while (_secondsLeft > 0 && mounted) {
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) setState(() => _secondsLeft--);
    }
  }

  final _defaultPinTheme = PinTheme(
    width: 56, height: 64,
    textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: Colors.white),
    decoration: BoxDecoration(
      color: AppColors.bgSurface,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: const Color(0x14FFFFFF)),
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.gradientBg),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: () => context.pop(),
                ),
                const SizedBox(height: 32),

                Center(
                  child: Container(
                    width: 80, height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.accentPrimary.withOpacity(0.15),
                      border: Border.all(color: AppColors.accentPrimary.withOpacity(0.3), width: 2),
                    ),
                    child: const Center(child: Text('🔐', style: TextStyle(fontSize: 36))),
                  ).animate().scale(duration: 600.ms, curve: Curves.elasticOut),
                ),

                const SizedBox(height: 32),
                const Center(child: Text('Verify your number', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800))),
                const SizedBox(height: 10),
                Center(
                  child: Text(
                    'Enter the 6-digit code sent to\n+254 ${widget.phone}',
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 15, height: 1.6),
                    textAlign: TextAlign.center,
                  ),
                ),

                const SizedBox(height: 48),

                Center(
                  child: Pinput(
                    controller: _pinController,
                    length: 6,
                    defaultPinTheme: _defaultPinTheme,
                    focusedPinTheme: _defaultPinTheme.copyWith(
                      decoration: _defaultPinTheme.decoration!.copyWith(
                        border: Border.all(color: AppColors.accentPrimary, width: 2),
                        boxShadow: [BoxShadow(color: AppColors.accentPrimary.withOpacity(0.2), blurRadius: 12)],
                      ),
                    ),
                    submittedPinTheme: _defaultPinTheme.copyWith(
                      decoration: _defaultPinTheme.decoration!.copyWith(
                        color: AppColors.accentPrimary.withOpacity(0.1),
                        border: Border.all(color: AppColors.accentPrimary),
                      ),
                    ),
                    onCompleted: (pin) async {
                      setState(() => _loading = true);
                      await Future.delayed(const Duration(seconds: 1));
                      if (mounted) context.go('/profile-setup');
                    },
                  ),
                ),

                const SizedBox(height: 32),
                Center(
                  child: _secondsLeft > 0
                    ? Text('Resend code in 0:${_secondsLeft.toString().padLeft(2, '0')}',
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 14))
                    : GestureDetector(
                        onTap: () => setState(() => _secondsLeft = 59),
                        child: const Text('Resend code', style: TextStyle(color: AppColors.accentSecondary, fontWeight: FontWeight.w700, fontSize: 14)),
                      ),
                ),

                const Spacer(),
                GradientButton(
                  text: _loading ? 'Verifying...' : 'Verify Code',
                  onTap: _loading ? null : () {
                    setState(() => _loading = true);
                    Future.delayed(const Duration(seconds: 1), () {
                      if (mounted) context.go('/profile-setup');
                    });
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
