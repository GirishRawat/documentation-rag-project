---
source_url: https://developer.apple.com/documentation/carplay/cpvoicecontroltemplate
platform: apple-carplay
title: CPVoiceControlTemplate
---

# CPVoiceControlTemplate

A template that displays a voice control indicator during audio input.

```swift
@MainActor
class CPVoiceControlTemplate
```

**Framework:** CarPlay

**Availability:** iOS 12.0+, iPadOS 12.0+, Mac Catalyst 13.1+

## Overview

CarPlay navigation apps must show a voice control indicator during audio input by presenting a voice control template. When creating the template, provide one or more `CPVoiceControlState` objects. To switch between states, call the `activateVoiceControlState(withIdentifier:)` method.

## Inherits From

- `CPTemplate`

## Conforms To

- `CPBarButtonProviding`
- `CVarArg`
- `CustomDebugStringConvertible`
- `CustomStringConvertible`
- `Equatable`
- `Hashable`
- `NSCoding`
- `NSObjectProtocol`
- `NSSecureCoding`
- `Sendable`
- `SendableMetatype`

## Creating a Voice Control Template

### `init(voiceControlStates:)`
Creates a voice control template.

### `CPVoiceControlState`
An object that describes a state the voice control template can display.

## Activating a State

### `activateVoiceControlState(withIdentifier:)`
Activates the voice control state with the specified identifier.

### `activeStateIdentifier`
The identifier of the currently active voice control state.

## Getting Available States

### `voiceControlStates`
The array of `CPVoiceControlState` objects this template can display.

## Instance Properties

- `backButton` — The back button displayed in the navigation bar.
- `leadingNavigationBarButtons` — The leading (left) buttons displayed in the navigation bar.
- `trailingNavigationBarButtons` — The trailing (right) buttons displayed in the navigation bar.

## See Also

- Integrating CarPlay with your navigation app
- `CPTemplateApplicationDashboardScene`
- `CPTemplateApplicationDashboardSceneDelegate`
- `CPMapTemplate`
- `CPSearchTemplate`
