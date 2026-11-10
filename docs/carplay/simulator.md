---
source_url: https://developer.apple.com/documentation/carplay/using-the-carplay-simulator
platform: apple-carplay
title: Using the CarPlay Simulator
---

Using the CarPlay Simulator

Configure Simulator to run and debug your CarPlay-enabled app.

## Overview

Simulator provides the ability to run your CarPlay-enabled app in a second window. The window behaves as the vehicle's primary CarPlay display, and you can interact with it like you would a real CarPlay system. Simulator provides additional options for navigation apps that you can enable to check your map content at various screen sizes and resolutions.

Don't use Simulator as your sole method of testing. Apple recommends that you also test in a vehicle or aftermarket system. If possible, use a device that supports wireless CarPlay. This allows you to use Xcode to debug your app while it's running in a physical CarPlay environment.

### Open the CarPlay Simulator

Simulator doesn't open the CarPlay window by default, but does keep it open for the rest of the session after you activate it. Simulator can't display your CarPlay-enabled app unless it has the necessary entitlements. See [Requesting CarPlay Entitlements](https://developer.apple.com/documentation/carplay/requesting-carplay-entitlements) for more information.

To open the CarPlay window:

1. In Xcode, build and run your project using the iOS simulator.
2. From the Simulator menu bar, choose I/O > External Displays > CarPlay.

The CarPlay window is 800 x 480 pixels and uses a display scale of @2x, which represents the common configuration of many CarPlay systems.

### Enable Additional Options for Navigation Apps

If you're developing a CarPlay-enabled navigation app, enable CarPlay's additional options in Simulator, which allows you to change the window's width, height, and scale. Use this flexibility to ensure your map content renders in all recommended configurations.

Before launching Simulator, open Terminal and enter the following command:

```bash
defaults write com.apple.iphonesimulator CarPlayExtraOptions -bool YES
```

Apple recommends that you test your CarPlay-enabled app using the following configurations, at a minimum:
