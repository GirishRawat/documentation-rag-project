---
source_url: https://developers.google.com/cars/design/android-auto/apps/saved-messages
platform: android-auto
title: Notification Center Messages in Android Auto
---

## Overview

Messages appear both as temporary notifications and persistently within the Notification Center, where drivers can engage with them at their convenience.

## Notification Center Display

Messages in the Notification Center feature these characteristics:

- Presented as individual cards
- Arranged chronologically with newest messages appearing first
- Limited in quantity to minimize driver distraction

The system manages list length by removing older messages to accommodate new ones, though all dismissed messages remain available on the phone.

## Message Card Structure

**Visual Elements**

An avatar image showing the message source accompanies the application icon.

**Interactive Content Area**

When selected, messages are played using text-to-speech (TTS). Following playback, the system presents reply options for the user to continue the conversation.
