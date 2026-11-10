---
source_url: https://developer.apple.com/documentation/carplay/cpactionsheettemplate
platform: apple-carplay
title: CPActionSheetTemplate
---

# CPActionSheetTemplate

A template that displays a modal action sheet.

```swift
@MainActor
class CPActionSheetTemplate
```

**Framework:** CarPlay

**Availability:** iOS 12.0+, iPadOS 12.0+, Mac Catalyst 13.1+

## Overview

You must present action sheets modally by calling the `presentTemplate(_:animated:completion:)` method available on your app's instance of `CPInterfaceController`. The user dismisses the action sheet by pressing a button, or you can dismiss it by calling the interface controller's `dismissTemplate(animated:completion:)` method.

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

## Creating an Action Sheet Template

### `init(title:message:actions:)`
```swift
init(title: String?, message: String?, actions: [CPAlertAction])
```
Creates an action sheet template.

## Getting Action Sheet Template Information

### `title`
```swift
var title: String?
```
The title of the action sheet.

### `message`
```swift
var message: String?
```
The descriptive message providing details about the reason for displaying the action sheet.

### `actions`
```swift
var actions: [CPAlertAction]
```
The list of actions available on the action sheet.

## See Also

- `CPAlertTemplate`
- `CPAlertAction`
