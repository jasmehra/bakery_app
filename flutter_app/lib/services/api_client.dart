import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/content_models.dart';

class ApiClient {
  ApiClient(this.baseUrl);

  final String baseUrl;

  Future<SiteContent> fetchContent() async {
    final json = await _request('/content');
    return SiteContent.fromJson(json);
  }

  Future<AdminContent> fetchAdminContent() async {
    final json = await _request('/admin/content');
    return AdminContent.fromJson(json);
  }

  Future<void> updateAdminContent(Map<String, dynamic> payload) async {
    await _request('/admin/content', method: 'PUT', body: payload);
  }

  Future<void> createOrder(Map<String, dynamic> payload) async {
    await _request('/orders', method: 'POST', body: payload);
  }

  Future<void> createContactMessage(Map<String, dynamic> payload) async {
    await _request('/contact-messages', method: 'POST', body: payload);
  }

  Future<Map<String, dynamic>> _request(
    String path, {
    String method = 'GET',
    Map<String, dynamic>? body,
  }) async {
    final uri = Uri.parse('$baseUrl$path');
    late http.Response response;

    switch (method) {
      case 'POST':
        response = await http.post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(body),
        );
        break;
      case 'PUT':
        response = await http.put(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(body),
        );
        break;
      default:
        response = await http.get(uri);
    }

    final payload = response.body.isEmpty
        ? <String, dynamic>{}
        : jsonDecode(response.body);

    if (response.statusCode < 200 || response.statusCode > 299) {
      final message =
          payload is Map<String, dynamic> && payload['error'] != null
          ? '${payload['error']}'
          : 'Request failed: ${response.statusCode}';
      throw Exception(message);
    }

    return payload is Map<String, dynamic>
        ? payload
        : <String, dynamic>{'data': payload};
  }
}
