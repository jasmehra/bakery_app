import 'package:flutter/material.dart';

import '../models/content_models.dart';

class CollectionColumn {
  const CollectionColumn(this.key, this.label, {this.isNumeric = false});

  final String key;
  final String label;
  final bool isNumeric;
}

class CollectionEditor<T extends EditableRow> extends StatefulWidget {
  const CollectionEditor({
    super.key,
    required this.title,
    required this.rows,
    required this.columns,
    required this.onAdd,
  });

  final String title;
  final List<T> rows;
  final List<CollectionColumn> columns;
  final VoidCallback onAdd;

  @override
  State<CollectionEditor<T>> createState() => _CollectionEditorState<T>();
}

class _CollectionEditorState<T extends EditableRow>
    extends State<CollectionEditor<T>> {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    widget.title,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                FilledButton.tonal(
                  onPressed: widget.onAdd,
                  child: const Text('Add Row'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...widget.rows.asMap().entries.map((entry) {
              final index = entry.key;
              final row = entry.value;
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    children: [
                      ...widget.columns.map(
                        (column) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: TextFormField(
                            initialValue: '${row.getValue(column.key) ?? ''}',
                            keyboardType: column.isNumeric
                                ? const TextInputType.numberWithOptions(
                                    decimal: true,
                                  )
                                : null,
                            decoration: InputDecoration(
                              border: const OutlineInputBorder(),
                              labelText: column.label,
                            ),
                            onChanged: (value) {
                              setState(() {
                                row.setValue(
                                  column.key,
                                  column.isNumeric
                                      ? double.tryParse(value) ?? 0
                                      : value,
                                );
                              });
                            },
                          ),
                        ),
                      ),
                      Align(
                        alignment: Alignment.centerRight,
                        child: OutlinedButton(
                          onPressed: () =>
                              setState(() => widget.rows.removeAt(index)),
                          child: const Text('Delete'),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
