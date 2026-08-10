import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:kenyandates/features/auth/screens/splash_screen.dart';
import 'package:kenyandates/features/auth/screens/onboarding_screen.dart';
import 'package:kenyandates/features/auth/screens/login_screen.dart';
import 'package:kenyandates/features/auth/screens/register_screen.dart';
import 'package:kenyandates/features/auth/screens/otp_screen.dart';
import 'package:kenyandates/features/auth/screens/profile_setup_screen.dart';
import 'package:kenyandates/core/widgets/main_shell.dart';
import 'package:kenyandates/features/home/screens/home_screen.dart';
import 'package:kenyandates/features/explore/screens/explore_screen.dart';
import 'package:kenyandates/features/chat/screens/chat_list_screen.dart';
import 'package:kenyandates/features/chat/screens/conversation_screen.dart';
import 'package:kenyandates/features/favorites/screens/favorites_screen.dart';
import 'package:kenyandates/features/profile/screens/profile_screen.dart';
import 'package:kenyandates/features/membership/screens/membership_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
    GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
    GoRoute(
      path: '/otp',
      builder: (_, state) => OtpScreen(phone: state.uri.queryParameters['phone'] ?? ''),
    ),
    GoRoute(path: '/profile-setup', builder: (_, __) => const ProfileSetupScreen()),
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/explore', builder: (_, __) => const ExploreScreen()),
        GoRoute(path: '/chat', builder: (_, __) => const ChatListScreen()),
        GoRoute(
          path: '/chat/:id',
          builder: (_, state) => ConversationScreen(userId: state.pathParameters['id'] ?? ''),
        ),
        GoRoute(path: '/favorites', builder: (_, __) => const FavoritesScreen()),
        GoRoute(path: '/me', builder: (_, __) => const ProfileScreen()),
        GoRoute(path: '/membership', builder: (_, __) => const MembershipScreen()),
      ],
    ),
  ],
);
