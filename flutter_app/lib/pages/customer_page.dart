import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config/app_config.dart';
import '../models/content_models.dart';
import '../services/api_client.dart';
import '../widgets/menu_item_card.dart';
import '../widgets/section_header.dart';

class CustomerPage extends StatefulWidget {
  const CustomerPage({
    super.key,
    required this.apiClient,
    required this.onOpenAdmin,
  });

  final ApiClient apiClient;
  final VoidCallback onOpenAdmin;

  @override
  State<CustomerPage> createState() => _CustomerPageState();
}

class _CustomerPageState extends State<CustomerPage> {
  bool loading = true;
  String error = '';
  SiteContent? content;

  final Map<String, int> cart = {};
  bool placingOrder = false;
  String orderError = '';
  String orderSuccess = '';

  bool sendingContact = false;
  String contactError = '';
  String contactSuccess = '';

  final checkoutNameController = TextEditingController();
  final checkoutPhoneController = TextEditingController();
  final checkoutPickupController = TextEditingController();

  final contactNameController = TextEditingController();
  final contactEmailController = TextEditingController();
  final contactMessageController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  @override
  void dispose() {
    checkoutNameController.dispose();
    checkoutPhoneController.dispose();
    checkoutPickupController.dispose();
    contactNameController.dispose();
    contactEmailController.dispose();
    contactMessageController.dispose();
    super.dispose();
  }

  Future<void> _bootstrap() async {
    await Future.wait([_loadContent(), _loadCart()]);
  }

  Future<void> _loadContent() async {
    setState(() {
      loading = true;
      error = '';
    });
    try {
      final data = await widget.apiClient.fetchContent();
      setState(() {
        content = data;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = asError(e);
        loading = false;
      });
    }
  }

  Future<void> _loadCart() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(cartStorageKey);
    if (raw == null || raw.trim().isEmpty) {
      return;
    }

    try {
      final decoded = jsonDecode(raw);
      if (decoded is Map<String, dynamic>) {
        final next = <String, int>{};
        decoded.forEach((key, value) {
          final qty = (value as num?)?.toInt() ?? 0;
          if (qty > 0) {
            next[key] = qty;
          }
        });
        if (!mounted) {
          return;
        }
        setState(() {
          cart
            ..clear()
            ..addAll(next);
        });
      }
    } catch (_) {
      // no-op
    }
  }

  Future<void> _persistCart() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(cartStorageKey, jsonEncode(cart));
  }

  Map<String, String> get text {
    final merged = <String, String>{...defaultSiteSettings};
    if (content != null) {
      merged.addAll(content!.siteSettings);
    }
    return merged;
  }

  List<MenuItem> get catalog => [
    ...(content?.featuredItems ?? const []),
    ...(content?.orderItems ?? const []),
  ];

  List<CartRow> get cartRows {
    final byId = {for (final item in catalog) item.id: item};
    return cart.entries
        .map((entry) {
          final item = byId[entry.key];
          if (item == null) {
            return null;
          }
          return CartRow(item: item, qty: entry.value);
        })
        .whereType<CartRow>()
        .toList();
  }

  int get totalItems => cart.values.fold(0, (sum, qty) => sum + qty);

  double get subtotal => cartRows.fold(0, (sum, row) => sum + row.lineTotal);

  Future<void> _addToCart(String id) async {
    setState(() {
      cart[id] = (cart[id] ?? 0) + 1;
    });
    await _persistCart();
  }

  Future<void> _removeFromCart(String id) async {
    setState(() {
      final next = (cart[id] ?? 0) - 1;
      if (next <= 0) {
        cart.remove(id);
      } else {
        cart[id] = next;
      }
    });
    await _persistCart();
  }

  Future<void> _clearCart() async {
    setState(() => cart.clear());
    await _persistCart();
  }

  Future<void> _submitOrder() async {
    setState(() {
      orderError = '';
      orderSuccess = '';
    });

    final checkoutName = checkoutNameController.text.trim();
    final checkoutPhone = checkoutPhoneController.text.trim();
    final checkoutPickup = checkoutPickupController.text.trim();

    if (totalItems == 0) {
      setState(() => orderError = 'Add at least one item to checkout.');
      return;
    }
    if (checkoutName.isEmpty) {
      setState(() => orderError = 'Pickup name is required.');
      return;
    }
    if (!RegExp(r'^\+?[0-9()\-\s]{8,}$').hasMatch(checkoutPhone)) {
      setState(() => orderError = 'Enter a valid phone number.');
      return;
    }
    if (checkoutPickup.isEmpty) {
      setState(() => orderError = 'Pick a pickup time.');
      return;
    }

    final payload = buildOrderPayload(
      customerName: checkoutName,
      customerPhone: checkoutPhone,
      pickupTime: checkoutPickup,
      rows: cartRows,
    );

    setState(() => placingOrder = true);
    try {
      await widget.apiClient.createOrder(payload);
      setState(() {
        orderSuccess = 'Order submitted successfully.';
      });
      checkoutNameController.clear();
      checkoutPhoneController.clear();
      checkoutPickupController.clear();
      await _clearCart();
    } catch (e) {
      setState(() => orderError = asError(e));
    } finally {
      if (mounted) {
        setState(() => placingOrder = false);
      }
    }
  }

  Future<void> _submitContact() async {
    setState(() {
      contactError = '';
      contactSuccess = '';
    });

    final name = contactNameController.text.trim();
    final email = contactEmailController.text.trim();
    final message = contactMessageController.text.trim();

    if (name.isEmpty) {
      setState(() => contactError = 'Name is required.');
      return;
    }
    if (!RegExp(r'\S+@\S+\.\S+').hasMatch(email)) {
      setState(() => contactError = 'Enter a valid email address.');
      return;
    }
    if (message.length < 12) {
      setState(
        () => contactError = 'Message should be at least 12 characters.',
      );
      return;
    }

    setState(() => sendingContact = true);
    try {
      await widget.apiClient.createContactMessage({
        'name': name,
        'email': email,
        'message': message,
      });
      setState(() {
        contactSuccess = 'Message sent.';
      });
      contactNameController.clear();
      contactEmailController.clear();
      contactMessageController.clear();
    } catch (e) {
      setState(() => contactError = asError(e));
    } finally {
      if (mounted) {
        setState(() => sendingContact = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (error.isNotEmpty) {
      return Scaffold(
        appBar: AppBar(title: Text(text['brandName'] ?? 'Golden Crumb Bakery')),
        body: Center(child: Text(error)),
      );
    }

    final data = content;
    if (data == null) {
      return const Scaffold(body: Center(child: Text('No data available.')));
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(text['brandName'] ?? 'Golden Crumb Bakery'),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 8),
              child: Text('Cart: $totalItems'),
            ),
          ),
          TextButton(onPressed: widget.onOpenAdmin, child: const Text('Admin')),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFFFF7ED), Color(0xFFFFFFFF)],
          ),
        ),
        child: RefreshIndicator(
          onRefresh: _loadContent,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                elevation: 0,
                color: const Color(0xFFFFEDD5),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SectionHeader(
                        eyebrow: text['heroEyebrow'] ?? 'Fresh every morning',
                        title: text['heroTitle'] ?? '',
                      ),
                      Text(text['heroSubtitle'] ?? ''),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SectionHeader(
                eyebrow: text['featuredEyebrow'] ?? 'Featured Favorites',
                title: text['featuredTitle'] ?? 'Signature bakes',
              ),
              ...data.featuredItems.map(
                (item) =>
                    MenuItemCard(item: item, onAdd: () => _addToCart(item.id)),
              ),
              const SizedBox(height: 16),
              SectionHeader(
                eyebrow: text['orderEyebrow'] ?? 'Online Ordering',
                title: text['orderTitle'] ?? 'Build your bakery box',
              ),
              ...data.orderItems.map(
                (item) =>
                    MenuItemCard(item: item, onAdd: () => _addToCart(item.id)),
              ),
              const SizedBox(height: 16),
              SectionHeader(eyebrow: 'Cart', title: 'Checkout'),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      ...cartRows.map(
                        (row) => ListTile(
                          dense: true,
                          contentPadding: EdgeInsets.zero,
                          title: Text('${row.item.title} x${row.qty}'),
                          subtitle: Text(asCurrency(row.lineTotal)),
                          trailing: IconButton(
                            onPressed: () => _removeFromCart(row.item.id),
                            icon: const Icon(Icons.remove_circle_outline),
                          ),
                        ),
                      ),
                      if (cartRows.isEmpty)
                        const Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Your cart is empty. Add items from the menu.',
                          ),
                        ),
                      const SizedBox(height: 8),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Subtotal: ${asCurrency(subtotal)}',
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: checkoutNameController,
                        decoration: const InputDecoration(
                          labelText: 'Pickup Name',
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: checkoutPhoneController,
                        decoration: const InputDecoration(labelText: 'Phone'),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: checkoutPickupController,
                        decoration: const InputDecoration(
                          labelText: 'Pickup Time (example: 2026-02-21T15:30)',
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: placingOrder ? null : _submitOrder,
                          child: Text(
                            placingOrder ? 'Submitting...' : 'Place Order',
                          ),
                        ),
                      ),
                      if (orderError.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            orderError,
                            style: const TextStyle(color: Colors.red),
                          ),
                        ),
                      if (orderSuccess.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            orderSuccess,
                            style: const TextStyle(color: Colors.green),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SectionHeader(
                eyebrow: text['storyEyebrow'] ?? 'Our Story',
                title: text['storyTitle'] ?? '',
              ),
              Text(text['storyBodyOne'] ?? ''),
              const SizedBox(height: 6),
              Text(text['storyBodyTwo'] ?? ''),
              const SizedBox(height: 16),
              SectionHeader(
                eyebrow: text['galleryEyebrow'] ?? 'Gallery',
                title: text['galleryTitle'] ?? 'Inside the bakery',
              ),
              ...data.galleryImages.map(
                (image) => ListTile(
                  leading: const Icon(Icons.photo),
                  title: Text(image.alt),
                  subtitle: Text(image.src),
                ),
              ),
              const SizedBox(height: 16),
              SectionHeader(
                eyebrow: text['testimonialsEyebrow'] ?? 'Customer Notes',
                title: text['testimonialsTitle'] ?? 'What people say',
              ),
              ...data.testimonials.map(
                (entry) => Card(
                  child: ListTile(
                    title: Text(entry.name),
                    subtitle: Text(entry.text),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SectionHeader(
                eyebrow: text['contactEyebrow'] ?? 'Contact',
                title: text['contactTitle'] ?? 'Talk to our pastry team',
              ),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      TextField(
                        controller: contactNameController,
                        decoration: const InputDecoration(labelText: 'Name'),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: contactEmailController,
                        decoration: const InputDecoration(labelText: 'Email'),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: contactMessageController,
                        minLines: 3,
                        maxLines: 5,
                        decoration: const InputDecoration(labelText: 'Message'),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: sendingContact ? null : _submitContact,
                          child: Text(
                            sendingContact ? 'Sending...' : 'Send Message',
                          ),
                        ),
                      ),
                      if (contactError.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            contactError,
                            style: const TextStyle(color: Colors.red),
                          ),
                        ),
                      if (contactSuccess.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            contactSuccess,
                            style: const TextStyle(color: Colors.green),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(text['mapTitle'] ?? 'Visit us this week'),
                      const SizedBox(height: 4),
                      Text(text['mapAddress'] ?? ''),
                      Text(text['mapHours'] ?? ''),
                      Text(text['mapEmail'] ?? ''),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
