---
source_url: https://developer.android.com/docs/quality-guidelines/car-app-quality
platform: android-auto
title: Car app quality
---

To provide a great experience for users in cars, complete the car compatibility
checklists and tests that follow as you design and develop your app.

The checklists and tests define an extensive set of quality requirements for the
various app categories supported by Android Auto and Android Automotive OS. Many
requirements apply only to specific categories, so be sure to filter by your
app's category. See the [Car quality tiers](https://developer.android.com/docs/quality-guidelines/car-app-quality#car-quality-tiers) definitions
for details on which guidelines your app must meet in order to be accepted on
the Google Play Store.

> **Note:** **September 2026 update:** The Games app category is now generally available. See [September 2026](https://developer.android.com/docs/quality-guidelines/car-app-quality#sep-26) for details.

## Test your app

Test your app for the applicable criteria listed on this page before submitting
your app to Google Play for review. As applicable, test both of the ways
users can access your app:

Android Automotive OS
:   Use the [Android Emulator](https://developer.android.com/studio/run/emulator) to validate each checklist
    item. For more information, see [Test using the Android Automotive OS
    emulator](https://developer.android.com/training/cars/testing/emulator).

Android Auto
:   Use the Android Auto Desktop Head Unit (DHU) to validate each checklist item.
    For more information, see [Test using the Desktop Head Unit](https://developer.android.com/training/cars/testing/dhu).

## App categories

> **Key Point:** Select your app's categories to filter the guidelines on this page.

| [Supported categories](https://developer.android.com/training/cars#supported-app-categories) | Android Auto | Android Automotive OS |
|---|---|---|
| Media | ✔ | ✔ |
| Media (templated) labs | ✔ | ✔ |
| Communication - messaging notifications | ✔ |   |
| Communication - templated messaging labs | ✔ |   |
| Communication - calling labs | ✔ |   |
| Navigation | ✔ | ✔ |
| Point of Interest (POI) | ✔ | ✔ |
| Internet of Things (IOT) | ✔ | ✔ |
| Weather | ✔ | ✔ |
| Video |   | ✔ |
| Games | ✔ | ✔ |
| Browsers labs |   | ✔ |

## Car quality tiers

The quality tiers define criteria to help you assess the level of support your
app provides for cars. Each category builds upon those below it. That is, for an
app to be *Car optimized*, it should also meet all of the applicable *Car ready*
requirements.

In addition to the guidelines specific to cars, each tier has associated
guidelines from [Adaptive app quality guidelines](https://developer.android.com/docs/quality-guidelines/large-screen-app-quality) that
are relevant for activities implemented by your app.

Levels of support include the following:

### Tier 3 - Car ready

Your app is large screen compatible and can be used while the car is parked.
While it may not have any car-optimized features, users can experience the app
just as they would on any other large screen Android-powered device.

This tier primarily applies to the [parked categories](https://developer.android.com/training/cars/parked) of apps,
which must meet all of the requirements in this tier to be accepted on the
Google Play Store.

> **Note:** Through the [Car ready mobile apps program](https://developer.android.com/training/cars/car-ready-mobile-apps), mobile apps meeting the requirements in this tier can be made available for download from the Google Play Store on Android Automotive OS vehicles with Google built-in.

### Tier 2 - Car optimized

Your app provides a great experience on the car's center stack display. To
accomplish this, your app has some car-specific capabilities that users can
experience across driving or parked modes, depending on your app's category.

Apps in [categories built for use while driving](https://developer.android.com/training/cars#supported-app-categories) must
meet all of the applicable requirements in this tier to be accepted on the
Google Play Store.

### Tier 1 - Car differentiated

Your app is built to work across the variety of hardware in cars and can adapt
its experience across driving and parked modes. It provides the best user
experience designed for the different screens in cars such as the center
console, instrument cluster, and additional screens - like panoramic displays
seen in many premium cars.

### Car ready

| Criteria | ID | Applicable Categories | Description |
|---|---|---|---|
| Permitted Categories | `PC-1` | All | The app must not include features outside the app types intended for cars. See [Supported app categories](https://developer.android.com/training/cars#supported-app-categories). |
| Expected Performance | `EP-1` | All | The app must work as expected or described in the app's Google Play Store listing. |
| Expected Performance | `EP-2` | Media, Messaging (templated), Calling, Navigation, POI, IOT, Weather, Video, Games, Browsers | When the app is relaunched from the home screen, the app must restore the app state as closely as possible to the previous state. |
| Expected Performance | `EP-3` | Games | The app is responsive to input and does not freeze or stutter during gameplay. |
| Expected Performance | `EP-4` | Media, Messaging (templated), Calling, Navigation, POI, IOT, Weather | **Android Automotive OS only:** The app listing on Google Play Store must include screenshots for the Android Automotive OS form factor. See [Provide Android Automotive OS screenshots](https://developer.android.com/training/cars/distribute#opt-in-aaos). Note: For apps in the parked app categories, screenshots are optional. However, if your app includes features unique to cars, or the app differs significantly from the experience on mobile or tablet, it is recommended to include screenshots in your Google Play Store listing. |
| Display Orientation | `DO-1` | Video, Games, Browsers | **Android Automotive OS only:** The app can be distributed to devices with fixed screen orientations. See [Required Android Automotive OS features](https://developer.android.com/training/cars/parked/automotive-os#required-features). |
| Display Orientation | `DO-2` | Games | **Android Auto only:** The app is not significantly pillarboxed when running on landscape displays. See [Support common Android Auto screen sizes](https://developer.android.com/training/cars/parked/auto#support-screen-sizes). |
| App Rendering | `AR-1` | All categories supported by Android Automotive OS | In activities implemented by the app, interactive UI elements must not be obstructed by system bars or display cutouts. See [Work with window insets and display cutouts](https://developer.android.com/training/cars/parked/automotive-os#insets-and-cutouts). |
| Driver Distraction | `DD-3` | Video, Games, Browsers | The app must not be launchable or usable while driving and must not play any audio. See [Meet driver distraction requirements](https://developer.android.com/training/cars/parked/automotive-os#driver-distraction). Note: If your app plays audio, it must meet the `DD-2` requirement. |
| Irrelevant notifications | `IN-2` | Video, Games, Browsers | The app must not post any [heads up notifications](https://developer.android.com/training/cars/platforms/automotive-os/notifications#hun). |
| App Navigability | `AN-1` | Video, Games, Browsers | Users can navigate through the app without encountering any dead ends. |
| Sensitive Data | `SD-1` | Browsers | Browsers must not save or allow access to passwords or payment information unless the [user can block access to passwords](https://developer.android.com/training/cars/parked/browser#block-sensitive) using a profile lock. |
| Sensitive Data | `SD-2` | Browsers | Before syncing data to the car, browsers that synchronize passwords or payments data must do the following steps: 1. Prompt the user to authenticate. 2. Notify the user on the car screen their data will be synchronized to the car. |

#### Associated large screen quality guidelines

While these guidelines are relevant for all activities implemented by your app,
they are Tier 3 requirements only for [parked apps](https://developer.android.com/training/cars/parked).

| Criteria | ID | Guidance for cars |
|---|---|---|
| Configuration and continuity | `LS-C1` | Configuration changes in cars are primarily caused by moving an app between displays, such as when moving an app to or from a [distant display](https://developer.android.com/training/cars/testing/emulator/distant-display). |
| Configuration and continuity | `LS-C2` | No additional guidance. |

### Car optimized

| Criteria | ID | Applicable Categories | Description |
|---|---|---|---|
| Parked Experiences | `PE-1` | Media, Navigation, POI, IOT, Weather | **Android Automotive OS only:** with the exception of providing setup, settings, and sign-in flows while parked, the app must not provide any functionality through its own activities. |
| Screen Animation | `SA-1` | Media, Messaging, Calling, Navigation, POI, IOT, Weather | The app must not display animated elements on the screen, such as animated graphics or video. **Exception:** Canvas animations while the user is parked are allowed if they are relevant to the driving task. |
| Visual or Text Ads | `AD-1` | Media, Messaging, Calling, Navigation, POI, IOT, Weather | The app must not display text-based advertising other than the advertiser's name or the product name. |
| Image Usage | `IU-1` | Media, Messaging, Calling, Navigation, POI, IOT, Weather | App elements don't display any images on the screen. Exceptions include: a single static image for content context in the background of the consumption screen (such as album art or the advertiser's corporate logo); icons in the content navigation drawer; images and photographs to aid in driving decision-making; navigation apps can display an image for lane guidance or junction guidance. |
| Visual Information on Phone | `VI-1` | Media, Messaging (templated), Calling, Navigation, POI, IOT, Weather | **Android Auto only:** If the user must go to the phone screen—for example, to act on a permission request—then the app must display a message instructing the user to only look at their phone screen when it's safe to do so. |
| App Doesn't Crash | `AC-1` | Messaging (templated), Calling, Navigation, POI, IOT, Weather | Users must be able to complete tasks in the app using five screens or fewer. |
| Scrolling Text | `ST-1` | Media, Messaging, Calling, Navigation, POI, IOT, Weather | The app must not display automatically scrolling text. |
| Voice Commands | `VC-1` | Media, Navigation | The app must support Gemini and Google Assistant voice commands. |
| Delayed Response | `DR-1` | Media, Messaging (templated), Calling, Navigation, POI, IOT, Weather | App-specific buttons must respond to user actions with no more than a two-second delay. |
| Delayed Response | `DR-2` | Media, Messaging (templated), Calling, Navigation, POI, IOT, Weather | The app must launch in no more than 10 seconds. |
| Delayed Response | `DR-3` | Media, Messaging (templated), Calling, Navigation, POI, IOT, Weather | The app must load content in no more than 10 seconds. |
| Contrast | `VD-1` | Media, Messaging, Calling, Navigation, POI, IOT, Weather | The app must provide icons and colors that meet Android Auto's contrast requirements. |
| Contrast | `VD-2` | Media | The app must provide white icon sets that the system colorizes to provide automatic contrast compensation. |
| Contrast | `VD-3` | Media | The app must provide colors that the system can optimize for in-vehicle readability. |
| Theming | `TH-1` | Messaging (templated), Navigation, POI, IOT, Weather | Apps that add custom theming to Car App Library components with version 1.9 or higher must support light and dark theme. |
| Grey Buttons | `GB-1` | Media | Interactive elements that are intentionally disabled must be nonfunctional. |
| Driver Distraction | `DD-1` | Navigation | The navigation audio channel can only be used by navigation apps and for navigation instructions. |
| Driver Distraction | `DD-2` | Video, Games, Browsers | While driving, the app must not be launchable and the app's UI must not be visible. The app's audio must stop when the user starts driving and cannot be unpaused while driving. **Exception:** Video apps that support audio while driving can continue playback on supported devices (see `DD-4`). |
| Payments | `PA-1` | Navigation, POI, IOT, Weather | The app must have simple flows if purchases are enabled, using shortcuts such as recent or favorite purchases. The app must not allow: setup of payment methods; multiple items to be selected for purchase; commitment to recurring payments, such as subscriptions. |
| Notification Ads | `NA-1` | Media, Messaging, Calling, Navigation, POI, IOT, Weather | The app must not present advertisements through notifications. |
| Irrelevant Notifications | `IN-1` | Media, Messaging, Calling, Navigation, POI, IOT, Weather | The app must display notifications only when relevant to the driver's needs. Good: notifying the user that a new message has arrived. Bad: notifying the user about a new album release, or weather apps posting notifications not related to imminent alerts for the current location, route, or destination. |
| Media Autoplay | `MA-1` | Media | The app must not autoplay on startup or without user initiated action to select the app or app media. |
| Messaging Functionality | `MF-1` | Messaging | The app must receive incoming messages. |
| Messaging Functionality | `MF-2` | Messaging | Messages must be properly grouped and displayed in the correct order. |
| Messaging Functionality | `MF-3` | Messaging | The user can reply to a message. |
| Messaging Functionality | `MF-4` | Messaging | The app must use short-form messaging app design patterns. Long-form messaging apps, such as apps for email, are not permitted. |
| Messaging Functionality | `MF-5` | Messaging | The app must implement a peer-to-peer messaging service and not notification services, such as those for weather, stocks, and sport scores. |
| Navigation Functionality | `NF-1` | Navigation | The app must provide turn-by-turn navigation directions. |
| Navigation Functionality | `NF-2` | Navigation | The app draws only map content on the surface of the navigation templates. Text-based turn-by-turn directions, lane guidance, and estimated arrival time must be displayed on the relevant components of the navigation template. Additional driving-relevant information (speed limit, road obstructions, etc.) can be drawn on the safe area of the map. |
| Navigation Functionality | `NF-3` | Navigation | When the app provides text-based turn-by-turn directions, it must also trigger navigation notifications. |
| Navigation Functionality | `NF-4` | Navigation | When the navigation app provides text-based turn-by-turn directions, it must send next-turn information to the vehicle's cluster display. |
| Navigation Functionality | `NF-5` | Navigation | The app must not provide turn-by-turn notifications, voice guidance, or cluster information when another navigation app is providing turn-by-turn instructions. |
| Navigation Functionality | `NF-6` | Navigation | The app must handle navigation requests from other apps. |
| Navigation Functionality | `NF-7` | Navigation | The app must provide a "test drive" mode that simulates driving. |
| Point of Interest Functionality | `PF-1` | POI | The app must provide meaningful functionality relevant to driving. |
| Internet of Things Functionality | `IT-1` | IOT | The IOT app may allow while driving: viewing the current state of devices (e.g., garage door open/closed, light bulb on/off, security system armed/disarmed, washer running/completed); simple one-touch on/off features (e.g., turning devices on/off, opening/closing a garage door or curtain, toggling a pre-programmed scene or routine); notifying users about an event (e.g., a routine/scene notification, security alert, door status change). The IOT app must not allow while driving: app setup tasks (selecting devices, systems, or locations); creation, modification, or reordering of scenes/routines; fine-grained device control (e.g., adjusting thermostat temperature or lighting luminescence level). |
| Weather Functionality | `WE-1` | Weather | App must include weather related content, which must be relevant to the user's current location or a user specified location. |
| Weather Functionality | `WE-2` | Weather | Weather information on map tiles must be readable and may not include complex legends. Apps may include a maximum of three legends. Apps with multiple legends may have a maximum of three colors, whereas single legend apps may have more than three colors. |
| Weather Functionality | `WE-3` | Weather | Forecast information must include easily readable icons and symbols. |
| Weather Functionality | `WE-4` | Weather | Customization of forecast intervals must not be made possible using templates. |
| Weather Functionality | `WE-5` | Weather | Weather apps must not show more than five unique weather map annotations in a given view (for example: temperature markers, wind speed markers, humidity, radar overlay, lightning indicators, road conditions all in the same view). |
| Map Rendering | `MR-1` | Navigation, POI, Weather | By default, apps that draw maps must draw a light-themed or dark-themed map when instructed to do so. Apps can let users choose to always display the app in either light or dark theme. |
| Media Controls | `MC-1` | Video | The app integrates with media session. Depending on the content, the app must support either the play/pause or stop playback commands. Additionally, the app must provide title and thumbnail metadata for every media item. |
| Deep Links | `DL-1` | Video, Games, Browsers | **Android Automotive OS only:** The app supports deep links. |
| Media Functionality (templated) | `MFT-1` | Media (templated) | User must be able to navigate to the `MediaPlaybackTemplate` from media browsing views or support the minimized control panel for apps using the Car App Library Version 1.9 or higher. |
| Media Functionality (templated) | `MFT-3` | Media (templated) | Handle `SHOW_MEDIA_PLAYBACK` intents: Templated Media apps must handle the `androidx.car.app.media.action.SHOW_MEDIA_PLAYBACK` intent action to direct the user to the `MediaPlaybackTemplate`. |

#### Associated large screen quality guidelines

While these guidelines are relevant for all activities implemented by your app,
they are Tier 2 requirements only for [parked apps](https://developer.android.com/training/cars/parked).

| Criteria | ID | Guidance for cars |
|---|---|---|
| Multi-window and multi-resume | `LS-M2` | When an activity is on a [distant display](https://developer.android.com/training/cars/testing/emulator/distant-display), it loses the top resumed activity position when the user interacts with an activity on the main display. |
| UX | `LS-U1` | Some cars have landscape screens with much greater aspect ratios than are common on other large screen devices. You can use the Automotive Ultrawide hardware profile to test on such a display. |
| UX | `LS-U2` | Same as for LS-U1 |
| UX | `LS-U3` | To qualify as a car optimized app, your app must meet the LS-U3 requirement for touch target sizes. To qualify as car differentiated, it must meet the car `UX-1` requirement. |

### Car differentiated

| Criteria | ID | Applicable Categories | Description |
|---|---|---|---|
| Navigation Functionality | `NF-9` | Navigation | The app supports rendering on cluster displays, and only renders map tiles on these displays. **Warning:** Navigation apps that also support weather functionality must not include any weather-related information on the cluster display. |
| Templated Messaging Functionality | `TMF-1` | Messaging (templated) | The app displays conversations: the self property of each conversation is set accurately; users can send a message using the button provided for each conversation; conversations are refreshed to include new messages as they are sent and received. |
| Calling Functionality | `CF-1` | Calling | The app can be used to initiate, accept, decline, and leave calls. |
| Calling Functionality | `CF-2` | Calling | During a call, the app provides: a call name and icon; for meetings/group calls, the number of participants and the actively speaking participant; the ability for a user to mute themselves. |
| Calling Functionality | `CF-3` | Calling | Calls initiated while Android Auto is not connected continue when a user connects to Android Auto and are displayed on Android Auto. |
| Deep Links | `DL-2` | Media, Navigation, POI, IOT, Weather | **Android Automotive OS only:** The app supports deep links. |
| Driver distraction | `DD-4` | Video | The app supports audio while driving on capable devices. **Important:** The app must meet `DD-2` on devices that don't support audio while driving. |
| App Rendering | `AR-2` | Video, Games, Browsers | The app renders into display cutouts to fully make use of the screen space available while maintaining the ability for users to continue interacting with all UI elements on the screen. |
| Media Functionality (templated) | `MFT-2` | Media (templated) | App provides a differentiated experience by using templates for scenarios beyond basic browsing and playback. For example, by providing expanded playback controls or by allowing users to adjust driving relevant app settings. |
| User Experience | `UX-1` | Video, Games, Browsers | Touch targets are at least 64dp. |
| User Experience | `UX-2` | Video, Games, Browsers | Touch targets are at least 24dp apart from each other and 24dp away from screen edges. |
| User Experience | `UX-3` | Video, Games, Browsers | Font sizes should be at least 24sp. |

#### Associated large screen quality guidelines

While these guidelines are relevant for all activities implemented by your app,
they are Tier 1 requirements only for [parked apps](https://developer.android.com/training/cars/parked).

| Criteria | ID | Guidance for cars |
|---|---|---|
| UX | `LS-U4` | Although keyboards are supported by Android Automotive OS, they're less common input methods in cars in comparison to other large screen devices. However, some cars have rotary input devices that rely on the same APIs as tab navigation with a keyboard, so they also require LS-U4 to be met to function properly. |
| Keyboard, mouse, and trackpad | `LS-I3` | Same as for LS-U4 |

## Frequently asked questions

**What happens after I submit my app?**

Apps for cars are subject to an additional manual review beyond normal Play
Store review processes. Your app is tested to ensure compliance against the
applicable criteria.

**After submitting my app, how will I find out if my app does not meet all the
requirements for Android Auto or Android Automotive OS?**

If your app does not meet the app quality requirements described on this page,
the Play Store team contacts you through the email address specified in the
Google Play Console account associated with the app.

> **Note:** For information about how to publish your app in Google Play, see [Distribute to cars](https://developer.android.com/training/cars/distribute).

**How do I manage policy violations and appeals?**

You can learn more about managing policy violations and appeals in the Google Play policy center.

**My app targets more than just Android Auto or Android Automotive OS. If my app
does not meet the car requirements, will my new or updated app still appear on
Google Play for other devices?**

No. When Google begins the approval process, your app undergoes an app quality
review. Any subsequent updates are not available for distribution until the app
is approved. If you need to make updates to your app for other devices, consider
creating a separate release from the updates to your car app.

> **Caution:** Due to this restriction, you shouldn't use your production APK for Android Auto support prototyping.

## Change notes

### September 2026

- The Games parked app category has graduated from beta to general availability. Developers can now publish games to all track types on Google Play.

### August 2026

- Expected Performance
  - Categories affected: Media, Messaging (templated), Calling, Navigation, POI, IOT, or Weather
  - New criterion: `EP-4` — **Android Automotive OS only:** The app listing on Google Play Store must include screenshots for the Android Automotive OS form factor. Note: For apps in the parked app categories, screenshots are optional, though recommended if the app includes car-unique features or differs significantly from mobile/tablet.

### May 2026

- Voice Commands
  - Categories affected: Media, Media (templated), Navigation
  - Updated criterion: `VC-1`
  - Previous text: The app must support Google Assistant voice commands.
  - New text: The app must support Gemini and Google Assistant voice commands.
- Theming
  - Categories affected: Media (templated), Messaging (templated), Navigation, POI, IOT, Weather
  - New criterion: `TH-1` — Apps that add custom theming to Car App Library components with version 1.9 or higher must support light and dark theme.
- Media Functionality (templated)
  - Categories affected: Media (templated)
  - Updated criterion: `MFT-1`
  - Previous text: User must be able to navigate to the `MediaPlaybackTemplate` from media browsing views.
  - New text: User must be able to navigate to the `MediaPlaybackTemplate` from media browsing views or support the minimized control panel for apps using the Car App Library Version 1.9 or higher.
  - New criterion: `MFT-3` — Handle `SHOW_MEDIA_PLAYBACK` intents: Templated Media apps must handle the `androidx.car.app.media.action.SHOW_MEDIA_PLAYBACK` intent action to direct the user to the `MediaPlaybackTemplate`.

### May 2025

- App Categories: "Communication — messaging notifications" replaces the "Messaging" category. "Communication — templated messaging" and "Communication — calling" have been added, including the related "Templated Messaging Functionality" and "Calling Functionality" criteria.
- Expected Performance
  - Categories affected: Games
  - New criterion: `EP-3` — The app is responsive to input and does not freeze or stutter during gameplay.
- Display Orientation
  - Categories affected: Games, Video, Browser
  - Updated criterion: `DO-1`
  - Previous text: The app can be distributed to devices with fixed screen orientations.
  - New text: Android Automotive OS only: The app can be distributed to devices with fixed screen orientations.
  - New criterion: `DO-2` — Android Auto only: The app is not significantly pillarboxed when running on landscape displays.
- Deep Links
  - Categories affected: Video, Games, Browsers
  - New criterion: `DL-1` — Android Automotive OS only: The app supports deep links.
  - Categories affected: Media, Navigation, POI, IOT, Weather
  - New criterion: `DL-2` — Android Automotive OS only: The app supports deep links.
- CPU Architectures
  - Categories affected: Video, Games, Browsers
  - Removed criterion: `CP-1` — The app must support both x86_64 and ARM CPUs.
- Driver Distraction
  - Categories affected: Video
  - New criterion: `DD-4` — The app supports audio while driving on capable devices. **Important:** The app must meet `DD-2` on devices that don't support audio while driving.

### December 2024

- App Categories: "Weather" has been added, including the introduction of the Weather Functionality criteria.
- Map Rendering
  - Categories affected: Navigation, POI, Weather
  - New criterion: `MR-1` — By default, apps that draw maps must draw a light-themed or dark-themed map when instructed to do so. Apps can let users choose to always display the app in either light or dark theme.
- Navigation Functionality
  - Removed criterion: `NF-8` — replaced by `MR-1`.
  - Updated criterion: `NF-9` — now additionally notes navigation apps that also support weather functionality must not include any weather-related information on the cluster display.
- Screen Animation
  - Updated criterion: `SA-1`
  - New text adds: Exception: Canvas animations while the user is parked are allowed if they are relevant to the driving task.

### May 2024

- Introduction of the Car quality tiers.
- Driver Distraction: new criterion `DD-3` (Browsers, Games, Video) — The app must not be launchable or usable while driving and must not play any audio.
- App Rendering: new criteria `AR-1` and `AR-2` (categories supported by Android Automotive OS / Video, Games, Browsers).
- Media Controls: new criterion `MC-1` (Video).
- UX: new criteria `UX-1`, `UX-2`, `UX-3` (Browsers, Games, Video).
- Permitted Experiences: new criterion `PE-1` (Media, Navigation, POI, IOT).
- Navigation functionality: new criterion `NF-9` (Navigation).
- Delayed Response: removal of criteria `DR-1`, `DR-2`, and `DR-3` for the video category.

### July 2023

- App Categories: "Browsers" has been added.
- Sensitive Data: new criteria `SD-1` and `SD-2` (Browsers).

### April 2023

- App Categories: "Games" has been added.
- Irrelevant Notifications: new criterion `IN-2` (Games, Video).
- Settings Flow: removed criterion `SF-1` (Video) — The app must proceed to the home page after sign-in or attempted sign-in.
- Automotive Functionality: removed criterion `AF-1` (Video) — The app must not contain any distraction-optimized activities.

### March 2023

- Grammar and formatting changes.

### December 2022

- Internet of Things Functionality: new criteria describing allowed/disallowed IOT app behaviors while driving.

### May 2022

- App Categories: "Parking & Charging" has been replaced with "Point of Interest".
- Screen Animation, Image Usage, category scoping, Visual Information on Phone, and Navigation Functionality criteria text updates.
- Point of Interest Functionality: text simplified; removed criteria restricting Place List Map template locations to parking spots / charging stations.

### April 2022

- Display Orientation: new criteria for Video (support both landscape and portrait).
- Driver Distraction: new criteria for Video (app not launchable, screen not visible, audio stops while driving).
- Settings Flow: new criteria for Video (proceed to home page after sign-in).
- Automotive Functionality: new criteria for Video (no driver optimized activities).
- CPU Architectures: new criteria for Video (support x86_64 and ARM CPUs).
- App Navigability: new criteria for Video (no dead ends).

### November 2021

- Visual Information on Phone: text updated and scoped to Android Auto only.
- Payments: text updated for Navigation, Parking & Charging — simple flows using shortcuts such as recent or favorite purchases; disallowing setup of payment methods, multiple item selection, and recurring payment commitments.
