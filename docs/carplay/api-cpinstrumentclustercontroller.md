---
source_url: https://developer.apple.com/documentation/carplay/cpinstrumentclustercontroller
platform: apple-carplay
title: CPInstrumentClusterController
---

# CPInstrumentClusterController

```swift
class CPInstrumentClusterController
```

**Framework:** CarPlay

**Availability:** iOS 15.4+, iPadOS 15.4+, Mac Catalyst 15.4+

## Overview

(No overview description provided on the official documentation page.)

## Inherits From

- `NSObject`

## Conforms To

- `CVarArg`
- `CustomDebugStringConvertible`
- `CustomStringConvertible`
- `Equatable`
- `Hashable`
- `NSObjectProtocol`

## Instance Properties

### `attributedInactiveDescriptionVariants`
```swift
var attributedInactiveDescriptionVariants: [NSAttributedString]
```

### `compassSetting`
```swift
var compassSetting: CPInstrumentClusterSetting
```

### `delegate`
```swift
var delegate: (any CPInstrumentClusterControllerDelegate)?
```

### `inactiveDescriptionVariants`
```swift
var inactiveDescriptionVariants: [String]
```

### `instrumentClusterWindow`
```swift
var instrumentClusterWindow: UIWindow?
```

### `speedLimitSetting`
```swift
var speedLimitSetting: CPInstrumentClusterSetting
```

## See Also

- `CPInstrumentClusterControllerDelegate`
- `CPTemplateApplicationInstrumentClusterScene`
- `CPTemplateApplicationInstrumentClusterSceneDelegate`
