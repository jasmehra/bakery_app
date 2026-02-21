import 'package:flutter/material.dart';

import '../config/app_config.dart';
import '../models/content_models.dart';
import '../services/api_client.dart';
import '../widgets/collection_editor.dart';
import '../widgets/section_header.dart';

class AdminPage extends StatefulWidget {
  const AdminPage({
    super.key,
    required this.apiClient,
    required this.onExitAdmin,
  });

  final ApiClient apiClient;
  final VoidCallback onExitAdmin;

  @override
  State<AdminPage> createState() => _AdminPageState();
}

class _AdminPageState extends State<AdminPage> {
  bool loading = true;
  bool saving = false;
  String error = '';
  String success = '';
  AdminContent? adminContent;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      loading = true;
      error = '';
      success = '';
    });
    try {
      final data = await widget.apiClient.fetchAdminContent();
      setState(() {
        adminContent = data;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = asError(e);
        loading = false;
      });
    }
  }

  Future<void> _save() async {
    final data = adminContent;
    if (data == null) {
      return;
    }
    setState(() {
      saving = true;
      error = '';
      success = '';
    });
    try {
      await widget.apiClient.updateAdminContent(data.toJson());
      setState(() => success = 'Changes saved successfully.');
    } catch (e) {
      setState(() => error = asError(e));
    } finally {
      if (mounted) {
        setState(() => saving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final data = adminContent;
    if (data == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Admin')),
        body: Center(child: Text(error.isEmpty ? 'No admin data.' : error)),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Website Content Control Panel'),
        actions: [
          TextButton(
            onPressed: widget.onExitAdmin,
            child: const Text('Website'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              FilledButton(
                onPressed: saving ? null : _save,
                child: Text(saving ? 'Saving...' : 'Save All Changes'),
              ),
              OutlinedButton(onPressed: _load, child: const Text('Reload')),
            ],
          ),
          if (error.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(error, style: const TextStyle(color: Colors.red)),
            ),
          if (success.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(success, style: const TextStyle(color: Colors.green)),
            ),
          const SizedBox(height: 16),
          const SectionHeader(eyebrow: 'Text Content', title: 'Website copy'),
          ...settingsFields.map(
            (field) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: TextFormField(
                initialValue: data.siteSettings[field.key] ?? '',
                minLines: isLongSettingField(field.key) ? 2 : 1,
                maxLines: isLongSettingField(field.key) ? 4 : 1,
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  labelText: field.label,
                ),
                onChanged: (value) {
                  data.siteSettings[field.key] = value;
                },
              ),
            ),
          ),
          const SizedBox(height: 12),
          CollectionEditor(
            title: 'Featured Items',
            rows: data.featuredItems,
            columns: const [
              CollectionColumn('id', 'ID'),
              CollectionColumn('title', 'Title'),
              CollectionColumn('price', 'Price', isNumeric: true),
              CollectionColumn('image', 'Image URL'),
            ],
            onAdd: () {
              setState(() {
                data.featuredItems.add(
                  MenuItem(
                    id: newItemId('featured'),
                    title: '',
                    price: 0,
                    image: '',
                  ),
                );
              });
            },
          ),
          const SizedBox(height: 12),
          CollectionEditor(
            title: 'Order Items',
            rows: data.orderItems,
            columns: const [
              CollectionColumn('id', 'ID'),
              CollectionColumn('title', 'Title'),
              CollectionColumn('note', 'Note'),
              CollectionColumn('price', 'Price', isNumeric: true),
              CollectionColumn('image', 'Image URL'),
            ],
            onAdd: () {
              setState(() {
                data.orderItems.add(
                  MenuItem(
                    id: newItemId('order'),
                    title: '',
                    price: 0,
                    image: '',
                    note: '',
                  ),
                );
              });
            },
          ),
          const SizedBox(height: 12),
          CollectionEditor(
            title: 'Gallery Images',
            rows: data.galleryImages,
            columns: const [
              CollectionColumn('src', 'Image URL'),
              CollectionColumn('alt', 'Alt text'),
            ],
            onAdd: () {
              setState(() {
                data.galleryImages.add(GalleryImage(src: '', alt: ''));
              });
            },
          ),
          const SizedBox(height: 12),
          CollectionEditor(
            title: 'Testimonials',
            rows: data.testimonials,
            columns: const [
              CollectionColumn('name', 'Name'),
              CollectionColumn('text', 'Text'),
            ],
            onAdd: () {
              setState(() {
                data.testimonials.add(Testimonial(name: '', text: ''));
              });
            },
          ),
        ],
      ),
    );
  }
}
