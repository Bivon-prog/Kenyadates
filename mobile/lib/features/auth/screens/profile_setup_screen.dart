import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/gradient_button.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});
  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  int _step = 0;
  String _name = '', _gender = '', _goal = '';
  DateTime? _dob;
  final _nameController = TextEditingController();

  final _goals = ['💍 Marriage', '💑 Serious Relationship', '😊 Casual Dating', '👫 Friendship', '🔍 Not Sure Yet'];
  final _genders = ['👨 Man', '👩 Woman', '🏳️‍🌈 Non-binary'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.gradientBg),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(28),
            child: Column(children: [
              // Progress bar
              Row(children: List.generate(4, (i) => Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(right: i < 3 ? 4 : 0),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(2),
                    gradient: i <= _step ? AppColors.gradientPrimary : null,
                    color: i > _step ? AppColors.bgSurface : null,
                  ),
                ),
              ))),
              const SizedBox(height: 8),
              Text('Step ${_step + 1} of 4', style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
              const SizedBox(height: 40),

              Expanded(child: SingleChildScrollView(child: _buildStep())),

              const SizedBox(height: 24),
              GradientButton(
                text: _step == 3 ? 'Start Exploring 🎉' : 'Continue',
                onTap: () {
                  if (_step < 3) {
                    setState(() => _step++);
                  } else {
                    context.go('/home');
                  }
                },
              ),
            ]),
          ),
        ),
      ),
    );
  }

  Widget _buildStep() {
    switch (_step) {
      case 0:
        return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text("What's your name? 😊", style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
          const SizedBox(height: 8),
          const Text('This is how you appear on Kenyandates', style: TextStyle(color: AppColors.textSecondary, fontSize: 15)),
          const SizedBox(height: 32),
          TextFormField(
            controller: _nameController,
            style: const TextStyle(color: Colors.white, fontSize: 18),
            onChanged: (v) => setState(() => _name = v),
            decoration: const InputDecoration(hintText: 'Your first name'),
          ),
        ]);
      case 1:
        return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('I identify as...', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
          const SizedBox(height: 32),
          ..._genders.map((g) => GestureDetector(
            onTap: () => setState(() => _gender = g),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
              decoration: BoxDecoration(
                gradient: _gender == g ? AppColors.gradientPrimary : null,
                color: _gender != g ? AppColors.bgSurface : null,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _gender == g ? Colors.transparent : const Color(0x14FFFFFF)),
              ),
              child: Text(g, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: _gender == g ? Colors.white : AppColors.textSecondary)),
            ),
          )),
        ]);
      case 2:
        return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text("What are you looking for? 🌟", style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
          const SizedBox(height: 32),
          ..._goals.map((g) => GestureDetector(
            onTap: () => setState(() => _goal = g),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
              decoration: BoxDecoration(
                gradient: _goal == g ? AppColors.gradientPrimary : null,
                color: _goal != g ? AppColors.bgSurface : null,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _goal == g ? Colors.transparent : const Color(0x14FFFFFF)),
              ),
              child: Text(g, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: _goal == g ? Colors.white : AppColors.textSecondary)),
            ),
          )),
        ]);
      case 3:
        return Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Text('🎉', style: TextStyle(fontSize: 72)),
          const SizedBox(height: 24),
          const Text("You're all set!", style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          const Text('Your profile is ready. Start exploring and find your perfect match!',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 16, height: 1.6), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(gradient: AppColors.gradientGold, borderRadius: BorderRadius.circular(20)),
            child: const Row(children: [
              Text('🪙', style: TextStyle(fontSize: 36)),
              SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('150 Free Coins!', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Color(0xFF0D0D0D))),
                Text('Welcome gift for new members', style: TextStyle(color: Color(0x990D0D0D), fontSize: 13)),
              ])),
            ]),
          ),
        ]);
      default: return const SizedBox();
    }
  }
}
