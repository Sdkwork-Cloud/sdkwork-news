import 'package:flutter/material.dart';

abstract final class NewsPalette {
  static const ink = Color(0xFF202622);
  static const muted = Color(0xFF7B847E);
  static const canvas = Color(0xFFF6F8F6);
  static const surface = Color(0xFFFFFFFF);
  static const line = Color(0xFFE2E7E3);
  static const primary = Color(0xFF08775A);
  static const primaryDark = Color(0xFF124B3C);
  static const primarySoft = Color(0xFFE4F3ED);
  static const danger = Color(0xFFC44F48);
  static const warning = Color(0xFFA36C21);
  static const blue = Color(0xFF286EA6);
  static const plum = Color(0xFF83536C);
}

abstract final class NewsTheme {
  static ThemeData light() {
    final scheme = ColorScheme.fromSeed(
      seedColor: NewsPalette.primary,
      brightness: Brightness.light,
      surface: NewsPalette.surface,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme.copyWith(
        primary: NewsPalette.primary,
        onPrimary: Colors.white,
        surface: NewsPalette.surface,
        onSurface: NewsPalette.ink,
        outline: NewsPalette.line,
      ),
      scaffoldBackgroundColor: NewsPalette.canvas,
      fontFamilyFallback: const [
        'PingFang SC',
        'Microsoft YaHei',
        'sans-serif',
      ],
      appBarTheme: const AppBarTheme(
        backgroundColor: NewsPalette.surface,
        foregroundColor: NewsPalette.ink,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: NewsPalette.ink,
          fontSize: 20,
          fontWeight: FontWeight.w700,
        ),
      ),
      cardTheme: const CardThemeData(
        color: NewsPalette.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(6)),
          side: BorderSide(color: NewsPalette.line),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        height: 66,
        backgroundColor: NewsPalette.surface,
        indicatorColor: NewsPalette.primarySoft,
        surfaceTintColor: Colors.transparent,
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => TextStyle(
            fontSize: 11,
            fontWeight:
                states.contains(WidgetState.selected) ? FontWeight.w700 : null,
            color: states.contains(WidgetState.selected)
                ? NewsPalette.primary
                : NewsPalette.muted,
          ),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: NewsPalette.line,
        thickness: 1,
        space: 1,
      ),
      inputDecorationTheme: const InputDecorationTheme(
        filled: true,
        fillColor: NewsPalette.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(6)),
          borderSide: BorderSide(color: NewsPalette.line),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(6)),
          borderSide: BorderSide(color: NewsPalette.line),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(6)),
          borderSide: BorderSide(color: NewsPalette.primary, width: 1.4),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(48, 44),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
        ),
      ),
      iconButtonTheme: IconButtonThemeData(
        style: IconButton.styleFrom(minimumSize: const Size(44, 44)),
      ),
    );
  }
}
