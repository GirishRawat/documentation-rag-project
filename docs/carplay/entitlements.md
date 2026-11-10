---
source_url: https://developer.apple.com/documentation/carplay/requesting-carplay-entitlements
platform: apple-carplay
title: Requesting CarPlay Entitlements
---

Requesting CarPlay Entitlements

Configure your CarPlay-enabled app with the entitlements it requires.

## Overview

To integrate with CarPlay, you must request the appropriate entitlement for your app's category at [developer.apple.com/contact/carplay](https://developer.apple.com/contact/carplay) and agree to the CarPlay Entitlement Addendum. Apple reviews each application using predefined criteria. If your request meets the criteria, Apple adds the entitlement to your developer account using managed capabilities. For more information, see [Apple's developer account help](https://help.apple.com/developer-account/#/dev38c81d4cd).

After you receive the entitlement, you need to configure your Xcode project to use it, which involves several steps. You create or update an App ID, generate a provisioning profile, and add an `Entitlements.plist` file to your target. Your project's code signing settings also require minor changes.
