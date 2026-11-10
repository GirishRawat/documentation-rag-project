---
source_url: https://developer.apple.com/documentation/carplay
platform: apple-carplay
title: CarPlay
---

CarPlay

Integrate CarPlay in apps related to audio, communication, navigation, parking, EV charging, food ordering, and more.

**Framework:** CarPlay
**Available on:** iOS 12.0+, iPadOS 12.0+, Mac Catalyst 14.0+

## Overview

Use the CarPlay framework to create an in-car experience for your app. The framework provides templates for building a version of your app's interface suitable for presentation on a vehicle's displays. Add the templates you want to your app and customize them to suit your content. You control the content of the templates, but the framework controls certain aspects of the template interface elements, such as the touch target size, font size, font color, and highlights.

CarPlay features run when the current device supports CarPlay and when that device is connected to an appropriately equipped vehicle. CarPlay handles variations in vehicle systems, letting you focus on your content. When a person runs your app from their vehicle, the system generates and hosts your app's interface for you. If the device doesn't support CarPlay, the system doesn't try to access your app's CarPlay features.

You can use other technologies to drive portions of your app's CarPlay interface. Messaging apps can include [SiriKit](https://developer.apple.com/documentation/SiriKit) support to allow someone to read or send messages. VoIP apps can use [CallKit](https://developer.apple.com/documentation/CallKit) to manage incoming and outgoing calls, often in combination with SiriKit call support. Navigation apps can include [MapKit](https://developer.apple.com/documentation/MapKit) support.
