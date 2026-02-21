import '../config/app_config.dart';

abstract class EditableRow {
  dynamic getValue(String key);

  void setValue(String key, dynamic value);
}

class MenuItem extends EditableRow {
  MenuItem({
    required this.id,
    required this.title,
    required this.price,
    required this.image,
    this.note,
  });

  String id;
  String title;
  double price;
  String image;
  String? note;

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      id: '${json['id'] ?? ''}',
      title: '${json['title'] ?? ''}',
      price: (json['price'] as num?)?.toDouble() ?? 0,
      image: '${json['image'] ?? ''}',
      note: json['note'] == null ? null : '${json['note']}',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'price': price,
      'image': image,
      if (note != null) 'note': note,
    };
  }

  @override
  dynamic getValue(String key) {
    switch (key) {
      case 'id':
        return id;
      case 'title':
        return title;
      case 'price':
        return price;
      case 'image':
        return image;
      case 'note':
        return note ?? '';
      default:
        return '';
    }
  }

  @override
  void setValue(String key, dynamic value) {
    switch (key) {
      case 'title':
        title = '$value';
        break;
      case 'id':
        id = '$value';
        break;
      case 'price':
        price = (value as num?)?.toDouble() ?? 0;
        break;
      case 'image':
        image = '$value';
        break;
      case 'note':
        note = '$value';
        break;
      default:
        break;
    }
  }
}

class GalleryImage extends EditableRow {
  GalleryImage({required this.src, required this.alt, this.id});

  final int? id;
  String src;
  String alt;

  factory GalleryImage.fromJson(Map<String, dynamic> json) {
    return GalleryImage(
      id: (json['id'] as num?)?.toInt(),
      src: '${json['src'] ?? ''}',
      alt: '${json['alt'] ?? ''}',
    );
  }

  Map<String, dynamic> toJson() {
    return {if (id != null) 'id': id, 'src': src, 'alt': alt};
  }

  @override
  dynamic getValue(String key) {
    switch (key) {
      case 'src':
        return src;
      case 'alt':
        return alt;
      default:
        return '';
    }
  }

  @override
  void setValue(String key, dynamic value) {
    switch (key) {
      case 'src':
        src = '$value';
        break;
      case 'alt':
        alt = '$value';
        break;
      default:
        break;
    }
  }
}

class Testimonial extends EditableRow {
  Testimonial({required this.name, required this.text, this.id});

  final int? id;
  String name;
  String text;

  factory Testimonial.fromJson(Map<String, dynamic> json) {
    return Testimonial(
      id: (json['id'] as num?)?.toInt(),
      name: '${json['name'] ?? ''}',
      text: '${json['text'] ?? ''}',
    );
  }

  Map<String, dynamic> toJson() {
    return {if (id != null) 'id': id, 'name': name, 'text': text};
  }

  @override
  dynamic getValue(String key) {
    switch (key) {
      case 'name':
        return name;
      case 'text':
        return text;
      default:
        return '';
    }
  }

  @override
  void setValue(String key, dynamic value) {
    switch (key) {
      case 'name':
        name = '$value';
        break;
      case 'text':
        text = '$value';
        break;
      default:
        break;
    }
  }
}

class SiteContent {
  SiteContent({
    required this.featuredItems,
    required this.orderItems,
    required this.galleryImages,
    required this.testimonials,
    required this.siteSettings,
  });

  final List<MenuItem> featuredItems;
  final List<MenuItem> orderItems;
  final List<GalleryImage> galleryImages;
  final List<Testimonial> testimonials;
  final Map<String, String> siteSettings;

  factory SiteContent.fromJson(Map<String, dynamic> json) {
    return SiteContent(
      featuredItems: menuListFromJson(json['featuredItems']),
      orderItems: menuListFromJson(json['orderItems']),
      galleryImages: galleryListFromJson(json['galleryImages']),
      testimonials: testimonialListFromJson(json['testimonials']),
      siteSettings: settingsFromJson(json['siteSettings']),
    );
  }
}

class AdminContent {
  AdminContent({
    required this.featuredItems,
    required this.orderItems,
    required this.galleryImages,
    required this.testimonials,
    required this.siteSettings,
  });

  final List<MenuItem> featuredItems;
  final List<MenuItem> orderItems;
  final List<GalleryImage> galleryImages;
  final List<Testimonial> testimonials;
  final Map<String, String> siteSettings;

  factory AdminContent.fromJson(Map<String, dynamic> json) {
    return AdminContent(
      featuredItems: menuListFromJson(json['featuredItems']),
      orderItems: menuListFromJson(json['orderItems']),
      galleryImages: galleryListFromJson(json['galleryImages']),
      testimonials: testimonialListFromJson(json['testimonials']),
      siteSettings: settingsFromJson(json['siteSettings']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'featuredItems': featuredItems.map((entry) => entry.toJson()).toList(),
      'orderItems': orderItems.map((entry) => entry.toJson()).toList(),
      'galleryImages': galleryImages.map((entry) => entry.toJson()).toList(),
      'testimonials': testimonials.map((entry) => entry.toJson()).toList(),
      'siteSettings': siteSettings,
    };
  }
}

class CartRow {
  const CartRow({required this.item, required this.qty});

  final MenuItem item;
  final int qty;

  double get lineTotal => double.parse((item.price * qty).toStringAsFixed(2));
}

List<MenuItem> menuListFromJson(dynamic raw) {
  if (raw is! List) {
    return [];
  }
  return raw.whereType<Map<String, dynamic>>().map(MenuItem.fromJson).toList();
}

List<GalleryImage> galleryListFromJson(dynamic raw) {
  if (raw is! List) {
    return [];
  }
  return raw
      .whereType<Map<String, dynamic>>()
      .map(GalleryImage.fromJson)
      .toList();
}

List<Testimonial> testimonialListFromJson(dynamic raw) {
  if (raw is! List) {
    return [];
  }
  return raw
      .whereType<Map<String, dynamic>>()
      .map(Testimonial.fromJson)
      .toList();
}

Map<String, String> settingsFromJson(dynamic raw) {
  if (raw is! Map) {
    return <String, String>{...defaultSiteSettings};
  }
  final mapped = raw.map((key, value) => MapEntry('$key', '$value'));
  return <String, String>{...defaultSiteSettings, ...mapped};
}

bool isLongSettingField(String key) {
  return key.toLowerCase().contains('title') ||
      key.toLowerCase().contains('body');
}

String asCurrency(double value) => '\$${value.toStringAsFixed(2)}';

String asError(Object error) {
  if (error is Exception) {
    return error.toString().replaceFirst('Exception: ', '');
  }
  return '$error';
}

String newItemId(String prefix) =>
    '$prefix-${DateTime.now().millisecondsSinceEpoch}';

Map<String, dynamic> buildOrderPayload({
  required String customerName,
  required String customerPhone,
  required String pickupTime,
  required List<CartRow> rows,
}) {
  final subtotal = rows.fold<double>(0, (sum, row) => sum + row.lineTotal);
  final itemCount = rows.fold<int>(0, (sum, row) => sum + row.qty);
  return {
    'orderId': 'GC-${DateTime.now().millisecondsSinceEpoch}',
    'createdAt': DateTime.now().toIso8601String(),
    'customer': {'name': customerName, 'phone': customerPhone},
    'pickupTime': pickupTime,
    'items': rows
        .map(
          (row) => {
            'id': row.item.id,
            'title': row.item.title,
            'qty': row.qty,
            'unitPrice': row.item.price,
            'lineTotal': row.lineTotal,
          },
        )
        .toList(),
    'totals': {
      'itemCount': itemCount,
      'subtotal': double.parse(subtotal.toStringAsFixed(2)),
    },
  };
}
