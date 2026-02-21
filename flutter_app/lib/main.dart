import 'package:flutter/material.dart';

import 'app.dart';
import 'config/app_config.dart';
import 'services/api_client.dart';

void main() {
  runApp(BakeryApp(apiClient: ApiClient(resolveApiBaseUrl())));
}
