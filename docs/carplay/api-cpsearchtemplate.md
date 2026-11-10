---
source_url: https://developer.apple.com/documentation/carplay/cpsearchtemplate
platform: apple-carplay
title: CPSearchTemplate
---

A template that provides the ability to search for a destination and see a list of search results.

**Type:** Class

**Available on:** iOS 12.0, iPadOS 12.0, Mac Catalyst 13.1

## Declaration

```swift
@MainActor class CPSearchTemplate
```

### Overview

Use this template to provide the ability to search for a destination. When CarPlay displays the template, the user sees a search field, a Cancel button, and a localized keyboard. The template also shows the list of search results after your app completes the search request.

> **Note:**  Some vehicles may limit the display of the keyboard. Check the limitedUserInterfaces property to determine whether there are limits.

To use a search template, create an instance of CPSearchTemplate and set its delegate to an object that conforms to the CPSearchTemplateDelegate protocol. Push the template onto the navigation hierarchy by calling pushTemplate(_:animated:completion:) on the interface controller. This presents the search template to the user.

As the user enters text into the search field, the system calls the delegate method searchTemplate(_:updatedSearchText:completionHandler:), indicating that your app should retrieve the search result. After retrieving the results, call `completionHandler` to return an array of CPListItem objects—one list item for each search result item.

When the user selects an item from the search result, the system calls the searchTemplate(_:selectedResult:completionHandler:) method on the delegate object. The delegate performs any necessary operations to process the selected item, then calls the completion handler to let the system know it can continue.

## Topics

### Providing a Search Template Delegate

- **`var delegate: (any CPSearchTemplateDelegate)?`** — The object that serves as the search template’s delegate.
- **`protocol CPSearchTemplateDelegate`** — The interface for an object that serves as the search template’s delegate.

## Relationships

**Inherits From:** `CPTemplate`

**Conforms To:** `CVarArg`, `CustomDebugStringConvertible`, `CustomStringConvertible`, `Equatable`, `Hashable`, `NSCoding`, `NSObjectProtocol`, `NSSecureCoding`, `Sendable`, `SendableMetatype`
