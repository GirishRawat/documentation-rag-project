---
source_url: https://developers.google.com/cars/design/android-auto/apps/incoming-messages
platform: android-auto
title: Incoming messages
---

Incoming messages appear as notifications that slide down from the top of the screen in Android Auto applications.

## When to display notifications

Notifications should appear only when they meet specific criteria:

- The message is significant enough to warrant interrupting the driver
- The content is relevant to the driving context

Certain notification types, like friend requests, are unsuitable for driving scenarios. The system may limit notifications if there are higher-priority items to show.

## Message notification components

**Image and icon**
The notification includes a visual representation of the sender (such as an avatar) alongside the app's badge.

**Text**
Users can select messages to hear them read aloud through text-to-speech functionality. Reply options become available after the message plays.

**Close icon**
A dismiss button allows users to remove the notification from view.

**Sound**
The system handles all audio elements for notifications.
