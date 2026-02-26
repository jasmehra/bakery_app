import 'package:flutter/foundation.dart';

const cartStorageKey = 'golden-crumb-cart-v1';
const apiBaseFromDefine = String.fromEnvironment('API_BASE_URL');

const settingsFields = <SettingField>[
  SettingField('brandName', 'Brand Name'),
  SettingField('navMenu', 'Nav Menu Label'),
  SettingField('navOrder', 'Nav Order Label'),
  SettingField('navGallery', 'Nav Gallery Label'),
  SettingField('navStory', 'Nav Story Label'),
  SettingField('navContact', 'Nav Contact Label'),
  SettingField('heroEyebrow', 'Hero Eyebrow'),
  SettingField('heroTitle', 'Hero Title'),
  SettingField('heroSubtitle', 'Hero Subtitle'),
  SettingField('heroPrimaryCta', 'Hero Primary Button'),
  SettingField('heroSecondaryCta', 'Hero Secondary Button'),
  SettingField('featuredEyebrow', 'Featured Eyebrow'),
  SettingField('featuredTitle', 'Featured Title'),
  SettingField('orderEyebrow', 'Order Eyebrow'),
  SettingField('orderTitle', 'Order Title'),
  SettingField('storyEyebrow', 'Story Eyebrow'),
  SettingField('storyTitle', 'Story Title'),
  SettingField('storyBodyOne', 'Story Paragraph One'),
  SettingField('storyBodyTwo', 'Story Paragraph Two'),
  SettingField('galleryEyebrow', 'Gallery Eyebrow'),
  SettingField('galleryTitle', 'Gallery Title'),
  SettingField('testimonialsEyebrow', 'Testimonials Eyebrow'),
  SettingField('testimonialsTitle', 'Testimonials Title'),
  SettingField('contactEyebrow', 'Contact Eyebrow'),
  SettingField('contactTitle', 'Contact Title'),
  SettingField('mapTitle', 'Map Card Title'),
  SettingField('mapAddress', 'Map Address'),
  SettingField('mapHours', 'Map Hours'),
  SettingField('mapEmail', 'Map Email'),
];

const defaultSiteSettings = <String, String>{
  'brandName': 'Golden Crumb Bakery',
  'navMenu': 'Menu',
  'navOrder': 'Order',
  'navGallery': 'Gallery',
  'navStory': 'Our Story',
  'navContact': 'Contact',
  'heroEyebrow': 'Fresh every morning',
  'heroTitle': 'Handcrafted bakes made with warmth and tradition.',
  'heroSubtitle':
      'Artisan breads, elegant cakes, and small-batch pastries baked daily in the heart of your neighborhood.',
  'heroPrimaryCta': 'Order for Pickup',
  'heroSecondaryCta': 'See Full Menu',
  'featuredEyebrow': 'Featured Favorites',
  'featuredTitle': 'Signature bakes customers love most',
  'orderEyebrow': 'Online Ordering',
  'orderTitle': 'Build your bakery box',
  'storyEyebrow': 'Our Story',
  'storyTitle': 'Family recipes, modern craft, and local ingredients.',
  'storyBodyOne':
      'Golden Crumb began as a tiny kitchen project and grew into a full neighborhood bakery.',
  'storyBodyTwo':
      'From rustic loaves to celebration cakes, we bake with care so every bite feels comforting and memorable.',
  'galleryEyebrow': 'Gallery',
  'galleryTitle': 'Inside the bakery',
  'testimonialsEyebrow': 'Customer Notes',
  'testimonialsTitle': 'What people say about Golden Crumb',
  'contactEyebrow': 'Contact',
  'contactTitle': 'Talk to our pastry team',
  'mapTitle': 'Visit us this week',
  'mapAddress': '214 Maple Street, Portland, OR',
  'mapHours': 'Mon-Sat: 7:00 AM - 7:00 PM | Sun: 8:00 AM - 4:00 PM',
  'mapEmail': 'hello@goldencrumb.com',
};

String resolveApiBaseUrl() {
  if (apiBaseFromDefine.isNotEmpty) {
    return apiBaseFromDefine;
  }
  if (kIsWeb) {
    return '/api';
  }
  if (defaultTargetPlatform == TargetPlatform.android) {
    return 'http://10.0.2.2:4000/api';
  }
  return 'http://172.20.10.2:4000/api';
}

class SettingField {
  const SettingField(this.key, this.label);

  final String key;
  final String label;
}
