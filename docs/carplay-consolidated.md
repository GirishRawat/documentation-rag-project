# Apple CarPlay Developer Documentation (Consolidated)

## Overview

CarPlay is Apple's framework and in-car platform for projecting a safety-adapted version of an iPhone app onto a vehicle's built-in displays (and, with CarPlay Ultra, deeper integration including the instrument cluster). Rather than being a separate app, CarPlay support is added to an existing iOS app: the app adopts the `CarPlay` framework (available iOS/iPadOS 12.0+, Mac Catalyst 14.0+), declares one or more CarPlay scenes, and builds its in-car UI from a fixed set of system-rendered templates (lists, grids, tab bars, maps, alerts, now-playing, search, voice control, point-of-interest, information, contact). The developer controls the content/data (the model) and which template to show (the controller); iOS renders the actual UI (the view), enforcing consistent touch-target sizes, fonts, and colors across all cars. CarPlay apps fall into fixed, mutually exclusive categories (audio, video, communication, navigation, driving task, EV charging, fueling, parking, public safety, quick food ordering, voice-based conversational — EV charging + fueling may combine), each gated by its own entitlement and each permitted a different subset of templates and navigation-hierarchy depth. Separately, widgets and Live Activities can appear in CarPlay (left of the CarPlay Dashboard, or as notifications) without the app being a CarPlay app at all. This consolidated reference covers entitlements/setup, scene/app lifecycle classes, every CarPlay template class, the instrument cluster, sample app-category integrations (Music, Navigation, Quick-Ordering), simulator/testing guidance, iOS 13 backward compatibility, and the full narrative content of Apple's CarPlay Developer Guide (categories, guidelines, assets, audio handling, navigation deep-dive, maneuver/junction/lane enums, panels, testing presets, scene manifest XML, and deprecated entitlements). Where relevant to a RAG agent that also fields Android Auto comparison questions: CarPlay's template-based, OS-rendered model (fixed native templates, no custom views except the navigation base-map layer) is architecturally analogous to Android Auto's Car App Library (which similarly uses host-rendered templates like `ListTemplate`, `GridTemplate`, `NavigationTemplate`, `MessageTemplate` instead of custom Activities/Views) — both platforms restrict custom rendering to navigation map content and otherwise force a constrained, driving-safe, host-controlled UI.

---

## Entitlements & Setup

**Requesting entitlements:** Every CarPlay app needs a category-specific entitlement. Request it at developer.apple.com/contact/carplay (or developer.apple.com/carplay), providing app details and category, and agree to the **CarPlay Entitlement Addendum**. Apple reviews against predefined criteria per category and, if approved, adds the entitlement to the developer account via managed capabilities.

**Xcode project setup:**
1. Log in to the Apple Developer account, go to Certificates, IDs & Profiles → Identifiers.
2. Select/create the App ID and enable the needed CarPlay entitlement(s).
3. Create a new Provisioning Profile with the CarPlay capability and import it into Xcode.
4. Create/update an `Entitlements.plist` with the boolean entitlement key(s), e.g. for an audio app:
   ```xml
   <key>com.apple.developer.carplay-audio</key>
   <true/>
   ```
5. In Signing & Capabilities, turn off "Automatically manage signing"; in Build Settings, point **Code Signing Entitlements** at the `Entitlements.plist` path.

Once added, the app icon appears on the CarPlay home screen for **everyone** — entitlements can't be selectively shown/hidden per user, so only ship with CarPlay support when ready for all users.

**Entitlement key table** (category → key → minimum iOS):

| Category | Entitlement key | Min iOS |
|---|---|---|
| Audio (CarPlay framework) *(also on Apple HomeView)* | `com.apple.developer.carplay-audio` | 14 |
| Communication | `com.apple.developer.carplay-communication` | 14 |
| Driving task | `com.apple.developer.carplay-driving-task` | 16 |
| EV charging *(combinable with fueling)* | `com.apple.developer.carplay-charging` | 14 |
| Fueling *(combinable with EV charging)* | `com.apple.developer.carplay-fueling` | 16 |
| Navigation | `com.apple.developer.carplay-maps` | 12 |
| Parking | `com.apple.developer.carplay-parking` | 14 |
| Public safety | `com.apple.developer.carplay-public-safety` | 14 |
| Quick food ordering | `com.apple.developer.carplay-quick-ordering` | 14 |
| Video *(also on Apple HomeView)* | `com.apple.developer.carplay-video` | 27 |
| Voice-based conversational | `com.apple.developer.carplay-voice-based-conversation` | 26.4 |

Multiple categories cannot be combined in one app except EV charging + fueling. Using a template not supported by your category's entitlement throws a runtime exception.

**Deprecated entitlements** (legacy, pre-CarPlay-framework support, see iOS 13 Compatibility section below for usage):
- `com.apple.developer.playable-content` — CarPlay audio app via Media Player framework (no customizable UI)
- `com.apple.developer.carplay-messaging` — CarPlay messaging app
- `com.apple.developer.carplay-calling` — CarPlay VoIP calling app

Source: https://developer.apple.com/documentation/carplay/requesting-carplay-entitlements, https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf, https://developer.apple.com/carplay/

---

## Scenes & App Lifecycle

CarPlay content is shown through **UIScene** subclasses the system creates and manages; the app supplies delegates conforming to the relevant `...SceneDelegate` protocol to respond to lifecycle events. All CarPlay apps must adopt scenes (declared statically in `Info.plist` via an application scene manifest, or dynamically via the app delegate's `application(_:configurationForConnecting:options:)`).

### CPTemplateApplicationScene
`class CPTemplateApplicationScene` (iOS/iPadOS 13.0, Mac Catalyst 13.1; inherits `UIScene`). The primary CarPlay scene controlling the app's UI. Only navigation apps get access to its `carWindow: CPWindow` (for drawing map content, via `class CPWindow`); all other categories use only the scene's `interfaceController: CPInterfaceController` (via `class CPInterfaceController`, which manages the templates/navigation hierarchy). Key members:
- `var delegate: (any CPTemplateApplicationSceneDelegate)?`
- `protocol CPTemplateApplicationSceneDelegate` — life-cycle callbacks, notably `templateApplicationScene(_:didConnect:)` (receives the `CPInterfaceController`) and `templateApplicationScene(_:didDisconnect:)`.
- `var contentStyle: UIUserInterfaceStyle`

You never instantiate this directly — specify the class name in the scene manifest:
```plist
<key>CPTemplateApplicationSceneSessionRoleApplication</key>
<array>
  <dict>
    <key>UISceneClassName</key><string>CPTemplateApplicationScene</string>
    <key>UISceneConfigurationName</key><string>MyCarPlaySceneConfiguration</string>
    <key>UISceneDelegateClassName</key><string>MyCarPlaySceneDelegate</string>
  </dict>
</array>
```
Typical usage pattern (from the Developer Guide):
```swift
import CarPlay
class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
    var interfaceController: CPInterfaceController?
    func templateApplicationScene(_ scene: CPTemplateApplicationScene,
                                   didConnect interfaceController: CPInterfaceController) {
        self.interfaceController = interfaceController
        let listTemplate: CPListTemplate = ...
        interfaceController.setRootTemplate(listTemplate, animated: true)
    }
    func templateApplicationScene(_ scene: CPTemplateApplicationScene,
                                   didDisconnect interfaceController: CPInterfaceController) {
        self.interfaceController = nil
    }
}
```
To launch other apps from within CarPlay (e.g. directions or phone calls), use `CPTemplateApplicationScene`'s `open(_:options:completionHandler:)` with a URL so the target launches on the CarPlay screen itself.

### CPSessionConfiguration
`class CPSessionConfiguration` (iOS/iPadOS 12.0, Mac Catalyst 13.1; inherits `NSObject`). Exposes vehicle-imposed UI limits (keyboard availability, list length) and the ambient-light-driven content style.
- `init(delegate: any CPSessionConfigurationDelegate)`, `protocol CPSessionConfigurationDelegate` — notified of changes.
- `var delegate: (any CPSessionConfigurationDelegate)?`
- `var contentStyle: CPContentStyle` / `struct CPContentStyle`
- `var limitedUserInterfaces: CPLimitableUserInterface` (bit mask) / `struct CPLimitableUserInterface`
- `var supportsVideoPlayback: Bool`

Use `limitedUserInterfaces` to detect/react to cars that disable the keyboard or shorten lists while driving (see Keyboard and list restrictions below).

### CPTemplateApplicationDashboardScene
`class CPTemplateApplicationDashboardScene` (iOS/iPadOS 13.4+, Mac Catalyst 13.4+; inherits `UIScene`). Controls the navigation app's **CarPlay Dashboard** window — shown when there's no active navigation session, alongside shortcut buttons.
- `var delegate: (any CPTemplateApplicationDashboardSceneDelegate)?` / `protocol CPTemplateApplicationDashboardSceneDelegate`
- `var dashboardController: CPDashboardController` — supplies shortcut buttons; `class CPDashboardController`
- `var dashboardWindow` — the window the scene draws into

Declared similarly to the main scene, via `CPTemplateApplicationDashboardSceneSessionRoleApplication` in the manifest, with its own `UISceneClassName`/`UISceneConfigurationName`/`UISceneDelegateClassName`. See Also: `CPMapTemplate`, `CPSearchTemplate`, `CPVoiceControlTemplate`.

**Enabling Dashboard & instrument cluster scenes (navigation apps):** In the scene manifest, set `CPSupportsDashboardNavigationScene` and `CPSupportsInstrumentClusterNavigationScene` to `true` and declare corresponding scene/delegate entries (`CPTemplateApplicationDashboardSceneSessionRoleApplication`, `CPTemplateApplicationInstrumentClusterSceneSessionRoleApplication`) alongside the main `CPTemplateApplicationSceneSessionRoleApplication` and the phone's `UIWindowSceneSessionRoleApplication`. See the full manifest XML example in the Developer Guide excerpt under "App Category Integrations" / navigation below.

Source: https://developer.apple.com/documentation/carplay, https://developer.apple.com/documentation/carplay/displaying-content-in-carplay, https://developer.apple.com/documentation/carplay/cptemplateapplicationscene, https://developer.apple.com/documentation/carplay/cpsessionconfiguration, https://developer.apple.com/documentation/carplay/cptemplateapplicationdashboardscene, https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf

---

## Templates

CarPlay apps are built entirely from a fixed catalog of `CPTemplate` subclasses. iOS controls layout/rendering; the app supplies data and responds to delegate callbacks. Templates are added to a navigation stack via the interface controller's `pushTemplate(_:animated:completion:)`, presented modally via `presentTemplate(_:animated:completion:)`, or set as the app's `setRootTemplate(_:animated:completion:)`. Hierarchy depth limits vary by category: audio/communication/EV-charging/parking/public-safety/navigation = 5; fueling/voice-conversational = 3; driving-task/quick-ordering = 2 (iOS ≤26.3) or 3 (iOS 26.4+). Per-category template support is gated by entitlement — using an unsupported template throws at runtime.

### CPListTemplate
`@MainActor class CPListTemplate` (iOS/iPadOS 12.0, Mac Catalyst 13.1; inherits `CPTemplate`). Displays a scrolling, single-column list of items grouped into sections — ideal for text/images and hierarchical navigation. Each item conforms to `CPListTemplateItem` or `CPSelectableListItem`; concrete item types include standard items, image-row items (with 5 additional element styles as of iOS 26: row, card, condensed, grid, image grid), and message items (iOS 26, communication apps). Pinned elements (iOS 26) stay fixed at the top. iOS 27 adds portrait/landscape image aspect ratios, overlay thumbnails, and a details header for one prominent top item. Hierarchy depth: food-ordering apps max 2 levels; all other categories max 5 levels; some vehicles cap displayed items at 12 (check `CPSessionConfiguration`).
- `init(title: String?, sections: [CPListSection])`
- `init(title: String?, sections: [CPListSection], assistantCellConfiguration: CPAssistantCellConfiguration?)` — adds a Siri **assistant cell**. Audio apps need `INPlayMediaIntent`; communication apps need `INStartCallIntent` support to enable it.
- `init(title: String?, listHeader: CPListTemplateDetailsHeader?, sections: [CPListSection], assistantCellConfiguration: CPAssistantCellConfiguration?)`
- `init(title: String?, sections: [CPListSection], assistantCellConfiguration: CPAssistantCellConfiguration?, headerGridButtons: [CPGridButton]?)`
- `class var maximumSectionCount: Int`, `var sectionCount: Int`, `var sections: [CPListSection]`, `func updateSections([CPListSection])`, `class CPListSection`
- `var assistantCellConfiguration: CPAssistantCellConfiguration?`, `class CPAssistantCellConfiguration`
- `var emptyViewTitleVariants: [String]`, `var emptyViewSubtitleVariants: [String]`, `var showsSpinnerWhileEmpty: Bool`
- `class var maximumItemCount: Int`, `var itemCount: Int`, `func indexPath(for: any CPListTemplateItem) -> IndexPath?`, `var title: String?`
- `var delegate: (any CPListTemplateDelegate)?`, `protocol CPListTemplateDelegate`
- `var headerGridButtons: [CPGridButton]?`, `var listHeader: CPListTemplateDetailsHeader?`
- `class var maximumGridButtonImageSize: CGSize`, `class var maximumHeaderGridButtonCount: Int`

Typical pattern (list item with handler, spinner shown until `completion()` is called):
```swift
let item = CPListItem(text: "My title", detailText: "My subtitle")
item.handler = { [weak self] item, completion in
    self.interfaceController.pushTemplate(CPNowPlayingTemplate.shared, animated: true)
    completion()
}
let section = CPListSection(items: [item])
let listTemplate = CPListTemplate(title: "Albums", sections: [section])
self.interfaceController.pushTemplate(listTemplate, animated: true)
```
Can also be added as a tab in `CPTabBarTemplate`.

### CPGridTemplate
`@MainActor class CPGridTemplate` (iOS/iPadOS 12.0, Mac Catalyst 13.1; inherits `CPTemplate`). Displays up to eight `CPGridButton` items (icon + title + optional handler) as a two-row grid when more than four are supplied; only the first eight display if more are given.
- `init(title: String?, gridButtons: [CPGridButton])`, `class CPGridButton`
- `var title: String`, `var gridButtons: [CPGridButton]`
- `func updateGridButtons([CPGridButton])`, `func updateTitle(String)`
- `class var maximumGridButtonImageSize: CGSize`

### CPTabBarTemplate
`@MainActor class CPTabBarTemplate` (iOS/iPadOS 14.0, Mac Catalyst 14.0; inherits `CPTemplate`). Container that shows a set of root templates as tabs, each with its own navigation hierarchy; supports Grid, Information, List, and Point of Interest templates as tab content.
- `init(templates: [CPTemplate])`
- `var delegate: (any CPTabBarTemplateDelegate)?`, `protocol CPTabBarTemplateDelegate` — `tabBarTemplate(_:didSelect:)` called on tab change.
- `var templates: [CPTemplate]`, `func updateTemplates([CPTemplate])` (transactional: mutate `templates`, use `tabTitle`/`showsTabBadge`, then call `updateTemplates`)
- `class var maximumTabCount: Int` (currently up to 4 for audio apps, 5 for other categories — don't hardcode)
- `var selectedTemplate: CPTemplate?`, `func select(CPTemplate)`, `func selectTemplate(at: Int)`

Can't be pushed onto an existing hierarchy or presented modally — must be set via `setRootTemplate(_:animated:completion:)`. When the app is playing audio, CarPlay shows a Now Playing button top-right (may be hidden if >4 tabs).

### CPNowPlayingTemplate
`@MainActor class CPNowPlayingTemplate` (iOS/iPadOS 14.0, Mac Catalyst 14.0; inherits `CPTemplate`). Shared, singleton system template showing playback info from `MPNowPlayingInfoCenter`/`MPNowPlayingSession` — you don't instantiate it, you configure the shared instance. Available only to apps with the **audio entitlement**. Only `CPListTemplate` can be pushed on top of it (e.g. for an "Up Next" queue).
- `class var shared: CPNowPlayingTemplate`
- `var nowPlayingButtons: [CPNowPlayingButton]`, `func updateNowPlayingButtons([CPNowPlayingButton])`
- Button subclasses: `CPNowPlayingButton` (abstract base), `CPNowPlayingImageButton`, `CPNowPlayingAddToLibraryButton`, `CPNowPlayingMoreButton`, `CPNowPlayingPlaybackRateButton`, `CPNowPlayingRepeatButton`, `CPNowPlayingShuffleButton`
- `var isAlbumArtistButtonEnabled: Bool`, `var isUpNextButtonEnabled: Bool`, `var upNextTitle: String`
- `func add(any CPNowPlayingTemplateObserver)`, `func remove(any CPNowPlayingTemplateObserver)`, `protocol CPNowPlayingTemplateObserver`
- `var allowsMiniPlayer: Bool` — iOS 27 adds a MiniPlayer (shown by default) with direct play/pause/skip on larger displays; set `false` to show a nav-bar icon instead.
- `var nowPlayingMode: CPNowPlayingMode?`

Configure on scene connect:
```swift
let nowPlayingTemplate = CPNowPlayingTemplate.shared
let rateButton = CPNowPlayingPlaybackRateButton() { /* change rate */ }
nowPlayingTemplate.updateNowPlayingButtons([rateButton])
```
iOS 18.4+ adds **sports mode**: supply sports metadata (team images/names/scores/standings, possession indicator, favorite indicator, event clock as count up/down/paused) alongside regular now-playing info for 2-team sporting events; CarPlay manages the clock automatically once given a starting point.

### CPMapTemplate
`@MainActor class CPMapTemplate` (iOS/iPadOS 12.0, Mac Catalyst 13.1; inherits `CPTemplate`). Navigation apps' root template — the control overlay (nav bar + map buttons) drawn on top of the app's own "base view" map content (set as `window.rootViewController`, drawn via MapKit or custom rendering; CarPlay doesn't deliver direct touch events to the base view). Set via `setRootTemplate(_:animated:completion:)` after `didConnect`.
- `var automaticallyHidesNavigationBar: Bool`, `var hidesButtonsWithNavigationBar: Bool`, `var guidanceBackgroundColor: UIColor`
- `var mapDelegate: (any CPMapTemplateDelegate)?`, `protocol CPMapTemplateDelegate`
- `var mapButtons: [CPMapButton]` (up to 4, trailing-bottom corner), `class CPMapButton` — one must enter panning mode if panning is supported (not all vehicles support touch-drag panning)
- `leadingNavigationBarButtons` / `trailingNavigationBarButtons` (up to 2 each)
- Trip previews: `func showTripPreviews([CPTrip], textConfiguration: CPTripPreviewTextConfiguration?)`, `func showTripPreviews([CPTrip], selectedTrip: CPTrip?, textConfiguration:)`, `func hideTripPreviews()`, `func showRouteChoicesPreview(for: CPTrip, textConfiguration:)`, `class CPTripPreviewTextConfiguration`
- Navigation session: `func startNavigationSession(for: CPTrip) -> CPNavigationSession`, `class CPNavigationSession`
- Estimates: `func updateEstimates(CPTravelEstimates, for: CPTrip)`, `func update(CPTravelEstimates, for: CPTrip, with: CPTimeRemainingColor)`, `enum CPTimeRemainingColor`, `var tripEstimateStyle: CPTripEstimateStyle`, `enum CPTripEstimateStyle`
- Navigation alerts: `func present(navigationAlert: CPNavigationAlert, animated: Bool)`, `func dismissNavigationAlert(animated:completion:)`, `var currentNavigationAlert: CPNavigationAlert?`, `class CPNavigationAlert`
- Panning: `func showPanningInterface(animated: Bool)`, `func dismissPanningInterface(animated: Bool)`, `var isPanningInterfaceVisible: Bool`
- Panels (iOS 27, general-purpose map overlays): `func hidePanel(completion:)`, `func popPanel(completion:)`, `func pushPanel(CPMapPanel, completion:)`, `func showPanel(CPMapPanel, completion:)`

Conforms to `CPBarButtonProviding`.

**Panels in depth (`CPMapPanel`, iOS 27+):** optional title, one or more `CPMapPanelSection`s, optional bottom `CPMapPanelButtonConfiguration`; up to 12 items total across sections, drawn from: `CPListItem`, `CPGridButton`, `CPTrip` (origin/destination), `CPRouteChoice`, `CPTravelEstimates`, `CPRouteDetail` (tolls, battery level), `CPMapTemplateWaypoint`, `CPChargingStationConnection`. Selectable items take an optional async-aware handler. `showPanel(_:)` replaces the visible panel; `pushPanel(_:)` stacks; `popPanel()`/`hidePanel()` navigate back/dismiss; the map delegate is notified on panel appear/disappear.

**Route-guidance flow** (full walkthrough from the Developer Guide): select destination (search/voice/list) → `showTripPreviews` with up to 12 `CPTrip` (each: origin, destination, up to 3 `CPRouteChoice`, time/distance estimates; iOS 26.4+ uses `CPNavigationWaypoint` via `originWaypoint`/`destinationWaypoint`, deprecating the MKMapItem-based `origin`/`destination`) → delegate `selectedPreviewFor:` on route re-selection → delegate `startedTrip:` to begin guidance: call `hideTripPreviews()`, `startNavigationSession(for:)`, and `session.pauseTrip(for: .CPTripPauseReasonLoading)` while computing the route → during guidance, populate `upcomingManeuvers` with `CPManeuver` objects (symbol via `symbolSet`/`CPImageSet` light+dark variants, `instructionVariants` longest-first array, optional `attributedInstructionVariants`, metadata for instrument-cluster display) — always keep ≥1 maneuver queued, and a second maneuver for closely-spaced turns or lane guidance (`CPManeuverDisplayStyleSymbolOnly` via delegate's `CPManeuverDisplayStyle`) — update estimates via `CPNavigationSession.updateEstimates(for:)` and `CPMapTemplate.updateEstimates(for:)` → `CPNavigationAlert` for real-time events, with `shouldShowNotificationFor()` delegate controlling background notification behavior → ending: various `CPNavigationSession` methods, and `mapTemplateDidCancelNavigation` if the car's native nav system takes over → reroute via `resumeTrip(updatedRouteSegments:currentSegment:rerouteReason:)`.

**Touch gestures** (iOS 26+): `CPMapTemplate` delegate callbacks for pinch/double-tap zoom, two-finger slide pitch, two-finger rotate — supported where the vehicle allows touch gestures.

**Maneuver/metadata sharing with vehicle** (iOS 17.4+): respond `true` to delegate `mapTemplateShouldProvideNavigationMetadata()`; use `CPNavigationSession.add(maneuvers:)` / `add(laneGuidances:)` (types `CPManeuver`, `CPLaneGuidance`, `CPLane`); set current road name and maneuver state progression `continue → initial → prepare → execute → continue`; required maneuver properties: `maneuverType`, `junctionType`, `trafficSide`. Full `maneuverType` enum (selected): `arriveAtDestination(Left/Right)`, `arriveEndOfDirections`/`arriveEndOfNavigation`, `changeFerry`, `changeHighway(Left/Right)`, `enterRoundabout`/`exitRoundabout`, `enter_Ferry`/`exitFerry`, `followRoad`, `highwayOffRampLeft/Right`, `keepLeft`/`keepRight`, `leftTurn`/`leftTurnAtEnd`, `rightTurn`/`rightTurnAtEnd`, `noTurn`, `offRamp`/`onRamp`, `roundaboutExit1`…`roundaboutExit19`, `sharpLeftTurn`/`sharpRightTurn`, `slightLeftTurn`/`slightRightTurn`, `startRoute`/`startRouteWithUTurn`, `straightAhead`, `uTurn`/`uTurnAtRoundabout`/`uTurnWhenPossible`. `junctionType`: `intersection`, `roundabout`. `trafficSide`: `right`, `left`. Lane status: `notGood`, `good`, `preferred`; lane angles range -180°…+180°.

**Destination sharing** (iOS 26.4+): set `CPTrip.hasShareableDestination = true`; vehicle shows a Share button during route selection; destination info comes from `destinationWaypoint` (not the deprecated `destination`); delegate callbacks `willShareDestinationFor()`, `didShareDestinationFor()`, `didFailToShareDestinationFor(error:)`.

**Route sharing** (iOS 26.4+): respond `true` to delegate `mapTemplateShouldProvideRouteSharing()`; per-trip opt-out via `CPTrip.routeSegmentsAvailableForRegion` (default `true`); populate `CPNavigationSession.routeSegments` via `addRouteSegments()` (array of `CPRouteSegment`: origin, destination, coordinates, maneuvers, lane guidance) in order, keep `currentSegment` current; to change route, `pauseTrip(for:description:)` then `resumeTrip(updatedRouteSegments:Segment:rerouteReason:)`; monitor `didUpdateRouteSharingEnabled()` and `didReceiveUpdatedRouteSource()`. **Vehicle-initiated waypoints**: delegate `didRequestToInsert(into:completion:)` (payload `CPNavigationWaypoint`) while navigating — either invoke the completion handler with `CPTravelEstimates` for default UI (observe `waypoint(accepted:forSegment:)`) or suppress the handler to supply custom UI, then pause/resume the trip with the new segments; if not navigating, delegate `didReceiveRequestForDestination()` instead.

### CPSearchTemplate
`@MainActor class CPSearchTemplate` (iOS/iPadOS 12.0, Mac Catalyst 13.1; inherits `CPTemplate`). Presents a search field, Cancel button, localized keyboard, and a results list. Push via `pushTemplate(_:animated:completion:)`.
- `var delegate: (any CPSearchTemplateDelegate)?`, `protocol CPSearchTemplateDelegate`
  - `searchTemplate(_:updatedSearchText:completionHandler:)` — called as the user types; call `completionHandler` with `[CPListItem]` results.
  - `searchTemplate(_:selectedResult:completionHandler:)` — called on result selection.
- Note: some vehicles restrict keyboard display entirely while driving — check `CPSessionConfiguration.limitedUserInterfaces`; search should be a secondary, not primary, interaction path.

### CPVoiceControlTemplate
`@MainActor class CPVoiceControlTemplate` (iOS/iPadOS 12.0+, Mac Catalyst 13.1+; inherits `CPTemplate`). Shows a voice-control indicator during audio input; navigation apps **must** show this during voice-based interaction.
- `init(voiceControlStates:)`, `class CPVoiceControlState`
- `activateVoiceControlState(withIdentifier:)`, `activeStateIdentifier`
- `voiceControlStates: [CPVoiceControlState]`
- `backButton`, `leadingNavigationBarButtons`, `trailingNavigationBarButtons`
- iOS 26.4+: up to 2 action buttons plus leading/trailing nav bar buttons.
- Activate the audio session only while voice services are actually active (see Audio Handling).

### CPPointOfInterestTemplate
`@MainActor class CPPointOfInterestTemplate` (iOS/iPadOS 14.0+, Mac Catalyst 14.0+; inherits `CPTemplate`). MapKit-backed map with selectable `CPPointOfInterest` annotations plus a scrollable overlay picker; selecting a POI shows a detail card with secondary info and actions. Handles clustering, selection, zoom/pan automatically. Up to 12 locations shown; iOS 16+ allows a larger pin image for the current selection.
- `init(title: String, pointsOfInterest: [CPPointOfInterest], selectedIndex: Int)`, `class CPPointOfInterest`
- `var pointOfInterestDelegate: (any CPPointOfInterestTemplateDelegate)?`, `protocol CPPointOfInterestTemplateDelegate` — informed of map visible-region changes.
- `var title: String`
- `var pointsOfInterest: [CPPointOfInterest]`, `func setPointsOfInterest(_:selectedIndex:)`, `var selectedIndex: Int`

Push via `pushTemplate(_:animated:completion:)` or add as a `CPTabBarTemplate` tab. Driving-task-app guideline: don't refresh POIs more than once per 60 seconds, and driving-task apps specifically must not be primarily location-finders.

### CPInformationTemplate
`@MainActor class CPInformationTemplate` (iOS/iPadOS 14.0+, Mac Catalyst 14.0+; inherits `CPTemplate`). Shows a bounded list of static labels (single or two columns) plus up to 3 contextual action buttons — e.g., an order summary with Place/Cancel actions, or EV charger info. **Not usable in apps with the audio entitlement.** iOS 16+ adds leading/trailing nav bar buttons.
- `init(title: String, layout: CPInformationTemplateLayout, items: [CPInformationItem], actions: [CPTextButton])`
- `var layout: CPInformationTemplateLayout`, `enum/struct CPInformationTemplateLayout`
- `var title: String`
- `var items: [CPInformationItem]`, `class CPInformationItem`, `class CPInformationRatingItem` (rated content variant)
- `var actions: [CPTextButton]`

Push via `pushTemplate` or present modally via `presentTemplate(_:animated:completion:)`.

### CPContactTemplate
`@MainActor class CPContactTemplate` (iOS/iPadOS 14.0+, Mac Catalyst 14.0+; inherits `CPTemplate`). Displays a person/business: image, title, optional subtitle, up to 4 contextual action buttons. **Only available to apps with communication or navigation entitlements.**
- `init(contact: CPContact)`, `class CPContact`
- `var contact: CPContact`
- Specialized buttons: `CPContactCallButton`, `CPContactMessageButton` (activates Siri + compose-message flow)

Push or present modally the same way as other templates.

### CPAlertTemplate
`@MainActor class CPAlertTemplate` (iOS/iPadOS 12.0+, Mac Catalyst 13.1+; inherits `CPTemplate`). Modal alert: title (with length variants) + one or more buttons. Must be shown via `presentTemplate(_:animated:completion:)` on `CPInterfaceController`; dismissed by user button tap or app's `dismissTemplate(animated:completion:)`.
- `init(titleVariants: [String], actions: [CPAlertAction])`
- `class var maximumActionCount: Int`
- `var titleVariants: [String]`, `var actions: [CPAlertAction]`

### CPActionSheetTemplate
`@MainActor class CPActionSheetTemplate` (iOS/iPadOS 12.0+, Mac Catalyst 13.1+; inherits `CPTemplate`). Modal action sheet with title, message, and ≥2 choice buttons — for initiating tasks or confirming destructive actions. Same present/dismiss pattern as `CPAlertTemplate`.
- `init(title: String?, message: String?, actions: [CPAlertAction])`
- `var title: String?`, `var message: String?`, `var actions: [CPAlertAction]`

### Template availability by app category (from Developer Guide)
Action sheet, Alert, Grid, List, Tab bar: all categories. Voice control: all categories (varying min iOS, iOS 27 for navigation). Contact: communication, navigation, (and driving-task/voice-conversational per table nuance). Information: most non-navigation-map categories. Map: navigation only. Now playing: audio/video (+ communication at iOS 17+). Point of interest / Search: subset of categories (EV charging, fueling, parking, quick-ordering, navigation, public safety, driving-task, voice-conversational per version). Consult the entitlement table; attempting an unsupported template throws at runtime.

Source: https://developer.apple.com/documentation/carplay/cplisttemplate, https://developer.apple.com/documentation/carplay/cpgridtemplate, https://developer.apple.com/documentation/carplay/cptabbartemplate, https://developer.apple.com/documentation/carplay/cpnowplayingtemplate, https://developer.apple.com/documentation/carplay/cpmaptemplate, https://developer.apple.com/documentation/carplay/cpsearchtemplate, https://developer.apple.com/documentation/carplay/cpvoicecontroltemplate, https://developer.apple.com/documentation/carplay/cppointofinteresttemplate, https://developer.apple.com/documentation/carplay/cpinformationtemplate, https://developer.apple.com/documentation/carplay/cpcontacttemplate, https://developer.apple.com/documentation/carplay/cpalerttemplate, https://developer.apple.com/documentation/carplay/cpactionsheettemplate, https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf

---

## Instrument Cluster

### CPInstrumentClusterController
`class CPInstrumentClusterController` (iOS/iPadOS 15.4+, Mac Catalyst 15.4+; inherits `NSObject`; no overview published by Apple for this page). Manages what a navigation app draws into the vehicle's instrument cluster display, created by CarPlay when it determines the app should appear there.
- `var attributedInactiveDescriptionVariants: [NSAttributedString]`
- `var compassSetting: CPInstrumentClusterSetting`
- `var delegate: (any CPInstrumentClusterControllerDelegate)?`
- `var inactiveDescriptionVariants: [String]`
- `var instrumentClusterWindow: UIWindow?`
- `var speedLimitSetting: CPInstrumentClusterSetting`

See Also: `CPInstrumentClusterControllerDelegate`, `CPTemplateApplicationInstrumentClusterScene`, `CPTemplateApplicationInstrumentClusterSceneDelegate`.

**Showing a second map (Dashboard and/or instrument cluster)** — from the Developer Guide: Dashboard support since iOS 13.4, instrument cluster support since iOS 15.4; both work the same way. `CPTemplateApplicationDashboardScene` and `CPTemplateApplicationInstrumentClusterScene` are the relevant `UIScene` subclasses; `CPDashboardController`/`CPDashboardButton` manage Dashboard content and its buttons, `CPInstrumentClusterController` manages the cluster display. Declare support via `CPSupportsDashboardNavigationScene` / `CPSupportsInstrumentClusterNavigationScene` in the manifest, and implement `CPTemplateApplicationDashboardSceneDelegate` / `CPTemplateApplicationInstrumentClusterSceneDelegate`.

**Drawing guidelines for the instrument cluster:** draw a minimal, low-clutter map; show the detailed upcoming route rather than an overview; keep current heading facing up; respect safe areas and light/dark mode (via `contentMode` on the Dashboard/cluster scene). Navigation started through `CPMapTemplate`/`CPNavigationSession` auto-populates maneuver info here. Dashboard supports up to two `CPDashboardButton`s shown when not actively navigating. For the cluster, respond to zoom-capability and compass/speed-limit-display delegate callbacks; override `viewSafeAreaInsetsDidChange` and use `safeAreaLayoutGuide` since the cluster's shape may partially obscure the view.

Source: https://developer.apple.com/documentation/carplay/cpinstrumentclustercontroller, https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf

---

## App Category Integrations

### Music (Audio apps)
Sample app **CarPlay Music** demonstrates a custom UI via `CPNowPlayingTemplate` and `CPListTemplate` (iOS/iPadOS/Mac Catalyst 14.0+). Setup: request the CarPlay **audio entitlement** (`com.apple.developer.carplay-audio`), configure Xcode; create a MusicKit developer token and set it in `AppleMusicAPIController.swift`.

Pattern — build a root tab bar from playlists on connect:
```swift
var tabTemplates = [CPTemplate]()
let listItems = playlists.compactMap { playlist -> CPListItem? in
    let item = CPListItem(text: playlist.name, detailText: "")
    item.handler = { _, completion in
        AppleMusicAPIController.playWithItems(items: playlist.items.compactMap { $0.playbackStoreID })
        completion()
    }
    return item
}
var playlistTemplate: CPListTemplate!
if #available(iOS 15.0, *) {
    let config = CPAssistantCellConfiguration(position: .top, visibility: .always, assistantAction: .playMedia)
    playlistTemplate = CPListTemplate(title: "Playlists", sections: [CPListSection(items: listItems)], assistantCellConfiguration: config)
} else {
    playlistTemplate = CPListTemplate(title: "Playlists", sections: [CPListSection(items: listItems)])
}
playlistTemplate.tabImage = UIImage(systemName: "list.star")
tabTemplates.append(playlistTemplate)
carplayInterfaceController!.setRootTemplate(CPTabBarTemplate(templates: tabTemplates), animated: true, completion: nil)
```
Observe `MPMusicPlayerControllerPlaybackStateDidChange` / `MPMusicPlayerControllerNowPlayingItemDidChange` notifications to keep the Now Playing template in sync. For Siri App Selection, build an `INMediaUserContext`, set `numberOfLibraryItems`/`subscriptionStatus`, and call `becomeCurrent()`.

### Navigation
Sample app **Coastal Roads** (iOS/iPadOS/Mac Catalyst 15.4+, Xcode 15.0+) demonstrates a custom map plus `CPGridTemplate`/`CPListTemplate` alongside `CPMapTemplate`. The root template **must** be a `CPMapTemplate` with no extra UI.
```swift
func interfaceController(_ interfaceController: CPInterfaceController, didConnectWith window: CPWindow, style: UIUserInterfaceStyle) {
    carplayInterfaceController = interfaceController
    carplayInterfaceController!.delegate = self
    window.rootViewController = mainMapViewController
    carWindow = window
    let mapTemplate = CPMapTemplate.coastalRoadsMapTemplate(compatibleWith: mainMapViewController.traitCollection,
        zoomInAction: { self.mainMapViewController.zoomIn() },
        zoomOutAction: { self.mainMapViewController.zoomOut() })
    mapTemplate.mapDelegate = self
    baseMapTemplate = mapTemplate
    installBarButtons()
    interfaceController.setRootTemplate(mapTemplate, animated: true) { success, _ in ... }
}
```
`CPMapTemplateDelegate` customizes pan/preview/trip-start behavior, e.g. `mapTemplate(_:panWith:)`, `mapTemplate(_:selectedPreviewFor:using:)`, `mapTemplate(_:startedTrip:using:)` (the latter calls `startNavigationSession` and begins simulated maneuvers). See the full route-guidance flow under CPMapTemplate above.

### Quick-ordering
Sample app for **quick food ordering** apps (iOS/iPadOS/Mac Catalyst 17.2+, macOS 14.0+, Xcode 15.4+) integrates `CPPointOfInterestTemplate` and `CPListTemplate`. Category-specific rules from the Developer Guide: must be a Quick Service Restaurant flow (drive-thru/pickup), not general retail; simplified ordering only (no full menu — recent orders or favorites capped at 12 items each); maps must show only the app's own QSR locations, not other POIs.

Source: https://developer.apple.com/documentation/carplay/integrating-carplay-with-your-music-app, https://developer.apple.com/documentation/carplay/integrating-carplay-with-your-navigation-app, https://developer.apple.com/documentation/carplay/integrating-carplay-with-your-quick-ordering-app, https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf

---

## Simulator & Testing

**CarPlay window in Xcode Simulator:** Build/run in iOS Simulator, then **Simulator menu → I/O → External Displays → CarPlay** (window stays open afterward for the session). Requires the app to already have CarPlay entitlements. Window is 800×480 px at @2x scale by default.

**Extra navigation-app display options:** before launching Simulator, run:
```bash
defaults write com.apple.iphonesimulator CarPlayExtraOptions -bool YES
```
This unlocks adjustable window width/height/scale to validate map rendering across configurations.

**CarPlay Simulator (standalone / Device Hub)** — per the Developer Guide: a Mac app that connects to a real iPhone over USB and behaves like a car. Starting with Xcode 27 it's built into Device Hub (Open Device Hub → connect iPhone via USB → select it → Device menu → CarPlay Simulator). Prior Xcode versions: download standalone from "Additional Tools for Xcode" → Hardware folder. Apple recommends not relying on Simulator alone — test on a real vehicle or aftermarket head unit too (prefer wireless CarPlay hardware so Xcode debugging and the car connection can coexist).

**Recommended screen-size test matrix** (center display): Minimum 748×456px @2.0x; Standard 800×480px @2.0x; Widescreen 1920×720px @3.0x; Portrait 900×1200px @3.0x (all available as CarPlay Simulator presets).

**Instrument cluster test configurations**: Minimum (3x, 300×200 view/safe area, origin 0,0); Basic (2x, 640×480); Widescreen wide-safe-area (3x, 1920×720 view, 1080×720 safe area, origin 420,0); Widescreen small-safe-area (2x, 1920×720 view, 640×480 safe area, origin 640,120). Use presets "Standard Instrument Cluster" / "Widescreen Instrument Cluster," editable via vehicle configuration "Manage…".

**Testing maneuver/destination/route sharing:** In CarPlay Simulator, use "Navigation" (click to view current/upcoming maneuvers, "Show More" for full sequence, table icons for Route Guidance Updates/Maneuvers/Lane Guidances detail); enable "Share Route Destination Information" under vehicle config "Manage…" to test destination sharing, then inspect via "Destination Information"; choose "Standard Navigation"/"Widescreen Navigation" presets (support route sharing) and inspect via "Route Sharing," which also lets you simulate a vehicle-initiated waypoint or export the route.

Source: https://developer.apple.com/documentation/carplay/using-the-carplay-simulator, https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf

---

## Backward Compatibility (iOS 13 and earlier)

iOS 14 introduced the modern CarPlay-framework templates and new/renamed app categories; apps that must still support iOS 13 and earlier need to pair the legacy framework/entitlement with the modern one.

**Audio apps:**
- iOS 14+: CarPlay framework + `com.apple.developer.carplay-audio`
- iOS 13 and earlier: Media Player framework + `com.apple.developer.playable-content` (deprecated for CarPlay, UI not customizable)
- Dual-support plist:
  ```xml
  <key>com.apple.developer.playable-content</key><true/>
  <key>com.apple.developer.carplay-audio</key><true/>
  ```
- On iOS 14+, if an app supports both frameworks, the CarPlay framework takes precedence.

**Communication apps:**
- iOS 14+: CarPlay framework + `com.apple.developer.carplay-communication`
- iOS 13 and earlier: SiriKit/CallKit, plus deprecated `com.apple.developer.carplay-messaging` and/or `com.apple.developer.carplay-calling` to match supported features
- Dual-support plist:
  ```xml
  <key>com.apple.developer.carplay-communication</key><true/>
  <key>com.apple.developer.carplay-messaging</key><true/>
  ```
- VoIP: target iOS 14+ → support `INStartCallIntent`, `INStartAudioCallIntent`, `INSearchCallHistoryIntent`; targeting iOS 14 or earlier too → also support `INStartCallIntent`.
- Apps that don't adopt the CarPlay framework still function on later iOS via SiriKit/CallKit, just without a customizable CarPlay UI.

Source: https://developer.apple.com/documentation/carplay/supporting-previous-versions-of-ios, https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf (Appendix: Deprecated entitlements)

---

## Developer Guide: Additional Topics

### App categories (full list)
Audio, Communication (SiriKit Messaging and/or VoIP), Driving task, EV charging, Fueling, Navigation, Parking, Public Safety, Quick food ordering, Video, Voice-based conversational. Categories cannot combine except EV charging + fueling. Audio and video apps also work unmodified on **Apple HomeView**. (Automaker apps are a distinct category not covered by the Developer Guide.)

### Guidelines (selected, category-agnostic and per-category)
General: app must be designed primarily around its category's feature; never instruct the user to pick up their iPhone (informational messages about e.g. required login are fine, but no "manipulate your iPhone" wording); all flows must work without touching the iPhone and must be meaningful while driving; no unrelated settings/maintenance features, no gaming/social networking; never show message/text/email contents on the CarPlay screen; use each template only for its intended content type.

Per category highlights: **Audio** — no song lyrics on screen; video-capable audio apps must support AirPlay video. **Communication** — must support short-form text and/or VoIP (not email); text messaging requires `INSendMessageIntent`, `INSearchForMessagesIntent`, `INSetMessageAttributeIntent`; VoIP requires CallKit + `INStartCallIntent`. **Driving task** — must be genuinely drive-helping (not account setup/settings); no UI refresh faster than once/10s; POI refresh no faster than once/60s; not a location-finder app; no non-vehicle use cases; custom maps/real-time video not permitted (templates only). **EV charging / Fueling / Parking** — must provide real functionality beyond a bare list; maps must show only in-category locations. **Public safety** — primarily for firefighter/law-enforcement/ambulance workflows (dispatch, routing, vehicle/location search). **Navigation** — turn-by-turn with upcoming maneuvers; base view is map-only (no overlays/alerts drawn there — use lane guidance via the second-maneuver template instead); templates used only for intended purpose; must offer a panning-mode entry button if panning supported; touch gestures only for pan/zoom/pitch/rotate; must immediately stop guidance when the vehicle's native nav system takes over; voice prompts must coexist with other car audio (e.g. FM radio) without needless activation; maps must be regionally appropriate. **Quick food ordering** — QSR-only, driving-oriented orders; simplified ordering (recents/favorites ≤12 items, no full menu); map restricted to own QSR locations. **Video** — primarily video playback; must support AirPlay video; hidden on vehicles without video support. **Voice-based conversational** — voice-first on launch; audio session open only while actively used; no text/imagery responses.

### Widgets in CarPlay
Supported in CarPlay Ultra, and (iOS 26+) in CarPlay proper. Appear left of CarPlay Dashboard (right side in RHD vehicles); interactive on touchscreen vehicles. App need not be a CarPlay app. Enable via `.supportedFamilies([.systemSmall])`. If unsuitable for driving use, mark `.disfavoredLocations([.carPlay], for: [.systemSmall])` — the widget still appears (grouped under a "not optimized for CarPlay" note in Settings) but with interaction disabled. Users manage visible widgets in Settings → General → CarPlay → [vehicle]. A widget can only deep-link into the app in CarPlay if that app is itself a CarPlay app (via `widgetURL`/`Link`). Removable backgrounds are respected; follow HIG: Widgets for design.

Disfavor a widget when: it's a game or needs heavy interaction (e.g. >6 taps/refreshes to keep refreshing); it's non-functional in-car (e.g. depends on data-protection class A/B content, generally unreadable while the phone is locked — the common CarPlay state); or its primary purpose is just launching a non-CarPlay app.

### Live Activities in CarPlay
Supported with iOS 26+ in CarPlay and CarPlay Ultra; shown in CarPlay Dashboard or as a notification; app need not be a CarPlay app. Enable via `.supplementalActivityFamilies([.small])` (same size as the Apple Watch Smart Stack — existing Watch-compatible Live Activities work as-is). Without small-family support, CarPlay falls back to the Dynamic Island's compact leading/trailing views.

### Notifications
Supported for communication, EV charging, parking, public safety apps (and, since iOS 18.4, driving task apps). Use sparingly — only for things that matter while driving; notifications are generally not read aloud in CarPlay. Route-guidance notifications for navigation apps are handled internally by the CarPlay framework, not the app notification path.
```swift
let authorizationOptions: UNAuthorizationOptions = [.badge, .sound, .alert, .carPlay]
UNUserNotificationCenter.current().requestAuthorization(options: authorizationOptions) { granted, error in ... }
```
Also create a notification category with `allowInCarPlay` and assign its identifier to relevant local/remote notifications. Communication apps: CarPlay notifications may show only sender/group name in title/subtitle — never message contents.

### Assets
Provide 2x/3x and light/dark image variants (enable "CarPlay assets" in Xcode to get the extra image wells). Use SF Symbols for tab bar icons where possible. Build dual-appearance images programmatically with `UIImageAsset`. Get the car's display scale via the `carTraitCollection` trait collection (don't reuse other iPhone-trait-collection values). List image sizing: use `maximumImageSize` on `CPListItem`/`CPListImageRowItem`.

Max sizes (points / 3x px / 2x px): Contact action button 50×50pt / 150×150 / 100×100; Grid icon 40×40pt / 120×120 / 80×80; Now playing action button 20×20pt / 60×60 / 40×40; Tab bar icon 24×24pt / 72×72 / 48×48; Voice control image 150×150pt / 450×450 / 300×300. Navigation maneuver symbol sizing: first maneuver (1 line) 50×50pt; first maneuver (2 lines) 120×50pt; second maneuver (symbol+text) 18×18pt; second maneuver (symbol only) 120×18pt; Dashboard junction image 140×100pt.

### Audio handling
**Playback:** activate the audio session only the instant playback is actually needed (not at app launch) — early activation stops other in-car audio sources (e.g. FM radio) prematurely. **Recording:** generally disallowed while in CarPlay (can disrupt other audio/voice features); exception — navigation and voice-based conversational apps may record, but only alongside the voice control template. **Voice prompts (navigation):** configure session category `AVAudioSessionCategoryPlayback`, mode `AVAudioSessionModeVoicePrompt`, options `AVAudioSessionCategoryOptionInterruptSpokenAudioAndMixWithOthers` + `AVAudioSessionCategoryOptionDuckOthers`; activate (`setActive(true)`) only right before playing a prompt, deactivate (`setActive(false)`) immediately after — don't hold active state more than a few seconds absent playback. Check `promptStyle` before each prompt: `None` → play nothing, `Short` → tone only, `Normal` → full spoken prompt.

### Accessing data while iPhone is locked
CarPlay is frequently used with the iPhone locked. Inaccessible while locked: files protected with `NSFileProtectionComplete` / `NSFileProtectionCompleteUnlessOpen`; Keychain items with `kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly`, `kSecAttrAccessibleWhenUnlocked`, or `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`. Test thoroughly under the locked-phone condition.

### Launching other apps in CarPlay
Use `CPTemplateApplicationScene.open(_:options:completionHandler:)` with a URL (rather than a generic opener) to ensure the target app launches on the CarPlay screen itself.

### Application scene manifest example (navigation app with Dashboard + instrument cluster)
```xml
<key>UIApplicationSceneManifest</key>
<dict>
  <key>CPSupportsDashboardNavigationScene</key><true/>
  <key>CPSupportsInstrumentClusterNavigationScene</key><true/>
  <key>UIApplicationSupportsMultipleScenes</key><true/>
  <key>UISceneConfigurations</key>
  <dict>
    <key>UIWindowSceneSessionRoleApplication</key>
    <array><dict>
      <key>UISceneClassName</key><string>UIWindowScene</string>
      <key>UISceneConfigurationName</key><string>Phone</string>
      <key>UISceneDelegateClassName</key><string>MyAppWindowSceneDelegate</string>
    </dict></array>
    <key>CPTemplateApplicationSceneSessionRoleApplication</key>
    <array><dict>
      <key>UISceneClassName</key><string>CPTemplateApplicationScene</string>
      <key>UISceneConfigurationName</key><string>CarPlay</string>
      <key>UISceneDelegateClassName</key><string>MyAppCarPlaySceneDelegate</string>
    </dict></array>
    <key>CPTemplateApplicationDashboardSceneSessionRoleApplication</key>
    <array><dict>
      <key>UISceneClassName</key><string>CPTemplateApplicationDashboardScene</string>
      <key>UISceneConfigurationName</key><string>CarPlay-Dashboard</string>
      <key>UISceneDelegateClassName</key><string>MyAppCarPlayDashboardSceneDelegate</string>
    </dict></array>
    <key>CPTemplateApplicationInstrumentClusterSceneSessionRoleApplication</key>
    <array><dict>
      <key>UISceneClassName</key><string>CPTemplateApplicationInstrumentClusterScene</string>
      <key>UISceneConfigurationName</key><string>CarPlay-Instrument-Cluster</string>
      <key>UISceneDelegateClassName</key><string>MyAppCarPlayInstrumentClusterSceneDelegate</string>
    </dict></array>
  </dict>
</dict>
```
At launch, also listen for incoming URLs via each scene delegate's `willConnectTo`/`openURLContexts` (URLs may arrive via `UIOpenURLContext`, the app delegate's `configurationForConnectingSceneSession`, or `openURLContexts`).

### Keyboard and list restrictions
Vehicles may disable the keyboard and/or shorten lists while driving; iOS applies this automatically, but apps that need to adapt other UI (e.g. hide a keyboard icon) should observe `CPSessionConfiguration.limitedUserInterfaces`.

### Publishing
Submit through App Store Connect exactly as for any iOS app; ensure compliance with the CarPlay Guidelines before submission.

Source: https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf, https://developer.apple.com/carplay/
