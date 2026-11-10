---
source_url: https://developer.apple.com/documentation/carplay/cpalerttemplate
platform: apple-carplay
title: CPAlertTemplate
---

# CPAlertTemplate

A template that displays a modal alert.

```swift
@MainActor
class CPAlertTemplate
```

**Framework:** CarPlay

**Availability:** iOS 12.0+, iPadOS 12.0+, Mac Catalyst 13.1+

## Overview

You must present alerts modally by calling the `presentTemplate(_:animated:completion:)` method available on your app's instance of `CPInterfaceController`. The user dismisses the alert by pressing a button, or you can dismiss it by calling the interface controller's `dismissTemplate(animated:completion:)` method.

## Inherits From

- `CPTemplate`

## Conforms To

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

## Creating an Alert Template

### `init(titleVariants:actions:)`
```swift
init(titleVariants: [String], actions: [CPAlertAction])
```
Creates an alert template.

### `maximumActionCount`
```swift
class var maximumActionCount: Int
```
The maximum number of actions allowed in an alert template.

## Getting the Alert Information

### `titleVariants`
```swift
var titleVariants: [String]
```
The array of title variants.

### `actions`
```swift
var actions: [CPAlertAction]
```
The array of actions available on the alert.

## See Also

- `CPActionSheetTemplate`
- `CPAlertAction`
