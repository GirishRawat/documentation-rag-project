---
source_url: https://developer.apple.com/documentation/carplay/cptemplateapplicationdashboardscene
platform: apple-carplay
title: CPTemplateApplicationDashboardScene
---

# CPTemplateApplicationDashboardScene

A CarPlay scene that controls your app's dashboard navigation window.

```swift
class CPTemplateApplicationDashboardScene
```

**Framework:** CarPlay

**Availability:** iOS 13.4+, iPadOS 13.4+, Mac Catalyst 13.4+

## Overview

A dashboard scene manages the display of your navigation app's dashboard window on the CarPlay Dashboard, and notifies its delegate — an object that conforms to `CPTemplateApplicationDashboardSceneDelegate` — about scene life-cycle events. Use the dashboard controller the scene provides to supply shortcut buttons to display when there's no active navigation session, further customizing your app's presence on the CarPlay Dashboard.

You don't create an instance of the dashboard scene directly. Instead, you specify the name of the class as part of the CarPlay Dashboard scene configuration that you add to your `Info.plist` file — see the example below — or that you return from your app delegate's `application(_:configurationForConnecting:options:)` method.

```plist
<key>CPTemplateApplicationDashboardSceneSessionRoleApplication</key>
<array>
    <dict>
        <!-- Specify the name of the CarPlay Dashboard scene class. -->
        <key>UISceneClassName</key>
        <string>CPTemplateApplicationDashboardScene</string>
        <key>UISceneConfigurationName</key>
        <string>MyCarPlayDashboardSceneConfiguration</string>
        <key>UISceneDelegateClassName</key>
        <string>MyCarPlayDashboardSceneDelegate</string>
    </dict>
</array>
```

## Inherits From

- `UIScene`

## Conforms To

- `CVarArg`
- `CustomDebugStringConvertible`
- `CustomStringConvertible`
- `Equatable`
- `Hashable`
- `NSObjectProtocol`
- `NSTouchBarProvider`
- `Sendable`
- `SendableMetatype`
- `UIActivityItemsConfigurationProviding`
- `UIPasteConfigurationSupporting`
- `UIResponderStandardEditActions`
- `UIUserActivityRestoring`

## Responding to the Dashboard Scene Life Cycle

### `delegate`
The object that serves as the dashboard scene's delegate.

### `CPTemplateApplicationDashboardSceneDelegate`
The protocol defining the methods used to respond to dashboard scene life-cycle events.

## Accessing the Dashboard Controller

### `dashboardController`
The controller you use to customize the dashboard, including supplying shortcut buttons shown when there's no active navigation session.

### `CPDashboardController`
The object that manages the content for the CarPlay Dashboard.

## Accessing the Dashboard Window

### `dashboardWindow`
The window the dashboard scene displays its content in.

## See Also

- Integrating CarPlay with your navigation app
- `CPTemplateApplicationDashboardSceneDelegate`
- `CPMapTemplate`
- `CPSearchTemplate`
- `CPVoiceControlTemplate`
