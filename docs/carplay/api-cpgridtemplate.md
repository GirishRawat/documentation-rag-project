---
source_url: https://developer.apple.com/documentation/carplay/cpgridtemplate
platform: apple-carplay
title: CPGridTemplate
---

A template that displays and manages a grid of items.

**Type:** Class

**Available on:** iOS 12.0, iPadOS 12.0, Mac Catalyst 13.1

## Declaration

```swift
@MainActor class CPGridTemplate
```

### Overview

Use this template to display a grid of items as buttons. When creating the grid template, provide an array of CPGridButton objects. Each button contains a title, an image, and an optional handler that the system invokes after the user taps the button on the CarPlay screen.

When there are more than eight buttons in the array, the template displays only the first eight. When there are more than four buttons, the template balances the display of the buttons betweem two rows.

## Topics

### Creating a Grid Template

- **`init(title: String?, gridButtons: [CPGridButton])`** — Creates a grid template with a title and a set of buttons.
- **`class CPGridButton`** — A menu item button displayed on a grid template.

### Getting the Grid Title

- **`var title: String`** — The title shown in the grid template’s navigation bar.

### Getting the Grid Buttons

- **`var gridButtons: [CPGridButton]`** — The array of grid buttons displayed on the template.

### Instance Methods

- **`func updateGridButtons([CPGridButton])`**
- **`func updateTitle(String)`**

### Type Properties

- **`class var maximumGridButtonImageSize: CGSize`** — The expected image size for your @c CPGridButton.

## Relationships

**Inherits From:** `CPTemplate`

**Conforms To:** `CPBarButtonProviding`, `CVarArg`, `CustomDebugStringConvertible`, `CustomStringConvertible`, `Equatable`, `Hashable`, `NSCoding`, `NSObjectProtocol`, `NSSecureCoding`, `Sendable`, `SendableMetatype`
