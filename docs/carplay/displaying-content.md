---
source_url: https://developer.apple.com/documentation/carplay/displaying-content-in-carplay
platform: apple-carplay
title: Displaying Content in CarPlay
---

Displaying Content in CarPlay

Use scenes to present your app's content on the vehicle's built-in screen.

## Overview

A scene manages your CarPlay-enabled app's user interface, including the window that CarPlay displays on the vehicle's screen. Navigation apps are the only app category that have access to this window, and use it to draw their map content. All other categories of apps use only the scene's interface controller to manage their user interface.

As CarPlay manages your app's scene, you provide a scene delegate — an object that conforms to the `CPTemplateApplicationSceneDelegate` protocol — that the system notifies about scene life cycle events. CarPlay creates your app's scene and scene delegate when the user launches your app.
