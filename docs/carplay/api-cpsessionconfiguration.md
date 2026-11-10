---
source_url: https://developer.apple.com/documentation/carplay/cpsessionconfiguration
platform: apple-carplay
title: CPSessionConfiguration
---

An object that provides vehicle properties and configuration for the CarPlay environment.

**Type:** Class

**Available on:** iOS 12.0, iPadOS 12.0, Mac Catalyst 13.1

## Declaration

```swift
class CPSessionConfiguration
```

### Overview

You use a session configuration to determine any user interface limits the vehicle imposes, such as keyboard display and list length, and the content style the vehicle selects according to the ambient light level.

## Topics

### Creating a Session Configuration

- **`init(delegate: any CPSessionConfigurationDelegate)`** — Creates a session configuration with a delegate.
- **`protocol CPSessionConfigurationDelegate`** — A protocol for receiving notifications about changes to vehicle properties and configuration.

### Managing the Delegate

- **`var delegate: (any CPSessionConfigurationDelegate)?`** — An object that serves as the delegate to the session configuration.

### Getting the Content Style

- **`var contentStyle: CPContentStyle`** — The content style that the vehicle selects.
- **`struct CPContentStyle`** — The types of content style that the vehicle allows.

### Getting the Limits

- **`var limitedUserInterfaces: CPLimitableUserInterface`** — A bit mask value that indicates the user interface limits.
- **`struct CPLimitableUserInterface`** — The types of limitable user interface elements.

### Instance Properties

- **`var supportsVideoPlayback: Bool`** — The connected CarPlay system supports video playback.

## Relationships

**Inherits From:** `NSObject`

**Conforms To:** `CVarArg`, `CustomDebugStringConvertible`, `CustomStringConvertible`, `Equatable`, `Hashable`, `NSObjectProtocol`
