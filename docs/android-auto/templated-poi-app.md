---
source_url: https://developer.android.com/training/cars/apps/poi
platform: android-auto
title: Build a point of interest app
---

This guide details the different features of the Car App Library
that you can use to implement the functionality of your point of interest (POI)
app.

## Declare category support in your manifest

Your app needs to declare the `androidx.car.app.category.POI`
car app category in the intent filter of its `CarAppService`.

> **Important:** Beginning with Car App Library version 1.3, the `androidx.car.app.category.PARKING` and `androidx.car.app.category.CHARGING` car app categories are deprecated. Use the `androidx.car.app.category.POI` category instead.

The following example shows how to declare the app category:

```xml
<application>
    ...
   <service
       ...
        android:name=".MyCarAppService"
        android:exported="true">
      <intent-filter>
        <action android:name="androidx.car.app.CarAppService" />
        <category android:name="androidx.car.app.category.POI"/>
      </intent-filter>
    </service>
    ...
<application>
```

## Access the map templates

POI apps can access the `PlaceListMapTemplate` and `MapWithContentTemplate`.

The `PlaceListMapTemplate` is specifically designed for showing a list of the
POIs alongside a map that is rendered by the host.

The `MapWithContentTemplate` can be used to display lists and other types of
content alongside a map that is rendered by your app. See
Draw maps for more details on using this template.

To access these templates, your app needs to declare the
`androidx.car.app.MAP_TEMPLATES` permission in its `AndroidManifest.xml` file:

```xml
<manifest ...>
  ...
  <uses-permission android:name="androidx.car.app.MAP_TEMPLATES"/>
  ...
</manifest>
```

> **Note:** The `PlaceListMapTemplate` is available for use only by apps declaring the `androidx.car.app.category.POI` category or the deprecated `androidx.car.app.category.PARKING` or `androidx.car.app.category.CHARGING` categories. For navigation apps, see "Access the navigation templates" in Build navigation apps for cars.

## Refresh PlaceListMapTemplate content

You can provide drivers a way to refresh content by tapping a button while
browsing lists of places built with `PlaceListMapTemplate`.
Implement the `OnContentRefreshListener` interface's
`onContentRefreshRequested` method, and use
`PlaceListMapTemplate.Builder.setOnContentRefreshListener`
to set the listener on the template to enable list refresh.

The following snippet shows how to set the listener on the template:

```kotlin
return PlaceListMapTemplate.Builder()
    // ...
    .setOnContentRefreshListener {
        // Execute any desired logic
        // ...
        // Then call invalidate() so onGetTemplate() is called again
        invalidate()
    }
    .build()
```

The refresh button is only shown in the header of the
`PlaceListMapTemplate` if the listener has a value.

When the user clicks the refresh button, the `onContentRefreshRequested`
method of your `OnContentRefreshListener` implementation is called. Within
`onContentRefreshRequested`, call the `Screen.invalidate`
method. The host then calls back into your app's `Screen.onGetTemplate`
method to retrieve the template with the refreshed content. See Refresh the
contents of a template for more information about refreshing templates. As long
as the next template returned by `onGetTemplate` is of the same type, it is
counted as a refresh and does not count toward the template quota.

## Integrate with Gemini or Google Assistant using App Actions

Voice-enable your POI app using Gemini or Google Assistant to let users search
for points of interest by asking things like, *"Hey Google, find nearby charging
stations on ExampleApp"*. For detailed instructions, see
App Actions for Cars.
