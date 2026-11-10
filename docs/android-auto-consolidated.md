# Android Auto / Android Automotive OS Developer Documentation (Consolidated)

## Overview: Android Auto vs. Android Automotive OS

Android Auto and Android Automotive OS (AAOS) are **two different platforms that are frequently confused** but solve different problems. **Android Auto** is a *phone-projection* system: the app itself runs on the user's **phone** (minimum Android 9 / API 28), and a driver-optimized UI is *projected* onto the car's head unit (or a compatible aftermarket stereo) once the phone is connected — developers add car-facing services/manifest declarations to an existing phone app, and Android Auto renders the UI, it does not ship as a separate app. **Android Automotive OS**, by contrast, is a **full, standalone Android operating system built directly into the vehicle** — there is no phone involved, the car itself is the Android-powered device, and the app is installed directly on the car (distributed via Google Play on vehicles with "Google built-in"). The two are not mutually exclusive — a single car can run AAOS and still support Android Auto (e.g., for passengers' or drivers' phones) at the same time — and Google recommends a **single app architecture that targets both**, reusing most code between an Android Auto configuration and a dedicated Android Automotive OS module. This single distinction (phone-projected vs. built-in standalone OS) underlies almost every manifest declaration, API choice, and distribution rule described below, so most topics in this document note how they differ (or are shared) across the two platforms. Comparable conceptually to how Apple CarPlay (phone-projected, analogous to Android Auto) differs from a vehicle's own built-in infotainment stack (analogous to Android Automotive OS), though Apple does not currently ship an AAOS-equivalent built-in third-party app platform.

---

## Platform Overview: Android Auto vs Android Automotive OS

### The core distinction

- **Android Auto** is a *phone-projection* system. The app itself runs on the user's **phone** (requires **Android 9 / API level 28 or higher**), and the driver-optimized UI is *projected* onto the car's head unit display (or a compatible aftermarket stereo) by connecting the phone. You don't ship a separate car app — you add car-facing services/manifest declarations to your existing phone app, and Android Auto renders the UI.
- **Android Automotive OS (AAOS)** is a **full, standalone Android OS built directly into the vehicle**. There is no phone involved — the car itself is an Android-powered device, and your app is installed directly on the car. Vehicles with "Google built-in" run AAOS and ship with Google Play, Gemini, Google Assistant, and Google Maps.
- **These are not mutually exclusive**: a car can run Android Automotive OS *and* also support Android Auto (e.g., for passengers'/drivers' phones) simultaneously.
- Google recommends **one app architecture that works for both** platforms so the same app can reach phone-projected and in-car-installed users.

### Supported app categories, platforms, and publishing tracks

| Category | Built using | Platforms | Driving/Parked | Publishing track |
|---|---|---|---|---|
| Media – audio | `MediaBrowserService` and `MediaSession`; can also use Car App Library templates (Early Access) | Android Auto and Android Automotive OS (media and templated media) | While driving or parked | All track types — **except** Car App Library templated media apps, which can only publish to **Internal Testing** and **Closed Testing** tracks (Early Access Program) |
| Communication – messaging notifications | `MessagingStyle` notifications + a `Service` for reply/mark-as-read | Android Auto | While driving or parked | All track types |
| Communication – templated messaging (labs) | Android for Cars App Library | Android Auto | While driving or parked | **Internal Testing** and **Closed Testing** tracks |
| Communication – calling (labs) | Telecom Jetpack Library + Android for Cars App Library | Android Auto | While driving or parked | **Internal Testing** and **Closed Testing** tracks |
| Navigation | Android for Cars App Library | Android Auto and Android Automotive OS | While driving or parked | All track types |
| Point of Interest (POI) | Android for Cars App Library | Android Auto and Android Automotive OS | While driving or parked | All track types |
| Internet of Things (IoT) | Android for Cars App Library | Android Auto and Android Automotive OS | While driving or parked | All track types |
| Weather | Android for Cars App Library | Android Auto and Android Automotive OS | While driving or parked | All track types |
| **Parked categories** | | | | |
| Video | Views and/or Compose | Android Automotive OS | Primarily parked (limited driving use per "Support audio while driving") | All track types |
| Games | Views and/or Compose | Android Auto and Android Automotive OS | Only while parked | All track types (Games reached GA on both platforms, Sept 2026) |
| Browsers (labs) | Views and/or Compose | Android Automotive OS | Only while parked | **Internal Testing** tracks |

The Media category explicitly excludes video content (handled separately by the Video category).

### How apps declare and target each platform

**Android Auto — manifest declarations (by category):**

- Media, messaging, and templated apps add a `<meta-data>` pointing to a car descriptor resource:
  ```xml
  <meta-data
      android:name="com.google.android.gms.car.application"
      android:resource="@xml/automotive_app_desc"/>
  ```
  The resource content varies by category — Media: `<uses name="media" />`; Messaging: `<uses name="notification" />` (plus `<uses name="sms">` if the app can be the default SMS handler); Templated: `<uses name="template" />`.
- Parked apps instead declare support via an intent-filter `<category>` on an activity:
  ```xml
  <category android:name="android.intent.category.CAR_LAUNCHER" />
  ```
- On **Android 15+**, Android Auto can run activities directly on the head unit while parked (full screen only, limited to supported parked categories), and automatically exits the app when vehicle motion is detected. Intents to apps not declared for Android Auto are blocked (web/Play Store intents fall back to the phone). On Android 15, runtime permission prompts cannot be accepted on the head unit — the user is directed to their phone.
- Detect whether Android Auto is running via the **`CarConnection`** API (part of the Android for Cars App Library). On Android 12+, Android Auto does **not** change the device's `UiModeManager`/`Configuration` UI mode, so don't rely on that signal.
- Apps must be installed from a **trusted source** to run on a real vehicle: **Google Play** or **ONE store**.

**Android Automotive OS — manifest declarations and architecture:**

- Apps must declare the `android.hardware.type.automotive` feature to be distributed to cars via Google Play:
  ```xml
  <uses-feature
      android:name="android.hardware.type.automotive"
      android:required="[true|false]">
  ```
- `<uses-feature>` requirements for `android.hardware.wifi`, `android.hardware.screen.portrait`, `android.hardware.screen.landscape`, and `android.hardware.camera` must be removed or set `required="false"` — otherwise compatible vehicles may be excluded from distribution.
- **Distraction optimization**: activities don't run while UX restrictions are active unless marked:
  ```xml
  <meta-data android:name="distractionOptimized" android:value="true">
  ```
  Only apply this to the `<activity>` declaring `CarAppActivity` for Car App Library apps — applying it elsewhere causes Play Store rejection.
- Detect feature support with `PackageManager::hasSystemFeature`; the Play Console Device Catalog lets you filter by Form factor = Car plus System feature.
- Hardware/software gaps vs. phones: no required back affordance (compatibility mode addresses this); differing system bar size/position (nav bar can be left/right/bottom); OEM-controlled immersive mode; fixed-volume audio; fixed screen orientation (either portrait or landscape — no orientation feature requirement); many devices lack `android.hardware.location.network` (no telephony stack) though coarse location is still supported; `FEATURE_APP_WIDGETS` and `FEATURE_PICTURE_IN_PICTURE` often unavailable; TalkBack, Switch Access, and Voice Access are **not available** (captioning preferences are supported). Supports **Per-application network selection (PANS)**.
- Minimum platform: all vehicles with Google built-in run **Android 9 or higher**.
- UX restrictions (driver-distraction blocking) are OEM-defined and can vary by geography and by display within the same vehicle — reference restriction state directly rather than inferring it.

**Shared integration points (both platforms):**

- `PackageManager` lets you enumerate installed packages and launch them.
- Navigation apps achieve Gemini/Google Assistant interoperability via navigation app intents; Gemini/Assistant can launch any installed app via voice ("Hey Google, open Example app").
- Apps can launch Google Maps built-in navigation via Google Maps for Automotive intents.

### What's new (architecturally relevant)

- **Games** category reached **General Availability** (September 2026) for both Android Auto and Android Automotive OS — any developer can now publish to any Play Store track.
- **Car App Library 1.9** (October 2026 emulator images) brings Media apps built with the Car App Library to Android Automotive OS, plus new browsing experiences; Video app experiences are coming to Android Auto (Early Access Partner interest form open).
- The Communication category (messaging notifications, templated messaging, calling) and Weather were introduced/opened in 2024–2025 updates, consolidating what was previously just "Messaging."
- `<uses-feature>` requirements for Android Automotive OS were simplified (March 2025).

Source: https://developer.android.com/training/cars, https://developer.android.com/training/cars/platforms/android-auto, https://developer.android.com/training/cars/platforms/automotive-os, https://developer.android.com/training/cars/whats-new

---

## Media Apps

### Shared Media Architecture

Media apps for both Android Auto and Android Automotive OS (AAOS) build on the standard Android media app architecture. A media app must conform to this architecture before adding car support. There are two ways to build a media app for cars:

1. Use `MediaBrowserService` (compliant with `MediaBrowserServiceCompat`) or `MediaLibraryService`, together with a `MediaSession`, so Android Auto and AAOS can connect to and render media browsing/playback UIs optimized for in-car use.
2. Use the Car App Library templates to build an app with a customized media browsing and playback experience, including custom actions. Even with this approach, a `MediaSession` plus either a `MediaBrowserService` or `MediaLibraryService` is still required for voice actions and other smart experiences.

Key concepts:

- **Media browser**: API used by media apps to discover media browser services and display content; Android Auto/AAOS use it to find your app's media browser service.
- **Media browser service**: the Android service implemented by your app, complying with `MediaBrowserServiceCompat` (or `MediaLibraryService`), exposing content.
- **Media item**: content is organized as a tree of `MediaItem` objects, flagged `FLAG_PLAYABLE` (a leaf — single sound stream, e.g. a song) and/or `FLAG_BROWSABLE` (a node with descendants, e.g. an album). An item that is both acts like a playlist.

Aside from voice guidance audio for navigation apps, in-app media playback while driving isn't permitted outside this architecture. Google enforces driver-distraction design requirements before a media app can be listed for Android Auto or AAOS.

### Android Auto

Manifest declaration for basic Android Auto media support:

```xml
<application>
    <meta-data android:name="com.google.android.gms.car.application"
        android:resource="@xml/automotive_app_desc"/>
</application>
```

`res/xml/automotive_app_desc.xml`:

```xml
<automotiveApp>
    <uses name="media"/>
</automotiveApp>
```

Android Auto then discovers and interacts with the app's `MediaBrowserServiceCompat`/`MediaLibraryService` and `MediaSessionCompat` using the standard Android media APIs (`onGetRoot`, `onLoadChildren`, content styling via `FLAG_BROWSABLE`/`FLAG_PLAYABLE`). Companion guides cover manifest configuration, playback controls, voice actions, distraction safeguards, and error handling in more depth. Issues can be filed via the Google Issue Tracker (component ID 192643).

### Android Automotive OS (Templated Media)

Templated media apps use Car App Library templates to customize the media browsing/playback experience instead of relying purely on the `MediaBrowser` tree (currently beta — internal/closed testing tracks only). A `MediaSession` + `MediaBrowserService`/`MediaLibraryService` is still required for recommendations and smart experiences.

**Manifest requirements (in addition to standard Car App Library setup):**

- Declare `androidx.car.app.category.MEDIA` in the `CarAppService` intent filter.
- Declare the `androidx.car.app.MEDIA_TEMPLATES` permission (required for `MediaPlaybackTemplate`).
- Set `androidx.car.app.minCarApiLevel` to **8** (required for `MediaPlaybackTemplate`).
- Provide an attribution icon.
- Declare Android Auto support the same way as non-templated apps but add `<uses name="template"/>` alongside `<uses name="media"/>` in `automotive_app_desc.xml`.

**Distribution options**: single APK (set `android.software.car.templates_host.media` to `required="false"`, add a disabled trampoline/launcher activity pointed at via `androidx.car.app.media.CalMediaActivityComponent` meta-data on the `MediaBrowserService`/`MediaLibraryService`, launching `androidx.car.app.activity.CarAppActivity` for Settings/Sign-in screens) or two separate APKs (Car App Library APK sets the feature `required="true"` and ships on the dedicated Automotive OS track with a higher version code). All AAOS vehicles on Android 17+ fully support the Car App Library.

**Key APIs**:

- `MediaPlaybackTemplate` (built via `MediaPlaybackTemplate.Builder()` with a `Header`) shows playback info; controls/media info populate from the app's `MediaSession` state.
- Register the session with `MediaPlaybackManager.registerMediaPlaybackToken()` (via `carContext.getCarService(CarContext.MEDIA_PLAYBACK_SERVICE)`) inside `onCreateSession()` — omitting this errors when a `MediaPlaybackTemplate` is sent to the host. Media3 apps using a `PlatformToken` convert it via `MediaSessionCompat.Token.fromToken(platformToken)` first.
- `SectionedItemTemplate` (combining `GridSection`/`RowSection`) organizes browsable content, optionally nested in a `TabTemplate`; max screen-stack depth of five. Car App Library 1.9 (alpha) adds Chips, Progress Bars, Condensed Items, Interactive/Expanded Headers, Spotlight Sections, Banners (via **Enable CAL Beta Features** dev toggle).
- Quality requirement `MFT-1`: every browsing screen must offer quick navigation to `MediaPlaybackTemplate` (via `Action.MEDIA_PLAYBACK`, or a header action). Apps must also handle the `androidx.car.app.media.action.SHOW_MEDIA_PLAYBACK` intent (`launchMode` `singleTask`/`singleTop`) in `onNewIntent()` to jump to Now Playing.
- Voice: templated apps add an action in the playback template for discovery (quality guideline `VC-1`) rather than updating `MediaBrowserService` search results.

**Key difference from Android Auto's approach**: instead of relying purely on the `MediaBrowser`/`MediaItem` tree for UI, AAOS templated media apps render car-screen UI through Car App Library templates (`MediaPlaybackTemplate`, `SectionedItemTemplate`, `TabTemplate`) while still backing playback with the same `MediaSession`/`MediaBrowserService`/`MediaLibraryService` infrastructure.

Source: https://developer.android.com/training/cars/media, https://developer.android.com/training/cars/media/auto, https://developer.android.com/training/cars/apps/media

---

## Communication Apps

### Overview

Android Auto's communication category covers three related approaches, combinable in a single app:

- **Notification messaging** — baseline, notification-powered short-form text messaging; no car-specific UI needed.
- **Templated messaging** — built with the Car App Library, extends notification messaging to let users browse conversation history (including pre-session messages) via dedicated screens.
- **Calling** — make/receive voice calls, built on the Telecom Jetpack library plus an optional templated UI.

### Notification Messaging

Message history is limited to notifications received during the active Android Auto session; for prior history, use templated messaging. **New and existing messaging apps cannot be directly installed as driver-optimized apps on Android Automotive OS — they can only be distributed through Android Auto.**

**Core classes**: `MessagingStyle.Message` (a message: sender, content, timestamp); `NotificationCompat.MessagingStyle` (a conversation: title, messages, group flag) posted via a `Notification`; reply/mark-as-read attached as `NotificationCompat.Action` objects.

**Flow**: app receives message → builds `MessagingStyle` notification with reply + mark-as-read `Action`s → Android Auto extracts style/actions and displays → tap triggers mark-as-read `Action` (handled in background) → voice reply fills a `RemoteInput` on the reply `Action` (handled in background).

**Manifest**: `com.google.android.gms.car.application` meta-data → `automotive_app_desc.xml` with `<uses name="notification" />` (add `<uses name="sms" />` if the app can be the default SMS handler, else Android Auto's built-in SMS handler causes duplicate notifications). Dependency: AndroidX Core (`androidx.core:core`/`core-ktx`).

**Handling actions**: must be handled by a `Service` (recommend `IntentService`-style pattern — never an `Activity`/`Fragment`, which run foreground and can get the app blocked). Declare: `<service android:name="com.example.MessagingService" />`.

- Build `RemoteInput` via `RemoteInput.Builder(key).build()`; extract reply text with `RemoteInput.getResultsFromIntent(intent)`.
- Wrap intents with `PendingIntent.getService(...)`: reply uses `FLAG_UPDATE_CURRENT or FLAG_MUTABLE` (mutability required so Android Auto can attach `RemoteInput` contents); mark-as-read uses `FLAG_UPDATE_CURRENT or FLAG_IMMUTABLE`. Request codes must be stable per conversation, unique across conversations.
- Reply `Action`: semantic action `Action.SEMANTIC_ACTION_REPLY`, `setShowsUserInterface(false)`, exactly one `RemoteInput` via `addRemoteInput(...)`.
- Mark-as-read `Action`: semantic action `Action.SEMANTIC_ACTION_MARK_AS_READ`, also no UI. Built via `NotificationCompat.Action.Builder(icon, title, pendingIntent)`.

**Building the style**: represent users as `androidx.core.app.Person`; `MessagingStyle(devicePerson)` then `.setConversationTitle(...)`, `.setGroupConversation(recipients.size > 1)`; add messages via `messagingStyle.addMessage(body, timeReceived, senderPerson)`. `MessagingStyle` is also what Android Auto uses for TTS read-aloud.

```kotlin
val notification = NotificationCompat.Builder(context, channel)
    .setSmallIcon(R.drawable.notification_icon)
    .setLargeIcon(appConversation.icon)
    .setStyle(messagingStyle)
    .addAction(replyAction)
    .addInvisibleAction(markAsReadAction)
    .build()
NotificationManagerCompat.from(context).notify(appConversation.id, notification)
```

### Templated Messaging

Beta — Internal/Closed Testing tracks only (rejected on Open Testing/Production). Apps must still implement notification-powered messaging alongside this.

**Manifest**: declare `androidx.car.app.category.MESSAGING` in the `CarAppService` intent filter (combine with `androidx.car.app.category.CALLING` if also supporting calling); set `androidx.car.app.minCarApiLevel` to **7** (required for `ConversationItem`); in `automotive_app_desc.xml` declare both `<uses name="notification" />` and `<uses name="template" />`; same SMS caveat as above.

**Displaying conversations**: `androidx.car.app.messaging.model.ConversationItem` objects in an `ItemList`, shown via `ListTemplate` or `SectionedItemTemplate`. Recommend 5–10 recent conversations, ≤5 recent messages each.

Key shapes: `CarMessage.Builder().setSender(...).setBody(...).setReceivedTimeEpochMillis(...).setRead(...).build()`; `ConversationItem.Builder(id, CarText.create(title), Person, carMessages, conversationCallback).build()`; `Header.Builder().setStartHeaderAction(Action.APP_ICON).setTitle(...).build()`; `ListTemplate.Builder().setHeader(header).setSingleList(itemListBuilder.build()).build()`.

Each `ConversationItem` auto-surfaces play/mark-as-read/reply actions handled via the supplied `ConversationCallbackDelegate` (reuse existing notification-messaging logic). If conversation shortcuts exist, the `ConversationItem` ID must match the shortcut's conversation ID.

**Updating**: call `Screen.invalidate()` as new messages arrive (keep refresh <~500ms or show a loading state); lower notification priority to `IMPORTANCE_DEFAULT` or lower while a conversation screen is actively viewed, to suppress heads-up notifications.

### Calling

Beta — Internal/Closed Testing tracks only. Combines the **Telecom Jetpack library** (required integration, used at all times, not just when Android Auto is active — including "Remote surface support" callbacks for answering/controlling calls) with an optional templated UI (contact lists, agenda, call log) built with the Car App Library. During an active call, Android Auto shows its own in-call view (powered by the telecom integration), replacing the app's templated screens.

**Manifest**: declare `androidx.car.app.category.CALLING` in the `CarAppService` intent filter (combine with `androidx.car.app.category.MESSAGING` if also supporting messaging).

Source: https://developer.android.com/training/cars/communication, https://developer.android.com/training/cars/communication/notification-messaging, https://developer.android.com/training/cars/communication/templated-messaging, https://developer.android.com/training/cars/communication/calling

---

## Templated Apps / Car App Library (androidx.car.app)

### Core Concepts

The **Android for Cars App Library** (`androidx.car.app`) is the shared templated-UI framework behind navigation, POI, IoT, weather, templated messaging, and templated media apps. It ships as:

- `androidx.car.app:app` — core library
- `androidx.car.app:app-projected` — Android Auto–specific functionality
- `androidx.car.app:app-automotive` — Android Automotive OS–specific functionality (includes `CarAppActivity`)
- `androidx.car.app:app-testing` — testing support

**Entry point and session/screen model:**

- **`CarAppService`** — the service the app declares as the host's entry point; the host checks declared support before binding. `CarAppService.createHostValidator()` validates that an incoming connection is from a trusted host. Newer versions add `onGetAppTheme` (paired with `CarAppThemeSource`) and `requestPermissions`.
- **`Session`** — represents a session with the host; override `onCreateScreen(Intent): Screen` for the initial screen and `onNewIntent(Intent)` for intents while already running:
  ```kotlin
  class MySession : Session() {
      override fun onCreateScreen(intent: Intent): Screen = MyStartScreen(carContext)
      override fun onNewIntent(intent: Intent) { /* handle intent */ }
  }
  ```
- **`Screen`** — the screen/navigation-stack abstraction; provides a `Template` via `onGetTemplate()`; call `Screen.invalidate()` to force the host to re-call `onGetTemplate()`.
- **`ScreenManager`** — manages the back stack of `Screen`s (e.g. to pre-seed a stack when handling an intent); exposes `getStackSize` and a copy of the current stack.
- **`CarContext`** — the car-specific context passed to screens/sessions; exposes `getHostInfo()`, `requestPermissions`, and `getCarService(...)` for car services like `NavigationManager`, `AppManager`, `CarHardwareManager`.

**Template subclasses named in the source**: `GridTemplate`, `ListTemplate`, `NavigationTemplate`, `MessageTemplate`, `LongMessageTemplate`, `PaneTemplate`, `SignInTemplate`, `TabTemplate`, `MapTemplate` (deprecated), `PlaceListNavigationTemplate` (deprecated), `RoutePreviewNavigationTemplate` (deprecated), `PlaceListMapTemplate`, `MapWithContentTemplate` (current replacement for the deprecated map templates — supports List/Grid/Pane/Message content alongside a map), `SectionedItemTemplate`, `MediaPlaybackTemplate`.

**Supporting model/UI classes**: `Row`, `GridItem` (with `Badge`, `ItemImageShape`, `ItemSize`), `Action`/`ActionStrip` (map strips support up to 4 actions), `CarIcon` (incl. `createTintedIcon`), `CarColor`, `CarIconSpan`, `Toggle`, `Header`/`MapController`, `ConversationItem`/`CarMessage`, `TravelEstimate`, `Alert`, `Trip`, `SuggestionManager`, `CarAudioRecord`, `CarHardwareManager`/`CarInfo`/`CarSensors`/`Mileage`/`Speed`, `CarNotificationManager`/`CarAppExtender`, `ConstraintManager`/`ActionsConstraints`, `CarConnection`, `PinSignInMethod`/`ProviderSignInMethod`/`QRCodeSignInMethod`/`InputSignInMethod`/`InputCallback`.

`CarAppApiLevel` gates feature availability per host version (levels 2–9 referenced); declared via manifest metadata `androidx.car.api.minCarApiLevel`.

**Manifest essentials**: both targets require a `<meta-data>` pointing to an `automotive_app_desc.xml` declaring the `template` capability:
```xml
<automotiveApp>
    <uses name="template" />
</automotiveApp>
```

### Android Auto Target

```xml
<application>
    <meta-data
        android:name="com.google.android.gms.car.application"
        android:resource="@xml/automotive_app_desc"/>
</application>
```
with `automotive_app_desc.xml` declaring `<uses name="template" />`. `androidx.car.app:app-projected` supplies Android Auto–specific functionality; the source names no further Android Auto–specific template restrictions beyond this manifest declaration.

### Android Automotive OS Target

Reuses almost all Android Auto code/resources but must build and distribute as a **separate** app module targeting a dedicated Automotive OS Play Store track (a single artifact cannot serve both mobile/Auto and Automotive OS). Requires the "Google Automotive App Host" system app (latest Templates Host).

1. **Automotive module**: Minimum SDK **API 29** (all Car-App-Library-capable AAOS devices run 29+). Scaffold declares `<uses-feature android:name="android.hardware.type.automotive" android:required="true" />`. `CarAppActivity`'s theme must be `@android:style/Theme.DeviceDefault.NoActionBar`.
2. **Feature requirement**: `<uses-feature android:name="android.software.car.templates_host" android:required="true" />` (media apps use `android.software.car.templates_host.media` instead).
3. **Gradle**: add `androidx.car.app:app-automotive:<version>` (provides `CarAppActivity`); share the `CarAppService` module with the mobile/Auto target if applicable.
4. **Declare Automotive OS support**: `<meta-data android:name="com.android.automotive" android:resource="@xml/automotive_app_desc"/>` — do **not** include the `com.google.android.gms.car.application` attribute (Android Auto–only).
5. **Declare `CarAppService` + `CarAppActivity`** — `CarAppActivity` (from `app-automotive`) is the single launcher entry point:
   ```xml
   <activity
       android:exported="true"
       android:theme="@android:style/Theme.DeviceDefault.NoActionBar"
       android:name="androidx.car.app.activity.CarAppActivity"
       android:launchMode="singleTask"
       android:label="Your app name">
       <intent-filter>
           <action android:name="android.intent.action.MAIN" />
           <category android:name="android.intent.category.LAUNCHER" />
       </intent-filter>
       <meta-data android:name="distractionOptimized" android:value="true" />
   </activity>
   ```
   Navigation apps additionally need `android.intent.category.APP_MAPS` plus an `androidx.car.app.action.NAVIGATE` intent filter with a `geo` scheme. `distractionOptimized` is honored only when installed from a trusted source (e.g. Google Play) or on a `userdebug` system image.

**Deep links**: add intent filters to `CarAppActivity`; handle in `Session.onCreateScreen()` (first start) / `onNewIntent()` (already running), optionally pre-seeding the `ScreenManager` stack.

Other notes: package-name choice (shared vs. separate) affects store listing/review/metrics; offline support recommended; no special third-party SDK restrictions beyond standard quality requirements; publish via the dedicated Automotive OS track; if reinstall fails after uninstall, use `adb uninstall app.package.name`.

### Release Notes Highlights

Current (source snapshot): Stable **1.7.0**, RC **1.8.0-rc01**, Alpha **1.9.0-alpha03**.

- **1.0.0** — Initial stable (Android Auto 6.1+). `GridTemplate`, `CarAppService.createHostValidator()`, `CarAppExtender.Builder.setColor`.
- **1.1.0** — `SignInTemplate`, `LongMessageTemplate`, map interactivity in `NavigationTemplate`, multi-length text, `CarHardwareManager`, `CarNotificationManager`, `ConstraintManager`, `CarConnection` (renamed from `ConnectionToCar`), pan-mode `Action` type; `androidx.car.api.minCarApiLevel` introduced.
- **1.2.0** — Automotive OS apps publishable to Play open testing; `CarSensors` additions.
- **1.3.0** — `MapTemplate`, `CarAudioRecord`, `SuggestionManager`, `Alert` API, `Header`/`MapController`, `androidx.car.app.category.POI` (deprecating `PARKING`/`CHARGING`).
- **1.4.0** — `TabTemplate`, instrument cluster map rendering, adaptive task limits, secondary `Row` actions, experimental `SectionedItemTemplate`, `Badge` on `GridItem`.
- **1.7.0** — `MapWithContentTemplate` (deprecating `MapTemplate`, `RoutePreviewNavigationTemplate`, `PlaceListNavigationTemplate`); `ConversationItem`; vehicle dimensions API; `CarAppApiLevel` 8; CVE-2024-10382 fix; default `minSdk` raised 21→23.
- **1.8.0** — `SectionedItemTemplate` GA; enhanced media playback, `IMAGE_TYPE_MEDIUM`, `ACTION_MEDIA_SHOW_PLAYBACK_VIEW` intent.
- **1.9.0 (alpha)** — Spotlight Section, Condensed Items, Chips, Minimized Control Panel, Banners, Section Header, Expanded Header Layout; `CarAppThemeSource`/`CarAppService.onGetAppTheme`; `SearchHeader`; `TabStyle`/`BannerStyle`/`MediaPlaybackStyle`; `CarAppApiLevel` 9; `NavigationManager.setVoiceAssistantCapabilities`; `TabTemplate` global end action; `CarIcon.createTintedIcon`.

Source: https://developer.android.com/training/cars/apps, https://developer.android.com/training/cars/apps/library, https://developer.android.com/training/cars/apps/auto, https://developer.android.com/training/cars/apps/automotive-os, https://developer.android.com/jetpack/androidx/releases/car-app

---

## App Types: Navigation, Point of Interest, IoT, and Weather

### Navigation Apps

**Manifest**: declare `androidx.car.app.category.NAVIGATION` in the `CarAppService` intent filter; declare the `androidx.car.app.NAVIGATION_TEMPLATES` permission (required for `NavigationTemplate` and the deprecated map templates — only navigation apps should declare it; POI apps use `MAP_TEMPLATES` instead). AAOS navigation apps need additional manifest declarations beyond Android Auto's.

**Navigation intents**: support via intent filters — Android Auto: on the `<activity>` handling the intent outside Android Auto; AAOS: on the `CarAppActivity` `<activity>` element. Handle in both `onCreateScreen()` and `onNewIntent()`. Required for quality guideline `NF-6`; optionally also support search and custom-action intents. The "default navigation car app" on Android Auto is the last navigation app launched, receiving Assistant/other-app navigation intents.

**Templates**: `NavigationTemplate` (message + travel estimates during active nav); `MapWithContentTemplate` (map tiles + overlay content — current replacement, since CAL 7, for deprecated `MapTemplate`/`PlaceListNavigationTemplate`/`RoutePreviewNavigationTemplate`). Migration: replace `.setPane()`/`.setItemList()` + `.setMapActionStrip()` with `MapWithContentTemplate.Builder().setContentTemplate(...)` and move map actions into `.setMapController(MapController.Builder().setMapActionStrip(mapActionStrip).build())`.

**`NavigationManager`** (via `carContext.getCarService(NavigationManager::class.java)`):
- `navigationStarted` — call when user starts navigating (lets host manage multiple nav apps, notifications, cluster data).
- `navigationEnded` — call only on actual finish (arrival/cancel); for mid-trip recalculation use `Trip.Builder.setLoading(true)` instead.
- `updateTrip` — pushes trip info to cluster/HUD (not all fields shown on every vehicle, e.g. DHU shows `Step` but not `Destination`).
- `setNavigationManagerCallback` — registers `NavigationManagerCallback`; host calls `onStopNavigation` to request the app stop navigation.
- `NavigationManagerCallback.onAutoDriveEnabled` — must be implemented for Play submission (simulate navigation on auto-drive; exit at `Lifecycle.Event.ON_DESTROY`). Test: `adb shell dumpsys activity service <CarAppServiceName> AUTO_DRIVE`.

**Turn-by-turn data classes**: `Step`, `Destination`, `TravelEstimate`, `Trip`, `Maneuver`. `TravelEstimate.Builder` supports `setTripIcon`/`setTripText` for custom display alongside/instead of ETA/time/distance.

**Cluster display** (Car App API Level 6+): no input controls; only `NavigationTemplate` supported, guaranteed element is map tiles (`NF-9`). Declare `androidx.car.app.category.FEATURE_CLUSTER` alongside `NAVIGATION`. `CarAppService.onCreateSession` receives `SessionInfo` (`SessionInfo.DISPLAY_TYPE_CLUSTER` vs. main) to return separate `Session`s per display; `ScreenManager`/`Screen.invalidate()` only affect their own `Session` — cross-session needs app-level channels. App gains cluster control (by convention) after `navigationStarted`; must render an idle state otherwise. Testable via DHU or AAOS generic images API 30+.

**TBT notifications**: mark `setOngoing`, category `Notification.CATEGORY_NAVIGATION`, extend with `CarAppExtender` (`IMPORTANCE_HIGH` via `setImportance` shows a HUN; otherwise only the rail widget updates); `setOnlyAlertOnce(true)` limits HUN alerting; suppressed while app actively shows routing info on-screen.

**List refresh** (`PlaceListNavigationTemplate`): implement `OnContentRefreshListener.onContentRefreshRequested`, set via `.setOnContentRefreshListener`; call `Screen.invalidate()` inside — same-type refresh doesn't count against template quota.

**Audio guidance**: request audio focus with `AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE` and `AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK`.

**In-context `Alert`**: only available within `NavigationTemplate` (use a HUN elsewhere); built via `Alert.Builder(alertId, title, durationMillis)` + `.addAction()`/`.setSubtitle()`/`.setIcon()`/`.setCallback()`; recommended duration 10s; shown/dismissed via `carContext.getCarService(AppManager::class.java).showAlert(alert)` / `.dismissAlert(alert.id)`.

### Point of Interest (POI) Apps

**Manifest**: declare `androidx.car.app.category.POI` (as of CAL 1.3, replaces deprecated `PARKING`/`CHARGING`). Declare `androidx.car.app.MAP_TEMPLATES` permission for `PlaceListMapTemplate` (host-rendered map + POI list; restricted to apps declaring `POI`/`PARKING`/`CHARGING`) and `MapWithContentTemplate`.

**List refresh**: same pattern as navigation — `OnContentRefreshListener` set via `PlaceListMapTemplate.Builder.setOnContentRefreshListener`, calling `invalidate()` inside the callback.

**Voice**: POI apps can be voice-enabled via Gemini/Google Assistant App Actions (e.g., "find nearby charging stations").

### IoT Apps

**Manifest**: declare `androidx.car.app.category.IOT`.

**Pattern**: `GridTemplate` is the recommended template for device lists; each device is a `GridItem` (title, `CarIcon`, `setOnClickListener`); unknown status shown via `GridItem.Builder.setLoading(true)`, then `invalidate()` once resolved. Example: a "Garage door" `GridItem` with a click listener plus a "Garage lights" item showing a loading state. Reviewed against car app quality guidelines for IOT apps.

### Weather Apps

**Manifest**: declare `androidx.car.app.category.WEATHER` (combine with `NAVIGATION` if the app also navigates).

**Map rendering**: `MapWithContentTemplate` requires either `androidx.car.app.MAP_TEMPLATES` (no navigation) or `androidx.car.app.NAVIGATION_TEMPLATES` (has navigation) — declaring **both** is disallowed and causes review rejection. Reviewed against weather-specific quality guidelines governing map content.

Source: https://developer.android.com/training/cars/apps/navigation, https://developer.android.com/training/cars/apps/poi, https://developer.android.com/training/cars/apps/iot, https://developer.android.com/training/cars/apps/weather

---

## Parked Apps

### What "Parked" Means

Three parked app categories exist, usable only while the vehicle isn't in motion: Video (AAOS), Games (Android Auto + AAOS), Browsers (AAOS). An Android skill to adapt existing apps is installable via `android skills add android-for-cars-parked-apps`.

Driver distraction is enforced by preventing app use/audio while UX restrictions are active (quality guidelines `DD-2`/`DD-3`; video apps are the exception, able to support audio while driving on supported devices). By default, activities cannot run while UX restrictions are active — keep this default by **not** adding a `distractionOptimized` `<meta-data>` to any `<activity>`. If Resumed when restrictions activate, the activity is obscured by an OS-owned activity and transitions at minimum to Paused (pause audio/video here); on AAOS compatibility mode it transitions through Paused to Stopped.

Apps can observe UX restriction state via `android.car` (`useLibrary("android.car")`) and `CarUxRestrictionsManager`:
```kotlin
val car = Car.createCar(context) ?: return
val mgr = car.getCarManager(Car.CAR_UX_RESTRICTION_SERVICE) as? CarUxRestrictionsManager ?: return
val current = mgr.currentCarUxRestrictions
mgr.registerListener { restrictions -> /* handle */ }
mgr.unregisterListener(); car.disconnect()
```
Only `isRequiresDistractionOptimization()` is relevant for non-distraction-optimized apps. Don't infer restriction state from raw gear/speed signals — it can vary by display. Google Play filters distribution to exclude devices lacking necessary OEM fixes.

### Android Auto Support

On **Android 15+**, Android Auto runs supported parked-category apps directly on the head unit. Declare via `android.intent.category.CAR_LAUNCHER` in an activity's intent filter (can share a filter with `LAUNCHER` or use a separate one). **Games is currently the only parked category Android Auto supports.**

Apps must adapt to common screen sizes and not be significantly pillarboxed in landscape (`DO-2`). DHU test configs: Small Landscape (800x480, dpi160), Wide Landscape (1920x1080, dpi160, marginheight 596), Portrait (1920x1080, dpi160, marginwidth 878).

Detection: combine `CarConnection` state `CONNECTION_TYPE_PROJECTION` with a non-default `displayId` (not always fully accurate).

### Android Automotive OS Support

Requires manifest entries plus Play review for car safety on opt-in. Video/games add category-specific `android:appCategory` values. Test first on the AAOS emulator for fixed-orientation issues (must support both portrait and landscape) and unavailable Play services APIs. Same UX-restriction enforcement model as above.

Other considerations: system bars may sit left/right/bottom, no gesture nav, back affordance not guaranteed (`AN-1` requires navigability without one); OEMs control immersive mode/system bar color (calls may be silently ignored); use `windowLayoutInDisplayCutoutMode` = `LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER`/`_ALWAYS` (not `_DEFAULT`/`_SHORT_EDGES`) for cutouts; detect via `PackageManager.hasSystemFeature(FEATURE_AUTOMOTIVE)` or `CarConnection`; handle offline gracefully; use the `car` resource qualifier (matches `UiModeManager.getCurrentModeType() == UI_MODE_TYPE_CAR`) for alternate resources (e.g. larger touch targets).

### Video Apps

Coming to Android Auto in beta (early access); otherwise targets AAOS. Declare `android:appCategory="video"` on `<application>`.

**Audio while driving** (beta, early access): declare `<uses-feature android:name="com.android.car.background_audio_while_driving" android:required="false" />`. Requires background playback (Media3 `MediaSessionService`, posting a `MediaStyle` notification including the `MediaSession` — handled by default with `MediaSessionService`); without it, playback is cut off once the process is cached. Check device support at runtime via `CarFeatures.isFeatureEnabled(context, CarFeatures.FEATURE_BACKGROUND_AUDIO_WHILE_DRIVING)` (from `androidx.car.app:app`). On unsupported devices the app must still pause per `DD-2`. Widevine DRM L3 is supported on AAOS.

### Games

Reviewed against game-specific quality guidelines (except on internal testing). Declare `android:appCategory="game"`. Target aspect ratios: Android Auto — 16:9 landscape, 9:16 portrait; AAOS — 4:3 landscape, 10:16 portrait. Optional gamepad support: `<uses-feature android:name="android.hardware.gamepad" android:required="false"/>` (never `true`). On Android Auto, games run on the phone and require **Android 15 (API 35)+**; on AAOS, follow the CDD's Automotive Requirements for the supported Android version.

### Browsers

Beta — internal testing tracks only (closed/open/production to follow; early access path available). Reviewed against browser-specific quality guidelines. Declare via an exported `<activity>` intent filter with category `android.intent.category.APP_BROWSER`.

Because AAOS vehicles are often shared devices: must not save/allow access to passwords or payment info unless blockable via profile lock (`SD-1`), and must prompt authentication + notify before syncing sensitive data (`SD-2`). Check device credential via `KeyguardManager::isDeviceSecure()`; prompt setup via `Settings.ACTION_SECURITY_SETTINGS`; prompt authentication via `BiometricPrompt` using only the `DEVICE_CREDENTIAL` authenticator (AAOS Google-built-in vehicles have no biometric sensors).

Source: https://developer.android.com/training/cars/parked, https://developer.android.com/training/cars/parked/auto, https://developer.android.com/training/cars/parked/automotive-os, https://developer.android.com/training/cars/parked/video, https://developer.android.com/training/cars/parked/games, https://developer.android.com/training/cars/parked/browser

---

## Codelab: Building a Parked App (Summary)

Migrates an existing mobile video-streaming app ("Road Reels") into a Tier-1 "car differentiated" AAOS parked app, using Jetpack Compose, Media3, and the AAOS emulator. Covers the Car quality tiers: Tier 3 (Car ready, unmodified large-screen app), Tier 2 (Car optimized), Tier 1 (Car differentiated, adapts to driving/parked modes).

Key steps:

1. **Manifest**: `<uses-feature android:name="android.hardware.type.automotive" android:required="false">` (targets mobile and automotive from one APK) plus `android:appCategory="video"` on `<application>`.
2. **Navigation affordances (`AN-1`)**: no hardware back button on AAOS — add explicit back/close controls (e.g. `IconButton` with `Icons.AutoMirrored.Filled.ArrowBack`), wired via callbacks through the composable hierarchy.
3. **Orientation**: check `PackageManager.FEATURE_SCREEN_LANDSCAPE`/`FEATURE_SCREEN_PORTRAIT` before forcing `ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE`.
4. **Controllable system bars**: use `WindowInsetsControllerCompat.OnControllableInsetsChangedListener` + a `compositionLocalOf` (`LocalControllableInsets`) to only hide/pad insets that are actually controllable.
5. **Driver distraction (`DD-2`)**: pause playback on UX restriction via `LifecycleEventEffect(ON_PAUSE/ON_RESUME)`, later refined to `ON_START`/`ON_STOP` once using `CarUxRestrictionsManager`.
6. **Distant Display**: test on the "Automotive Distant Display" emulator image; add `android:configChanges="screenSize|smallestScreenSize|orientation|screenLayout|density"` to avoid restarts on display-size transitions.
7. **Media session**: add `androidx.media3:media3-session`; create `MediaSession.Builder(application, player).build()` in the ViewModel (test via `adb shell cmd media_session dispatch play|pause|play-pause`); release in `onCleared()`.
8. **Constrain playback via Car UX Restrictions API**: requires `useLibrary("android.car")`. Wrap the player in a `ForwardingSimpleBasePlayer` using `Car.createCar()` → `CarUxRestrictionsManager` to check `CarUxRestrictions.isRequiresDistractionOptimization` and force-pause/disable `COMMAND_PLAY_PAUSE`, gated behind `FEATURE_AUTOMOTIVE` so mobile is unaffected.
9. **Display cutouts/insets**: test with `adb shell cmd overlay enable/disable --user 0 com.android.systemui.rro.left` and `...com.android.internal.display.cutout.emulation.top_and_right`; opt into cutout rendering via `windowLayoutInDisplayCutoutMode = 3` (`LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS`) in a `values-car-v30` resource; fix layout with `WindowInsets.safeDrawing`/`displayCutout`, `windowInsetsPadding`, `windowInsetsStartWidth/EndWidth/BottomHeight`, `Scaffold(contentWindowInsets = WindowInsets(0.dp))`.

Gotchas: always gate car-only APIs behind `FEATURE_AUTOMOTIVE`; use `required="false"` for dual mobile/automotive distribution; never assume a back button, hideable system bars, or stable orientation/display size exist.

Source: https://developer.android.com/codelabs/build-a-parked-app

---

## Testing

### Emulator and Test Tools

- **Desktop Head Unit (DHU)** — run/validate Android Auto apps on desktop; used to check every Android Auto car app quality checklist item.
- **Android Automotive OS emulator** — via the standard Android Emulator; validates AAOS checklist items.
- **AAOS on Pixel Tablet** — install AAOS on a Pixel Tablet; some images double as an Android Auto receiver.
- **Firebase Test Lab** — access real AAOS device hardware.
- **Google Services interoperability testing** — test Gemini/Assistant and Google Maps interop with custom apps on AAOS.
- **Media Controller Test app** (github.com/googlesamples/android-media-controller) — verify `MediaSession` implementations.

**Creating an AAOS AVD**: SDK Manager → add system image(s) → AVD Manager → Create Virtual Device → Category "Automotive" → pick hardware profile → pick an Automotive system image → name/finish → run.

**System images**: generic images span API 28–35-ext15, include Google Play services + Google Automotive App Host (host only API 29+ on the API 28 image); API 34-ext9+ adds Compatibility mode + Audio while driving; API 35-ext15 adds Templated media apps + Car App Library 1.9. OEM-specific images exist for GM, Honda, Mazda, Polestar, Renault Group, Volvo. Custom hardware profiles (device type "Android Automotive") only pair with no-Play-Store images. Bundled profiles: Automotive 1024p/1080p/1408p landscape (1408p recommended for API 34 images, with/without Play), Automotive Portrait, Large Portrait, Ultrawide, Distant Display (with/without Play).

**Extended emulator controls**: *Car data* — set vehicle properties (`VehiclePropertyIds`, e.g. `PERF_VEHICLE_SPEED`) over the VHAL (prefer `CarHardwareManager` for a uniform cross-platform API); *Simulate driving* — nonzero speed + Gear ≠ P; P = parked (use a no-Play-Store image to properly trigger distraction-optimized blocking, since Play-Store images only enforce it for Play-installed apps); *Car rotary* — tests rotary controller support (shares focus APIs with keyboard nav).

**Media app run config**: ensure no launch activity in the manifest; Run → Edit Configurations → automotive module → Launch Options → Launch: Nothing.

**Real hardware vs. emulator**: install from a trusted source (Google Play, via Internal App Sharing or an Internal Test track) to avoid full review; exception — Android Auto has a developer option allowing untrusted-source installs for media, messaging-notification, and parked apps (not Car App Library apps).

**Enable Android Auto developer mode**: Settings → Apps & notifications → See all apps → Android Auto → Advanced → Additional settings in the app (Android 10+) or in-app Settings (Android 9-) → About → tap Version 10× → OK.

**Media testing**: verify `MediaBrowserService` startup before any Activity opens, with no Activity showable, and when signed out (force-stop/launch and clear-data/launch); set appropriate error messages. Emulator issues: Google Issue Tracker component 1635829.

Source: https://developer.android.com/training/cars/testing, https://developer.android.com/training/cars/testing/emulator

---

## Distribution and Quality Guidelines

### Google Play Distribution Requirements

All car apps must meet the car app quality guidelines for their category (Play Console upload + store listing with Android Auto/AAOS screenshots/metadata required).

**Package name**: reuse the mobile app's package name for AAOS (recommended) — simplifies listings/adaptive single-bundle updates; a dedicated AAOS track still allows independent releases.

**`android.hardware.type.automotive` `required` rules**: Parked apps on the mobile track must set `"false"`; parked apps on an AAOS-only track may be `"true"`, `"false"`, or unset; media/templated apps on an AAOS-only track must be `"true"` or unset. Media, templated, and communication apps must also declare `com.google.android.gms.car.application`.

**Opt-in** (Play Console → Advanced Settings → Form factors): Android Auto — add the form factor, release a build to a testing track; AAOS — add the form factor, supply AAOS screenshots (`EP-4`: ≥2 portrait 800x1280 + ≥2 landscape 1024x786, generic-image-based, no OEM references), release to a testing track, accept the AAOS review policy, choose a track type.

**Track types for AAOS**: Parked apps → Mobile or Android-Automotive-OS-only; Media and templated apps → Android-Automotive-OS-only.

**Review impact by track**: Internal sharing / Internal testing → none; Closed testing → non-blocking; Open testing / Production → blocking. Results emailed to the developer account; rejected artifacts must be removed before resubmission.

**Reviewability**: submit test-account sign-in details via Play Console "App Access" if required; POI booking apps must allow free test bookings; navigation/POI apps unavailable in the US must permit reviewer mock-GPS testing.

Source: https://developer.android.com/training/cars/distribute

### Car-Ready Mobile Apps Program

Distributes eligible **video, games, and browsers** mobile apps to cars with minimal extra work — downloadable on Play for AAOS "Google built-in" vehicles since February 2025 (Android Auto support planned later).

**Eligibility**: meets all **Car ready** (Tier 3) guidelines for its category; gaps (e.g. `AN-1`) may still pass under **compatibility mode**, the mode used for this program's apps. Common blockers: unmet Play feature requirements, or dependence on a Play-services API unavailable on cars with Google built-in.

**Testing**: generic system images with compatibility mode most closely mirror program behavior.

**Participation**: invite-only (nominate via interest form); unselected apps can still distribute as parked apps. Selected apps notified via Play Console Inbox/contact email; auto-opted-in after a notification window unless the developer opts out (opt-out form during the window, or later via Advanced Settings).

**Analytics**: Play Console "Car" form-factor filter on Reach/Statistics/Ratings pages; on-device detection via `hasSystemFeature(FEATURE_AUTOMOTIVE)`.

**Key fact**: apps distributed this way are **not usable while driving** — the OS hides/stops them once driving begins. Opting out leaves the app installed but un-updated and undiscoverable for new installs.

Source: https://developer.android.com/training/cars/car-ready-mobile-apps

### Quality Guidelines

Organized into **Car quality tiers** (each builds on the one below) plus Adaptive app quality guideline criteria. Validate using the AAOS emulator and the Android Auto DHU. Categories: Media, Media (templated), Communication (notification messaging, templated messaging, calling), Navigation, POI, IOT, Weather, Video, Games, Browsers.

**Tier 3 — Car ready** (required for all parked categories; also the bar for the Car-ready mobile apps program): `PC-1` no out-of-scope features; `EP-1` app matches its listing; `EP-2` restores state after relaunch; `EP-3` games are responsive/non-freezing; `EP-4` AAOS screenshots in the store listing; `DO-1` fixed-orientation support (AAOS); `DO-2` not pillarboxed in Android Auto landscape; `AR-1` UI not obstructed by system bars/cutouts; `DD-3` video/games/browsers not usable/audible while driving; `IN-2` no heads-up notifications; `AN-1` no dead ends; `SD-1`/`SD-2` browser password/payment-data protections.

**Tier 2 — Car optimized** (required for driving-capable categories): `PE-1` AAOS — no own-activity functionality beyond setup/settings/sign-in while parked; `SA-1` no animated elements (parked-canvas exception); `AD-1` no text ads beyond name; `IU-1` restricted image use; `VI-1` phone-glance warning (Android Auto); `AC-1` ≤5 screens per task; `ST-1` no auto-scrolling text; `VD-1`–`VD-3` icon/color contrast rules; `TH-1` light/dark theme support for CAL 1.9+ custom theming; `GB-1` disabled elements must be nonfunctional; `DD-1` navigation audio channel reserved for nav apps; `DD-2` video/games/browsers pause/stop on driving start; `PA-1` simple purchase flows only (no payment setup, multi-item, or recurring commitments); `NA-1`/`IN-1` notification ad/relevance rules; `MA-1` no autoplay without user action; `MC-1` media-session integration for video; `MF-1`–`MF-5` messaging grouping/order/reply/short-form/peer-to-peer rules; `NF-1`–`NF-7` turn-by-turn, map-only template surface, cluster updates, guidance suppression, cross-app nav requests, test-drive mode; `PF-1` meaningful POI functionality; `IT-1` IoT driving-allowed vs. disallowed actions; `WE-1`–`WE-5` weather map/legend/icon/annotation limits; `MR-1` light/dark map themes; `DL-1` AAOS deep links (video/games/browsers); `MFT-1`/`MFT-3` media-playback-template navigation/intent handling; `VC-1` Assistant/Gemini voice support; `DR-1`–`DR-3` 2s button response / 10s launch / 10s content load.

**Tier 1 — Car differentiated**: `NF-9` cluster rendering (map tiles only); `TMF-1` templated-messaging conversation accuracy; `CF-1`–`CF-3` calling init/accept/decline, in-call info, pre-connection call continuity; `DL-2` AAOS deep links (media/nav/POI/IOT/weather); `DD-4` video audio-while-driving on capable devices (else meet `DD-2`); `AR-2` cutout-aware rendering; `MFT-2` differentiated template experience beyond basic browse/playback; `UX-1`–`UX-3` 64dp touch targets, 24dp spacing/edge margin, 24sp fonts.

**Review/policy**: car-app distribution undergoes an additional manual review beyond standard Play review; non-compliant apps are emailed via the Play Console account; updates are blocked until the car-app review is approved — do not use the production APK for Android Auto prototyping, use a separate release.

Source: https://developer.android.com/docs/quality-guidelines/car-app-quality

---

## Design Guidelines (Design for Driving)

### General Car UI Principles

Google's "Design for Driving" guidance spans both **Android Auto** (phone-based, projected) and **Android Automotive OS** (built directly into the vehicle), covering interaction design, visual design, style foundations, plus system-level guidance (dialer, media templates, notifications, calendar) for AAOS integrators. (Legacy site migrating to docs.partner.android.com/drivingux, exclusive updates there from March 11, 2026.)

Core principle: **app content and interactions should complement the driving or parked experience and minimize distraction while driving**; Android for Cars experiences are described as research-backed and built to comply with government/industry distraction guidelines. Supporting resources: design principles, UX requirements, templates (Sectioned Item, Grid, List, Sign-in, Tab, Conversation Item — pre-built compliant guardrails), shared components, reusable flows/patterns, and category-specific quality checklists (navigation, communication, media, weather, etc.). The reviewed source pages do not state specific numeric design values (pixel sizes, touch targets, timeouts, contrast ratios) directly — they defer to dedicated sub-pages for that detail — and name no explicit dark-theme requirement.

Supported categories: communication, media, navigation, and other driving apps (IoT, POI) for driving contexts; video streaming, gaming, and web browsing for AAOS parked/passenger contexts.

### Messaging UX Patterns

Communication apps are designed for **car-screen or voice** control, ranging from basic notification messaging up to full Car App Library experiences.

**Calling**: contact lists/grids with tap-to-call, integrated via **CallsManager APIs**; the in-call screen itself is Android-Auto-provided with limited app customization; relevant templates: Sectioned Item, Grid, List, Sign-in, Tab (beta — internal/closed testing tracks, early-access path).

**Incoming messages**: notifications **slide down from the top edge**; shown only when significant enough to interrupt the driver and contextually relevant (low-value types like friend requests are explicitly unsuitable); the system may suppress/limit lower-priority items. Structure: sender avatar + app badge, selectable text (triggers TTS; reply options appear only after playback completes), close icon, system-handled sound.

**Voice-first / read-aloud**: standardized TTS conversion of SMS/email content; drivers can reply immediately or defer (dismissed messages stay reachable via notifications, Notification Center, and the phone). Sample voice exchange:

| Speaker | Line |
|---|---|
| Driver | "Reply!" |
| System | "What's the message?" |
| Driver | [message content] |
| System | [confirms text + recipient] |
| Driver | "Yes!" |
| System | [confirms delivery] |

**Saved/historical messages**: persist in the Notification Center as **chronological cards (newest first)**, length capped to limit distraction (oldest dropped first; all remain retrievable on the phone); each card shows sender avatar + app icon; selecting plays via TTS, then surfaces reply options (same play-then-reply pattern as live notifications).

**Templated messaging**: Car App Library-based conversation list mirroring the mobile app, readable/repliable via **Gemini or Google Assistant**; **Conversation Item templates** are less flexible, with mandatory data fields (beta — internal/closed testing tracks, early-access path).

**App-side design scope**: since Android Auto renders the notification UI itself, app responsibility is largely limited to a badge-legible app icon and correct message grouping/ordering.

### Parked and Passenger App Design

For non-driving scenarios (charging, waiting for a passenger, a secondary passenger screen), Android for Cars supports bringing existing **tablet and browser apps** into the car "with Google built in" rather than the heavily constrained driving UI. Parked/passenger apps can offer richer content than driving apps (navigation/communication/media, which must stay glanceable/voice-first) — **video streaming, gaming** (examples: Angry Birds 2, Farm Heroes Saga), and **web browsing** are explicitly appropriate only in this non-moving context. Adapting an existing tablet/browser app for parked/passenger use is described as relatively quick; detailed guidance currently exists for **video apps** ("Adapt video apps") with other types marked "coming soon." As multi-screen vehicles grow more common, these experiences also target passenger engagement independent of the driving task.

Source: https://developers.google.com/cars/design, https://developer.android.com/design/ui/cars, https://developer.android.com/design/ui/cars/guides/app-types/communications, https://developers.google.com/cars/design/android-auto/apps/incoming-messages, https://developers.google.com/cars/design/android-auto/apps/saved-messages, https://developers.google.com/cars/design/android-auto/apps/voice-messaging, https://developer.android.com/design/ui/cars/guides/app-types/parked-passenger-apps
