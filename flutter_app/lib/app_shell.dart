import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'pages/admin_page.dart';
import 'pages/customer_page.dart';
import 'services/api_client.dart';

class BakeryShell extends StatefulWidget {
  const BakeryShell({super.key, required this.apiClient});

  final ApiClient apiClient;

  @override
  State<BakeryShell> createState() => _BakeryShellState();
}

class _BakeryShellState extends State<BakeryShell> {
  late bool isAdmin;

  @override
  void initState() {
    super.initState();
    isAdmin = kIsWeb && Uri.base.path == '/admin';
  }

  @override
  Widget build(BuildContext context) {
    return isAdmin
        ? AdminPage(
            apiClient: widget.apiClient,
            onExitAdmin: () => setState(() => isAdmin = false),
          )
        : CustomerPage(
            apiClient: widget.apiClient,
            onOpenAdmin: () => setState(() => isAdmin = true),
          );
  }
}
