---
source_url: https://developer.apple.com/documentation/carplay/cpinformationtemplate
platform: apple-carplay
title: CPInformationTemplate
---

# CPInformationTemplate

A template that provides information for a point of interest, food order, parking location, or charging location.

```swift
@MainActor
class CPInformationTemplate
```

**Framework:** CarPlay

**Availability:** iOS 14.0+, iPadOS 14.0+, Mac Catalyst 14.0+

## Overview

An information template displays a list of items, and up to three actions the user can perform.

You use an information template to display informative, actionable content to the user. For example, you might display a summary of the user's food order, and provide actions to place or cancel the order.

When creating an information template, you populate the list with an array of `CPInformationItem` objects, and provide any contextual actions as an array of `CPTextButton` objects. The template then arranges the list's items using your choice of layout — see `CPInformationTemplateLayout` for more information.

To display an information template, call your interface controller's `pushTemplate(_:animated:completion:)` method to push it onto the navigation hierarchy, or `presentTemplate(_:animated:completion:)` to present it modally.

> **Note:** You can't use `CPInformationTemplate` in apps with the audio entitlement.

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

## Creating an Information Template

### `init(title:layout:items:actions:)`
```swift
init(title: String, layout: CPInformationTemplateLayout, items: [CPInformationItem], actions: [CPTextButton])
```
Creates an information template that displays the provided items using the chosen layout.

## Accessing the Layout

### `layout`
```swift
var layout: CPInformationTemplateLayout
```
The layout that the template uses to arrange its items.

### `CPInformationTemplateLayout`
The layout that an information template uses to arrange its items.

## Managing the Title

### `title`
```swift
var title: String
```
The template's title.

## Managing the Items

### `items`
```swift
var items: [CPInformationItem]
```
The items that the template displays.

### `CPInformationItem`
A data object that provides content for an information template.

### `CPInformationRatingItem`
A data object that provides rated content for an information template.

## Managing the Actions

### `actions`
```swift
var actions: [CPTextButton]
```
The actions that the template displays.

## See Also

- `CPPointOfInterestTemplate`
- `CPTextButton`
- Integrating CarPlay with your quick-ordering app
