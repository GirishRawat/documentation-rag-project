---
source_url: https://developer.apple.com/documentation/carplay/integrating-carplay-with-your-music-app
platform: apple-carplay
title: Integrating CarPlay with Your Music App
---

Integrating CarPlay with Your Music App

## Overview

CarPlay Music is a sample music app demonstrating how to display a custom UI from a CarPlay-enabled vehicle. It integrates with the CarPlay framework by implementing `CPNowPlayingTemplate` and `CPListTemplate`.

**Platform Support:** iOS 14.0+, iPadOS 14.0+, Mac Catalyst 14.0+

## Configuration Steps

### 1. Request CarPlay Entitlements

Complete the steps in "Requesting CarPlay Entitlements" to request the CarPlay audio entitlement and configure the Xcode project.

### 2. Create a MusicKit Developer Token

- Create a key and developer token for the MusicKit service.
- Update the `developerToken` variable in `AppleMusicAPIController.swift`.

## Key Implementation Details

### Handle Communication with CarPlay

Set the root template in response to CarPlay connections:

```swift
var tabTemplates = [CPTemplate]()

if let playlists = MediaPlayerUtilities.searchForPlaylistsInLocalLibrary(withPredicate: nil) {
    let listItems = playlists.compactMap { (playlist) -> CPListItem? in
        let listItem = CPListItem(text: playlist.name, detailText: "")
        listItem.handler = { playlistItem, completion in
            AppleMusicAPIController.playWithItems(items: playlist.items.compactMap({ (item) -> String? in
                return item.playbackStoreID
            }))
            completion()
        }
        return listItem
    }

    var playlistTemplate: CPListTemplate!
    if #available(iOS 15.0, *) {
        let configuration = CPAssistantCellConfiguration(position: .top, visibility: .always, assistantAction: .playMedia)
        playlistTemplate = CPListTemplate(title: "Playlists", sections: [CPListSection(items: listItems)], assistantCellConfiguration: configuration)
    } else {
        playlistTemplate = CPListTemplate(title: "Playlists", sections: [CPListSection(items: listItems)])
    }
    playlistTemplate.tabImage = UIImage(systemName: "list.star")
    tabTemplates.append(playlistTemplate)
}

self.carplayInterfaceController!.setRootTemplate(CPTabBarTemplate(templates: tabTemplates), animated: true, completion: nil)
```

### Listen for Music Player Changes

Subscribe to playback state and now playing item notifications:

```swift
self.playbackObserver = NotificationCenter.default.addObserver(
    forName: .MPMusicPlayerControllerPlaybackStateDidChange,
    object: nil,
    queue: .main) { notification in
    MemoryLogger.shared.appendEvent("MPMusicPlayerControllerPlaybackStateDidChange: \(MPMusicPlayerController.applicationQueuePlayer.playbackState)")
}

self.nowPlayingItemObserver = NotificationCenter.default.addObserver(
    forName: .MPMusicPlayerControllerNowPlayingItemDidChange,
    object: nil,
    queue: .main) { notification in
    MemoryLogger.shared.appendEvent("MPMusicPlayerControllerNowPlayingItemDidChange")
}
```

## Siri App Selection

Declare your app as eligible for App Selection to improve Siri media interactions:

```swift
let context = INMediaUserContext()
context.numberOfLibraryItems = MPMediaQuery.songs().items?.count
AppleMusicAPIController.sharedController.prepareForRequests { (success) in
    context.subscriptionStatus = success ? .subscribed : .notSubscribed
    context.becomeCurrent()
}
```

---

Note: this page was reconstructed from a partial fetch of Apple's documentation; some sections of the live sample-code walkthrough may not be captured here.
