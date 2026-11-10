---
source_url: https://developers.google.com/cars/design/android-auto/apps/voice-messaging
platform: android-auto
title: Android Auto Messaging Design Guide
---

## Overview

Voice-based messaging allows drivers to keep their eyes on the road while communicating. The platform standardizes how messaging applications function, supporting text-to-speech conversion for SMS and email content.

## Interaction Model

Message notifications arrive as animated elements from the display's top edge. Users can either respond immediately or defer engagement until a safer driving moment. Dismissed messages remain accessible through system notifications and the notification center, as well as the connected phone device.

Drivers access messages via:

- Notifications
- Notification Center

## Conversational Flow

The system enables users to play and respond to messages through a unified process. Voice interactions follow specific patterns that the system recognizes.

### Voice Reply Example

The typical interaction sequence demonstrates how drivers compose and send responses:

| Speaker | Response |
|---|---|
| Driver | "Reply!" |
| System | "What's the message?" |
| Driver | [Speaks message content] |
| System | [Confirms message text and recipient] |
| Driver | "Yes!" |
| System | [Confirms delivery] |
