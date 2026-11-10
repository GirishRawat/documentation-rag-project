---
source_url: https://developer.android.com/training/cars/testing/emulator
platform: android-auto
title: Test using the Android Automotive OS emulator
---

You can use the [Android Emulator](https://developer.android.com/studio/run/emulator) to test how your
app runs on Android Automotive OS.

## Add system images

Before you can create Android Automotive OS virtual devices, you need to add
system images through the Android Studio [SDK Manager](https://developer.android.com/studio/intro/update#sdk-manager).

### Add generic system images

Android Studio includes generic system images for Android Automotive OS that you
can use to test your app and which you should use when [taking screenshots for
Google Play](https://developer.android.com/training/cars/distribute#opt_in). All of these images include:

- [Google Play services](https://developer.android.com/training/cars/platforms/automotive-os/google-play/google-services)
- [Google Automotive App Host](https://play.google.com/store/apps/details?id=com.google.android.apps.automotive.templates.host) *except the API 28 image, as the host is only available on devices running API
  29 or higher*

> **Important:** For system images without the Google Play Store, the version of Google Play services and the Google Automotive App Host available on an image is fixed. To update these apps, check for new versions of the image.

> **Caution:** Some images are only available for download when using an [Android
> Studio preview](https://developer.android.com/studio/preview) release, as noted in the *Availability* column. Once downloaded, you can use them in an Android Studio stable release.

Available generic system images include (non-exhaustive, API level / architecture / features / availability):

| Name | API Level | Architecture | Features | Availability |
|---|---|---|---|---|
| Automotive Intel x86 Atom System Image | 28 | x86 | Google Play Store | Android Studio preview |
| Automotive with Play Store Intel x86 Atom System Image | 29 | x86 | Google Play Store | Android Studio preview |
| Automotive with Play Store Intel x86_64 Atom System Image | 30 | x86 | Google Play Store | Android Studio preview |
| Automotive with Play Store ARM 64 v8a System Image | 32 | ARM | Google Play Store | Android Studio preview |
| Automotive with Play Store Intel x86_64 Atom System Image | 32 | x86 | Google Play Store | Android Studio preview |
| Automotive Distant Display with Google APIs arm64-v8a System Image | 32 | ARM | — | Android Studio preview |
| Automotive Distant Display with Google APIs x86_64 System Image | 32 | x86 | — | Android Studio preview |
| Automotive Distant Display with Google Play arm64-v8a System Image | 32 | ARM | Google Play Store | Android Studio preview |
| Automotive Distant Display with Google Play x86_64 System Image | 32 | x86 | Google Play Store | Android Studio preview |
| Android Automotive with Google APIs ARM 64 v8a System Image | 33 | ARM | — | Android Studio stable |
| Android Automotive with Google APIs Intel x86_64 Atom System Image | 33 | x86 | — | Android Studio stable |
| Automotive Distant Display with Google Play arm64-v8a System Image | 33 | ARM | Google Play Store | Android Studio stable |
| Automotive Distant Display with Google Play x86_64 System Image | 33 | x86 | Google Play Store | Android Studio stable |
| Android Automotive with Google APIs arm64-v8a System Image | 34-ext9 | ARM | Compatibility mode (revision 3+), Audio while driving (revision 5+) | Android Studio stable |
| Android Automotive with Google APIs x86_64 System Image | 34-ext9 | x86 | Compatibility mode (revision 3+), Audio while driving (revision 5+) | Android Studio stable |
| Android Automotive with Google Play arm64-v8a System Image | 34-ext9 | ARM | Google Play Store, Compatibility mode (revision 2+), Audio while driving (revision 4+) | Android Studio stable |
| Android Automotive with Google Play x86_64 System Image | 34-ext9 | x86 | Google Play Store, Compatibility mode (revision 2+), Audio while driving (revision 4+) | Android Studio stable |
| Android Automotive with Google APIs arm64-v8a System Image | 35-ext15 | ARM | Compatibility mode, Audio while driving, Templated media apps (revision 3+), Car App Library version 1.9 (revision 4+) | Android Studio stable |
| Android Automotive with Google APIs x86_64 System Image | 35-ext15 | x86 | Compatibility mode, Audio while driving, Templated media apps (revision 3+), Car App Library version 1.9 (revision 4+) | Android Studio stable |
| Android Automotive with Google Play arm64-v8a System Image | 35-ext15 | ARM | Google Play Store, Compatibility mode, Audio while driving, Templated media apps (revision 3+), Car App Library version 1.9 (revision 4+) | Android Studio stable |
| Android Automotive with Google Play x86_64 System Image | 35-ext15 | x86 | Google Play Store, Compatibility mode, Audio while driving, Templated media apps (revision 3+), Car App Library version 1.9 (revision 4+) | Android Studio stable |

Follow these steps to install generic system images:

1. In Android Studio, select **Tools > SDK Manager**.
2. Click the **SDK Platforms** tab.
3. Click **Show Package Details**.
4. Select which image(s) to download. See the preceding table for details.
5. Click **Apply**, then click **OK**.

### Add system images from OEMs

You can also add OEM-specific system images. Follow the steps on OEM
developer sites, in alphabetical order:

1. [General Motors (Chevrolet, Cadillac, GMC, Buick)](https://developer.gm.com/in-vehicle-apps)
2. [Honda](https://global.honda/cars-apps/index.html)
3. [Mazda](https://www.mazda.com/en/apps/)
4. [Polestar](https://www.polestar.com/global/developer#emulator)
5. [Renault Group (Renault, Alpine, Dacia)](https://developer.renaultgroup.com/)
6. [Volvo](https://developer.volvocars.com/in-car-apps/android-emulator-xc40/)

## Create a car AVD and run the emulator

Follow these steps to create an Android Virtual Device (AVD) that represents an
Android Automotive OS vehicle and then use that AVD to run the emulator:

1. In Android Studio, select **Tools > AVD Manager**.
2. Click **Create Virtual Device**.
3. From the **Select Hardware** dialog, select **Automotive**, and then select a hardware profile. Click **Next**.
4. Select a system image that targets Automotive, such as **Android 12L
   (Automotive with Play Store)**, and click **Next**.
5. Name your AVD and select any other options that you want to customize, then click **Finish**.
6. From the tool window bar, select your Android Automotive OS AVD as your deployment target.
7. Click **Run**.

### Use bundled hardware profiles

When creating an AVD, you can use the following [hardware profiles](https://developer.android.com/studio/run/managing-avds#hardware-profile) that are
bundled with Android Studio:

| Name | Resolution | Configurable | Compatibility | Availability |
|---|---|---|---|---|
| Automotive (1024p landscape) | 1024x768 | — | API 28-32 system images with the Google Play Store | Android Studio stable |
| Automotive (1080p landscape) | 1080x600 | Yes | API 33+ system images without the Google Play Store | Android Studio stable |
| Automotive (1408p landscape) *Recommended for use with the API 34 images* | 1408x792 | — | API 33+ system images without the Google Play Store | Android Studio stable |
| Automotive (1408p landscape) with Google Play *Recommended for use with the API 34 images* | 1408x792 | — | API 33+ system images with the Google Play Store | Android Studio stable |
| Automotive Portrait | 800x1280 | — | API 33+ system images without the Google Play Store | Android Studio stable |
| Automotive Large Portrait | 1280x1606 | Yes | API 33+ system images without the Google Play Store | Android Studio stable |
| Automotive Ultrawide | 3904x1320 | Yes | API 33+ system images without the Google Play Store | Android Studio stable |
| Automotive Distant Display | 1080x600 | — | API 32+ Distant display system images without the Google Play Store | Android Studio stable |
| Automotive Distant Display with Google Play | 1080x600 | — | API 32+ Distant display system images with the Google Play Store | Android Studio stable |

> **Note:** When you download OEM images, additional OEM hardware profiles might be bundled with those images.

### Create a hardware profile

To test hardware configurations other than those covered by the
bundled hardware profiles, you can [create a hardware profile](https://developer.android.com/studio/run/managing-avds#createhp) for use
with the Android Automotive OS emulator. Do this by selecting **Android
Automotive** as the device type in the creation flow. Custom hardware profiles
are only compatible with system images that don't include the Google Play
Store.

## Use the emulator's extended controls

In addition to many of the standard [extended controls](https://developer.android.com/studio/run/emulator-extended-controls) available in other
Android emulators, there are some extended controls made specifically for the
Android Automotive OS emulator.

### Emulate hardware state

Beyond sensors such as accelerometers and gyroscopes that can be read using the
[standard Android APIs](https://developer.android.com/guide/topics/sensors/sensors_overview) when available, additional hardware properties
unique to vehicles are communicated over the [Vehicle Hardware Abstraction Layer
(VHAL)](https://source.android.com/docs/automotive/vhal). These properties are modeled by the [`VehiclePropertyIds`](https://developer.android.com/reference/android/car/VehiclePropertyIds)
class.

While the emulator is running, you can modify the values of these properties
from the **Car data** feature of the extended controls. For example, to set the
current speed of the vehicle, you can find the property for speed
([`VehiclePropertyIds.PERF_VEHICLE_SPEED`](https://developer.android.com/reference/android/car/VehiclePropertyIds#PERF_VEHICLE_SPEED)) and change its value.

> **Tip:** If your app is built using the [Car App Library](https://developer.android.com/training/cars/apps), we recommend using the [`CarHardwareManager` API](https://developer.android.com/training/cars/apps/library/car-hardware-api) to read these values because it provides a uniform interface across Android Auto and Android Automotive OS.

#### Simulate driving

To simulate driving, you should set the *Car speed* to a non-zero value and
*Gear* to something other than **P (Park)**. To simulate a parked state, all
that is necessary is to set the *Gear* to **P (Park)**. This can be done either
by using the sliders and selectors under the **Car sensor data** tab or by
modifying the VHAL properties as described in the prior section.

> **Caution:** On system images with the Google Play Store, activities that mark themselves as distraction optimized (such as a [`CarAppActivity`](https://developer.android.com/training/cars/apps/automotive-os#car-app-activity)) are only shown while user experience restrictions are active if the app to which they belong is installed from the Google Play Store. To test distraction optimized activities while developing your app, we recommend that you use a [system
> image](https://developer.android.com/training/cars/testing/emulator#generic-images) without the Google Play Store.

### Test rotary input

In addition to a touchscreen, some Android Automotive OS vehicles come equipped
with a [rotary controller](https://source.android.com/docs/automotive/hmi/rotary_controller), which relies on the same focus APIs as [keyboard
navigation](https://developer.android.com/develop/ui/views/touch-and-input/keyboard-input/navigation) to let users navigate your app without touching the screen. You
can use the **Car rotary** tool within the extended controls to test your app's
support for rotary input.

## Edit your run configurations for media apps

Media apps on Automotive OS apps are different than other Android apps. Android
Automotive OS interacts with your media app using explicit intents and by
sending calls to your [media browser service](https://developer.android.com/training/cars/media#tc-media-browser-service).

To test your app, verify that your app [has no launch activity](https://developer.android.com/training/cars/media/automotive-os#intent-filters) in its
manifest, and then prevent your automotive module from launching with an
activity by following these steps:

1. In Android Studio, select **Run > Edit Configurations**.
2. Select your automotive module from the list of modules in your app.
3. Under **Launch Options > Launch**, select **Nothing**.
4. Click **Apply**, and then click **OK**.

## Report an Android Automotive OS emulator issue

If you run into an issue or have a feature request while using Android
Automotive OS emulator, you can report it using the Google Issue Tracker. Be
sure to fill out all the requested information in the issue template. Before
filing a new issue, check whether it is already reported in the
[issues list](https://issuetracker.google.com/issues?q=componentid:1635829). You can subscribe and vote for issues by clicking the star
for an issue in the tracker. For more information, see [Subscribing to an
Issue](https://developers.google.com/issue-tracker/guides/subscribe#starring_an_issue).

[View existing issues](https://issuetracker.google.com/issues?q=componentid:1635829)
[Create a new issue](https://issuetracker.google.com/issues/new?component=1635829)
