---
source_url: https://developer.apple.com/documentation/carplay/supporting-previous-versions-of-ios
platform: apple-carplay
title: Supporting Previous Versions of iOS
---

Supporting Previous Versions of iOS

## Overview

This article explains how to make CarPlay-enabled apps compatible with older iOS versions (iOS 13 and earlier) while supporting iOS 14 and later features.

iOS 14+ introduces new CarPlay templates and app categories. Some new categories supersede existing ones (audio, communication). Use proper combinations of frameworks and entitlements for cross-version compatibility.

## Audio Apps Backward Compatibility

- **iOS 14+:** Use the CarPlay framework with the `com.apple.developer.carplay-audio` entitlement.
- **iOS 13 and earlier:** Use the Media Player framework with the `com.apple.developer.playable-content` entitlement.

For compatibility with both versions, include both entitlements:

```xml
<key>com.apple.developer.playable-content</key>
<true/>
<key>com.apple.developer.carplay-audio</key>
<true/>
```

## Communication Apps Backward Compatibility

- **iOS 14+:** Use the CarPlay framework with the `com.apple.developer.carplay-communication` entitlement.
- **iOS 13 and earlier:** Use SiriKit or CallKit frameworks.

For messaging apps supporting both versions:

```xml
<key>com.apple.developer.carplay-communication</key>
<true/>
<key>com.apple.developer.carplay-messaging</key>
<true/>
```

### VoIP Support

- Target iOS 14+: Support `INStartCallIntent`, `INStartAudioCallIntent`, `INSearchCallHistoryIntent`.
- Target iOS 14 or earlier: Also support `INStartCallIntent`.

> Users can interact with your app in iOS 13 and earlier without a custom CarPlay UI when using the CarPlay framework.

---

Note: this page was reconstructed from a partial fetch of Apple's documentation (the live page may include additional detail not captured here, such as further app-category comparisons).
