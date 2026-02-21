import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/config/app_config.dart';

void main() {
  test('resolveApiBaseUrl returns a non-empty base URL', () {
    expect(resolveApiBaseUrl(), isNotEmpty);
  });
}
