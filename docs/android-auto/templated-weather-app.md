---
source_url: https://developer.android.com/training/cars/apps/weather
platform: android-auto
title: Build a weather app
---

Weather apps let users see relevant weather information related to their current
location or along their route. Weather apps can also provide navigation
capabilities — see Build navigation apps for cars for more details on
building navigation apps.

> **Design guidelines:** Refer to Weather apps for UX guidance specific to weather apps.

## Declare the weather category in your manifest

Your app must declare the `androidx.car.app.category.WEATHER`
car app category in the intent filter of its `CarAppService`.

```xml
<application>
    ...
   <service
       ...
        android:name=".MyCarAppService"
        android:exported="true">
      <intent-filter>
        <action android:name="androidx.car.app.CarAppService" />
        <category android:name="androidx.car.app.category.WEATHER"/>
      </intent-filter>
    </service>
    ...
<application>
```

### Declare navigation support

If your app can also be used for navigation, it must also follow the
guidance found at Declare navigation support in your manifest when
declaring its category. The intent filter used to declare your app's category
should include both categories:

```xml
<intent-filter>
  <action android:name="androidx.car.app.CarAppService" />
  <category android:name="androidx.car.app.category.WEATHER"/>
  <category android:name="androidx.car.app.category.NAVIGATION"/>
</intent-filter>
```

## Implement your app's functionality

To implement your app, refer to Using the Android for Cars App Library on
how Car App Library apps are built. Also, be sure to familiarize yourself with
the Car app quality guidelines for weather apps, as your app will be
reviewed against these guidelines.

### Draw maps

Weather apps can access the `MapWithContentTemplate`, which can be used to
display lists and other types of content alongside a map that is rendered by
your app. See Draw maps for more details on using this template.

> **Important:** Keep the Weather Functionality quality guidelines in mind when determining what to render on a map

To access the template, your app needs to declare either the
`androidx.car.app.MAP_TEMPLATES` or `androidx.car.app.NAVIGATION_TEMPLATES`
permission in its `AndroidManifest.xml` file:

```xml
<manifest ...>
  ...
  <!-- Use the MAP_TEMPLATES permission if your app doesn't provide navigation functionality -->
  <uses-permission android:name="androidx.car.app.MAP_TEMPLATES"/>

  <!-- Use the NAVIGATION_TEMPLATES permission if your app provides navigation functionality -->
  <uses-permission android:name="androidx.car.app.NAVIGATION_TEMPLATES"/>
  ...
</manifest>
```

> **Caution:** Don't include both the `androidx.car.app.MAP_TEMPLATES` and the `androidx.car.app.NAVIGATION_TEMPLATES` permissions in your manifest, or your app will be rejected during review.
