import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';

import 'app_shell.dart';
import 'services/api_client.dart';

class BakeryApp extends StatelessWidget {
  const BakeryApp({super.key, required this.apiClient});

  final ApiClient apiClient;

  @override
  Widget build(BuildContext context) {
    final colors = ColorScheme.fromSeed(
      seedColor: const Color(0xFF9A3412),
      brightness: Brightness.light,
    );

    return MaterialApp(
      title: 'Golden Crumb Bakery',
      scrollBehavior: const MaterialScrollBehavior().copyWith(
        dragDevices: {
          PointerDeviceKind.touch,
          PointerDeviceKind.mouse,
          PointerDeviceKind.stylus,
          PointerDeviceKind.invertedStylus,
          PointerDeviceKind.trackpad,
          PointerDeviceKind.unknown,
        },
      ),
      theme: ThemeData(
        colorScheme: colors,
        scaffoldBackgroundColor: const Color(0xFFFFFBF7),
        appBarTheme: AppBarTheme(
          backgroundColor: colors.surface,
          foregroundColor: colors.onSurface,
          elevation: 0,
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFFF3E8E0)),
          ),
        ),
        useMaterial3: true,
      ),
      home: BakeryShell(apiClient: apiClient),
    );
  }
}
