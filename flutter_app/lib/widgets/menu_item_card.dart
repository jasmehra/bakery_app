import 'package:flutter/material.dart';

import '../models/content_models.dart';

class MenuItemCard extends StatelessWidget {
  const MenuItemCard({super.key, required this.item, required this.onAdd});

  final MenuItem item;
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(item.title),
        subtitle: Text(
          item.note == null || item.note!.isEmpty
              ? asCurrency(item.price)
              : '${item.note}\n${asCurrency(item.price)}',
        ),
        trailing: FilledButton(onPressed: onAdd, child: const Text('Add')),
      ),
    );
  }
}
