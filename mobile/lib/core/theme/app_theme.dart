import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Backgrounds
  static const bgPrimary = Color(0xFF0D0D0D);
  static const bgSurface = Color(0xFF1A1A2E);
  static const bgElevated = Color(0xFF16213E);
  static const bgCard = Color(0xFF1E1E35);

  // Accents
  static const accentPrimary = Color(0xFFE8336D);
  static const accentSecondary = Color(0xFFFF6B9D);
  static const accentGold = Color(0xFFF5C542);
  static const accentGoldDark = Color(0xFFC9A227);
  static const accentPurple = Color(0xFFA78BFA);

  // Text
  static const textPrimary = Color(0xFFFFFFFF);
  static const textSecondary = Color(0xFFB0B0C3);
  static const textMuted = Color(0xFF6B6B8A);

  // Status
  static const success = Color(0xFF4CAF82);
  static const error = Color(0xFFFF4B6E);
  static const warning = Color(0xFFFFA726);

  // Gradients
  static const gradientPrimary = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [accentPrimary, accentSecondary],
  );

  static const gradientGold = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [accentGold, accentGoldDark],
  );

  static const gradientBg = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [bgPrimary, Color(0xFF1A0A18), bgPrimary],
  );

  static const gradientCard = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Colors.transparent, Color(0xF00D0D0D)],
  );
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.bgPrimary,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.accentPrimary,
        secondary: AppColors.accentSecondary,
        surface: AppColors.bgSurface,
        error: AppColors.error,
      ),
      textTheme: GoogleFonts.interTextTheme(
        const TextTheme(
          displayLarge: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w800),
          displayMedium: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700),
          headlineLarge: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w800),
          headlineMedium: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700),
          headlineSmall: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600),
          titleLarge: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700),
          titleMedium: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600),
          bodyLarge: TextStyle(color: AppColors.textPrimary),
          bodyMedium: TextStyle(color: AppColors.textSecondary),
          bodySmall: TextStyle(color: AppColors.textMuted),
          labelLarge: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.bgPrimary,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: AppColors.textPrimary),
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.bgSurface,
        selectedItemColor: AppColors.accentPrimary,
        unselectedItemColor: AppColors.textMuted,
        showSelectedLabels: true,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.bgSurface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0x14FFFFFF)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0x14FFFFFF)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.accentPrimary, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.textMuted),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.accentPrimary,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.bgCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0x14FFFFFF)),
        ),
      ),
      dividerColor: const Color(0x14FFFFFF),
      iconTheme: const IconThemeData(color: AppColors.textSecondary),
    );
  }
}
