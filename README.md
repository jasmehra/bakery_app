# Golden Crumb Bakery App

Full-stack bakery app using React (frontend) + Node.js/Express (backend) + SQLite (database).

This repository now also includes a Flutter client in `flutter_app/` targeting web, iOS, and Android while reusing the same Express + SQLite backend APIs.

## Working Features

- Responsive bakery website UI (hero, menu, story, gallery, testimonials, contact)
- Multi-component React structure
- Backend-driven content from SQLite: featured items, order items, gallery images, testimonials, and editable site text
- Admin page to edit all visible website content and copy from one place
- SQLite database auto-created and auto-seeded on backend startup
- Swagger API docs for API testing
- Online ordering flow:
  - Add/remove cart items
  - Cart persisted in browser `localStorage`
  - Checkout validation
  - Checkout submits order to backend API
  - Orders saved in SQLite (`orders`, `order_items_log`)
- Contact form:
  - Frontend validation
  - Submits to backend API
  - Messages saved in SQLite (`contact_messages`)
- Scroll reveal animations

## Tech Stack

- Frontend: React 18, Vite 5
- Backend: Node.js, Express 4
- Database: SQLite (`sqlite3` + `sqlite`)
- API Docs: Swagger UI (`swagger-ui-express`)

## Project Structure

```text
bakery-app/
  server/
    index.js
    swaggerSpec.js
    data/
      bakery.db                # auto-created
    db/
      initDb.js
      seedData.js
  src/
    main.jsx
    App.jsx
    apiClient.js
    components/
      AdminPage.jsx
      Header.jsx
      HeroSection.jsx
      FeaturedMenuSection.jsx
      OrderSection.jsx
      StorySection.jsx
      GallerySection.jsx
      TestimonialsSection.jsx
      ContactSection.jsx
    utils/
      cartStorage.js
    styles.css
  index.html
  package.json
  vite.config.js
  .gitignore
  README.md
```

## API Endpoints

- `GET /api/health`
- `GET /api-docs` (Swagger UI)
- `GET /api-docs.json` (OpenAPI JSON)
- `GET /api/content`
- `GET /api/site-settings`
- `GET /api/admin/content`
- `PUT /api/admin/content`
- `GET /api/featured-items`
- `GET /api/order-items`
- `GET /api/gallery-images`
- `GET /api/testimonials`
- `GET /api/orders`
- `POST /api/orders`
- `POST /api/contact-messages`

## Admin Usage

- Open `http://localhost:5173/admin`
- Edit:
  - Site text settings (headings, labels, button text, map/contact text)
  - Featured items
  - Order items
  - Gallery images
  - Testimonials
- Click `Save All Changes` to persist updates via `PUT /api/admin/content`

## Setup and Run

### 1. Install dependencies

```bash
npm install
```

### 2. Run frontend + backend together (recommended)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Admin page: `http://localhost:5173/admin`
- Backend API: `http://localhost:4000`
- Swagger docs: `http://localhost:4000/api-docs`

### 3. Run only backend

```bash
npm run dev:server
```

### 4. Run only frontend

```bash
npm run dev:client
```

### 5. Build frontend

```bash
npm run build
```

### 6. Preview frontend build

```bash
npm run preview
```

### 7. Run backend in production mode (optional)

```bash
npm run start
```

## Flutter Client (Web + iOS + Android)

The Flutter app is in `flutter_app/` and consumes the same endpoints:
- `GET /api/content`
- `POST /api/orders`
- `POST /api/contact-messages`
- `GET /api/admin/content`
- `PUT /api/admin/content`

### Run Flutter Web (with backend running)

```bash
cd flutter_app
flutter run -d chrome
```

For web, API defaults to relative `/api` (same-origin/reverse-proxy setup).

### Run Flutter Android Emulator

```bash
cd flutter_app
flutter run -d android
```

Default Android emulator API base is `http://10.0.2.2:4000/api`.

### Run Flutter iOS Simulator

```bash
cd flutter_app
flutter run -d ios
```

Default iOS API base is `http://localhost:4000/api`.

### Override API Base URL (all platforms)

Use `--dart-define` when your backend is not at the default host:

```bash
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:4000/api
flutter run -d ios --dart-define=API_BASE_URL=http://192.168.1.10:4000/api
flutter run -d android --dart-define=API_BASE_URL=http://192.168.1.10:4000/api
```

## Detailed Android and iOS Run/Test Guide

This section is for running and testing the Flutter app on emulators/simulators and real devices.

### 1. Prerequisites

1. Install Flutter SDK.
2. Install Android Studio (Android SDK + emulator tools).
3. Install Xcode (for iOS simulator/device builds on macOS).
4. In project root, install Node dependencies:

```bash
npm install
```

5. In Flutter app folder, install Dart/Flutter packages:

```bash
cd flutter_app
flutter pub get
```

6. Verify toolchains:

```bash
flutter doctor -v
```

Fix any issues reported by `flutter doctor` before continuing.

### 1A. Install Xcode on macOS (Detailed)

1. Open the App Store on your Mac.
2. Search for `Xcode`.
3. Click `Get` then `Install` (download is large, often 10+ GB).
4. After install, open Xcode once and accept the license/initial setup prompts.
5. Install Xcode command-line tools:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

6. Verify toolchain from terminal:

```bash
xcodebuild -version
flutter doctor -v
```

7. Confirm `Xcode` section in `flutter doctor` shows no blocking errors.

### 1B. Install iOS Simulator Runtime in Xcode

1. Open Xcode.
2. Go to `Xcode > Settings > Components` (or `Preferences > Components` on older versions).
3. Download at least one iOS Simulator runtime (for example, latest iOS version).
4. Open Simulator:

```bash
open -a Simulator
```

### 2. Start Backend API (required for mobile testing)

From repo root:

```bash
npm run dev:server
```

Keep this terminal running. Backend should be available at `http://localhost:4000` on your Mac.

### 3. Android Testing

#### Android Emulator

1. Start an emulator in Android Studio (Device Manager) or via CLI.
2. Confirm device is visible:

```bash
flutter devices
```

3. Run app on emulator:

```bash
cd flutter_app
flutter run -d android
```

Android emulator uses `http://10.0.2.2:4000/api` by default in this app.

#### Physical Android Device

1. Enable Developer Options + USB Debugging on device.
2. Connect device by USB and accept debugging prompt.
3. Confirm device:

```bash
flutter devices
```

4. Find your computer's LAN IP (example `192.168.1.10`) and ensure phone + computer are on same network.
5. Run with explicit API base:

```bash
cd flutter_app
flutter run -d <device-id> --dart-define=API_BASE_URL=http://192.168.1.10:4000/api
```

6. If connection fails, allow inbound Node traffic in firewall and verify backend is still running.

### 4. iOS Testing

#### iOS Simulator

1. Start backend first (`npm run dev:server` in repo root).
2. Open Simulator from Xcode (or `open -a Simulator`).
3. In Simulator app, choose a device from `File > Open Simulator` (example: iPhone 15).
4. Confirm simulator appears to Flutter:

```bash
flutter devices
```

5. Run app:

```bash
cd flutter_app
flutter run -d ios
```

iOS simulator uses `http://localhost:4000/api` by default in this app.

6. Test hot reload/hot restart:
   - Press `r` in terminal for hot reload.
   - Press `R` in terminal for hot restart.
7. Stop the run with `Ctrl + C`.

#### Test iOS App Directly from Xcode (Detailed)

Use this flow when you want native iOS debugging, device logs, breakpoints, and signing visibility.

1. Generate iOS Flutter config files (once per dependency change):

```bash
cd flutter_app
flutter pub get
```

2. Open the iOS workspace (not `.xcodeproj`):

```bash
open ios/Runner.xcworkspace
```

3. In Xcode left sidebar, select the `Runner` project.
4. Under `Targets > Runner > Signing & Capabilities`:
   - enable `Automatically manage signing`
   - choose your Apple Team
   - ensure Bundle Identifier is unique
5. Select build destination from top toolbar:
   - simulator (for local testing), or
   - connected iPhone (for real-device testing)
6. Configure run scheme if needed:
   - top menu `Product > Scheme > Edit Scheme`
   - keep Build Configuration as `Debug` for testing
7. Run app from Xcode:
   - click Run button (triangle), or
   - press `Cmd + R`
8. View logs in Xcode debug console:
   - `View > Debug Area > Activate Console`
9. Stop app:
   - click Stop button, or
   - press `Cmd + .`

##### Useful Xcode Testing Tools

1. View device/simulator logs:
   - `Window > Devices and Simulators`
   - select device > `Open Console`
2. Inspect network/API errors:
   - check Flutter logs in debug console
   - verify backend is reachable from device IP
3. Debug UI/thread issues:
   - `Debug Navigator` (left panel) for CPU/memory
4. Clean build if Xcode behaves inconsistently:
   - `Product > Clean Build Folder` (`Shift + Cmd + K`)
   - then run again

##### Common Xcode iOS Failures and Fixes

1. `No signing certificate` / provisioning errors:
   - re-select Apple Team in `Signing & Capabilities`
   - use a unique Bundle Identifier
2. `Module not found` or CocoaPods issues:

```bash
cd flutter_app
flutter clean
flutter pub get
cd ios
pod install
cd ..
```

3. App launches but API calls fail on physical iPhone:
   - run backend on Mac: `npm run dev:server`
   - use LAN API base:

```bash
flutter run -d <device-id> --dart-define=API_BASE_URL=http://192.168.1.10:4000/api
```
   - allow Local Network access on the iPhone when prompted
   - confirm Mac + iPhone are on the same network (Wi-Fi or hotspot)

4. Device does not appear in Xcode:
   - trust computer on iPhone
   - use a data-capable cable
   - update iOS support files by updating Xcode

#### Physical iPhone

Use this section if you want to test on your own iPhone end-to-end.

1. Connect your iPhone to your Mac with a data-capable cable.
2. Unlock iPhone and tap `Trust This Computer` if prompted.
3. On iPhone (iOS 16+), enable Developer Mode:
   - `Settings > Privacy & Security > Developer Mode`
   - turn it on and restart phone
4. On Mac, open iOS workspace:

```bash
open flutter_app/ios/Runner.xcworkspace
```

5. In Xcode, select `Runner` project in left sidebar.
6. Open `Targets > Runner > Signing & Capabilities`.
7. Set a unique Bundle Identifier, for example:
   - `com.yourname.goldencrumb`
8. Choose your Apple Team:
   - if missing, add account in `Xcode > Settings > Accounts`
9. Keep `Automatically manage signing` enabled.
10. In Xcode toolbar, select your connected iPhone as Run destination.
11. Run once from Xcode (`Cmd + R`) to complete first-time signing/install.
12. If phone asks to trust the developer profile:
   - open `Settings > General > VPN & Device Management`
   - trust your developer app profile
13. Keep backend running on Mac:

```bash
npm run dev:server
```

14. In a new terminal, confirm Flutter sees your iPhone:

```bash
flutter devices
```

15. Find your Mac LAN IP and ensure Mac + iPhone are on same network:
   - On Wi-Fi, the IP usually looks like `192.168.x.x`.
   - On iPhone hotspot, the IP usually looks like `172.20.10.x`.
   - Find it with `ipconfig getifaddr en0` (or `networksetup -getinfo Wi-Fi`).
16. Run Flutter app on your iPhone with LAN API base:

```bash
cd flutter_app
flutter run -d <device-id> --dart-define=API_BASE_URL=http://192.168.1.10:4000/api
```

17. On first launch, allow the Local Network prompt (required for iPhone to reach the Mac backend).
18. Validate app behavior on device:
   - scroll through customer page sections
   - add/remove cart items
   - place a test order
   - send a contact message
   - open admin mode and save content updates
19. If app install fails:
   - re-check signing Team + Bundle Identifier in Xcode
   - confirm Developer Mode is enabled
   - re-run once from Xcode, then re-run from Flutter
20. If app opens but API calls fail:
   - Ensure Mac firewall allows Node incoming connections.
   - Verify iPhone can reach `http://<mac-lan-ip>:4000/api/health` on same Wi-Fi.
   - Confirm backend still running on port `4000`.
21. For day-to-day retesting after first setup, you usually only need:
   - `npm run dev:server`
   - `flutter run -d <device-id> --dart-define=API_BASE_URL=http://<mac-lan-ip>:4000/api`

##### iPhone Networking Notes (Beginner)

1. `localhost` on iPhone points to the phone itself. Use your Mac LAN IP instead.
2. iOS requires Local Network permission and HTTP allowance for local dev:
   - Ensure `NSLocalNetworkUsageDescription` and `NSAppTransportSecurity` are present in `ios/Runner/Info.plist`.
3. If you edit `Info.plist`, do a clean rebuild:

```bash
cd flutter_app
flutter clean
flutter pub get
flutter run -d <device-id> --dart-define=API_BASE_URL=http://<mac-lan-ip>:4000/api
```

### 5. Functional Test Checklist (Android/iOS)

After app launches, verify:

1. Home content loads (hero/menu/gallery/testimonials/contact text).
2. Add/remove cart items works.
3. Place order works and returns success message.
4. Contact form submits successfully.
5. Open admin mode, edit content, save, then return to customer view and refresh.

You can inspect backend writes using:

```bash
curl http://localhost:4000/api/orders
```

And Swagger at:

```text
http://localhost:4000/api-docs
```

### 6. Automated Flutter Checks

Run static analysis and tests:

```bash
cd flutter_app
flutter analyze
flutter test
```

Optional release build checks:

```bash
flutter build apk
flutter build ios --no-codesign
```

## Notes

- Vite proxy routes `/api/*` to `http://localhost:4000` in development.
- SQLite DB file is created automatically at `server/data/bakery.db`.
- To use another API base URL, set `VITE_API_BASE_URL`.

## Deployment

### Option 1: Single VM / VPS (recommended for SQLite)

Run frontend and backend on the same machine:

1. Build frontend:

```bash
npm install
npm run build
```

2. Run backend in production:

```bash
npm run start
```

3. Serve `dist/` with Nginx (or any static server), and reverse-proxy `/api` to `http://localhost:4000`.

Why this option:
- SQLite is file-based and works best when backend and DB file stay on one persistent server.

### Option 2: Split Hosting

- Frontend: deploy `dist/` to Vercel/Netlify/Cloudflare Pages.
- Backend: deploy Node API to a server/platform with persistent disk.
- Set frontend env:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

Important:
- If backend URL changes, rebuild frontend with the new `VITE_API_BASE_URL`.
- Do not deploy SQLite DB to ephemeral filesystems.
