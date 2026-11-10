---
source_url: https://developer.android.com/codelabs/build-a-parked-app
platform: android-auto
title: Build and test a parked app for Android Automotive OS
---

## 1. Before you begin

### What you'll build
In this codelab, you'll learn how to migrate an existing video streaming mobile app, **Road Reels**, to Android Automotive OS.

### What you'll learn
- How to use the Android Automotive OS emulator
- How to make the changes required to create an Android Automotive OS build
- Common assumptions made when developing apps for mobile that may be broken when an app runs on Android Automotive OS
- The different quality tiers for apps in cars
- How to use a media session to enable other apps to control your app's playback
- How system UI and window insets may differ on Android Automotive OS devices as compared to mobile devices

### Prerequisites
- The latest Android Studio
- Experience with basic Kotlin
- Experience creating Android Virtual Devices and running them in the Android Emulator
- Basic knowledge of Jetpack Compose
- An understanding of Side-effects
- Basic familiarity with window insets

## 2. Get set up

**Clone the repository:**

```bash
git clone https://github.com/android/car-codelabs.git
```

Then import the `build-a-parked-app/start` directory into Android Studio.

## 3. Learn about parked apps for Android Automotive OS

Parked apps make up a subset of the app categories supported by Android Automotive OS, consisting of:
- Video streaming apps
- Web browsers
- Games

These apps are a great fit in cars given the hardware present in vehicles with Google built-in and the increasing prevalence of electric vehicles where charging time represents a great opportunity for engagement.

### App quality tiers for apps in cars:

- **Tier 3 - Car ready**: Your app is large screen compatible and can be used while the car is parked. Mobile apps that meet these requirements are eligible to be distributed to cars as-is through the Car ready mobile apps program.

- **Tier 2 - Car optimized**: Your app provides a great experience on the car's center stack display with some car-specific engineering.

- **Tier 1 - Car differentiated**: Your app is built to work across the variety of hardware in cars and can adapt its experience across driving and parked modes.

## 4. Run the app in the Android Automotive OS emulator

### Install the Automotive with Play Store System images
1. Open the SDK Manager in Android Studio
2. Select the **SDK Platforms** tab
3. Check **Show package details** in the bottom-right corner
4. Install the API 33 _Android Automotive with Google APIs_ emulator image

### Create an Android Automotive OS Android Virtual Device
1. Open the Device Manager
2. Select **Automotive** under the **Category** column
3. Select the _Automotive (1408p landscape)_ bundled hardware profile
4. Click **Next** and select the system image from the previous step
5. Click **Finish** to create the AVD

### Run the app
Run the app on the emulator using the existing `app` run configuration.

## 5. Update the manifest to declare Android Automotive OS support

### Declare the automotive hardware feature

Add the following `<uses-feature>` element in `AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    ...
    <uses-feature
        android:name="android.hardware.type.automotive"
        android:required="false" />
    ...
</manifest>
```

Using `false` for `android:required` allows the APK or App Bundle to be distributed to both Android Automotive OS devices and mobile devices.

### Mark the app as a video app

Add the `android:appCategory` attribute to the `<application>` element:

```xml
<manifest ...>
    <application
        ...
        android:appCategory="video">
        ...
    </application>
</manifest>
```

## 6. Meet the Android Automotive OS quality requirements: Navigability

### Add navigation affordances

Unlike mobile devices, Android Automotive OS devices don't require a back button. Apps must provide navigation affordances in their UI to ensure users can navigate without getting stuck. This is the **AN-1** quality guideline.

**For detail screen back navigation:**

```kotlin
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton

} else if (route?.startsWith(Screen.Detail.name) == true) {
    CenterAlignedTopAppBar(
        title = { Text(stringResource(R.string.bbb_title)) },
        navigationIcon = {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(
                    Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = null
                )
            }
        }
    )
}
```

**For player screen close button:**

1. Update `TopControls` to take an `onClose` callback:

```kotlin
import androidx.compose.material.icons.twotone.Close

@Composable
fun TopControls(
    title: String?,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(modifier) {
        IconButton(
            modifier = Modifier
                .align(Alignment.TopStart),
            onClick = onClose
        ) {
            Icon(
                Icons.TwoTone.Close,
                contentDescription = "Close player",
                tint = Color.White
            )
        }

        if (title != null) { ... }
    }
}
```

2. Update `PlayerControls` to pass `onClose` to `TopControls`:

```kotlin
fun PlayerControls(
    uiState: PlayerUiState,
    onClose: () -> Unit,
    onPlayPause: () -> Unit,
    onSeek: (seekToMillis: Long) -> Unit,
    modifier: Modifier = Modifier,
) {
    AnimatedVisibility(
        visible = uiState.isShowingControls,
        enter = fadeIn(),
        exit = fadeOut()
    ) {
        Box(modifier = modifier.background(Color.Black.copy(alpha = .5f))) {
            TopControls(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(dimensionResource(R.dimen.screen_edge_padding))
                    .align(Alignment.TopCenter),
                title = uiState.mediaMetadata.title?.toString(),
                onClose = onClose
            )
            ...
        }
    }
}
```

3. Update `PlayerScreen` to pass the callback:

```kotlin
@Composable
fun PlayerScreen(
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: PlayerViewModel = viewModel()
) {
    ...

    PlayerControls(
        modifier = Modifier
            .fillMaxSize(),
        uiState = playerUiState,
        onClose = onClose,
        onPlayPause = { if (playerUiState.isPlaying) viewModel.pause() else viewModel.play() },
        onSeek = viewModel::seekTo
    )
}
```

4. In `RoadReelsNavHost`, provide the implementation:

```kotlin
composable(route = Screen.Player.name, ...) {
    PlayerScreen(onClose = { navController.popBackStack() })
}
```

### Adapt to screen orientation support

Cars are typically fixed orientation. To prevent flickering loops or letterboxing, add an extension function to check supported orientations:

```kotlin
// Extensions.kt
import android.content.Context
import android.content.pm.PackageManager

enum class SupportedOrientation {
    Landscape,
    Portrait,
}

fun Context.supportedOrientations(): List<SupportedOrientation> {
    return when (Pair(
        packageManager.hasSystemFeature(PackageManager.FEATURE_SCREEN_LANDSCAPE),
        packageManager.hasSystemFeature(PackageManager.FEATURE_SCREEN_PORTRAIT)
    )) {
        Pair(true, false) -> listOf(SupportedOrientation.Landscape)
        Pair(false, true) -> listOf(SupportedOrientation.Portrait)
        else -> listOf(SupportedOrientation.Landscape, SupportedOrientation.Portrait)
    }
}
```

Then guard the orientation request:

```kotlin
// PlayerScreen.kt
import com.example.android.cars.roadreels.SupportedOrientation
import com.example.android.cars.roadreels.supportedOrientations

DisposableEffect(Unit) {
    ...

    // Only automatically set the orientation to landscape if the device supports landscape.
    if (activity.supportedOrientations().contains(SupportedOrientation.Landscape)
        && !activity.isInMultiWindowMode
    ) {
        activity.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
    }

    ...
}
```

### Adapt to system bar controllability

OEMs can prevent apps from hiding system bars. Handle controllable insets:

1. Create `LocalControllableInsets.kt`:

```kotlin
import androidx.compose.runtime.compositionLocalOf

const val DEFAULT_CONTROLLABLE_INSETS = 0
val LocalControllableInsets = compositionLocalOf { DEFAULT_CONTROLLABLE_INSETS }
```

2. Set up listener in `MainActivity.kt`:

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat.OnControllableInsetsChangedListener

class MainActivity : ComponentActivity() {
    private lateinit var onControllableInsetsChangedListener: OnControllableInsetsChangedListener

    @OptIn(ExperimentalMaterial3WindowSizeClassApi::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        setContent {
            var controllableInsetsTypeMask by remember { mutableIntStateOf(DEFAULT_CONTROLLABLE_INSETS) }

            onControllableInsetsChangedListener =
                OnControllableInsetsChangedListener { _, typeMask ->
                    if (controllableInsetsTypeMask != typeMask) {
                        controllableInsetsTypeMask = typeMask
                    }
                }

            WindowCompat.getInsetsController(window, window.decorView)
                .addOnControllableInsetsChangedListener(onControllableInsetsChangedListener)

            RoadReelsTheme {
                RoadReelsApp(calculateWindowSizeClass(this))
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()

        WindowCompat.getInsetsController(window, window.decorView)
            .removeOnControllableInsetsChangedListener(onControllableInsetsChangedListener)
    }
}
```

3. Add `CompositionLocalProvider` in `MainActivity.kt`:

```kotlin
import androidx.compose.runtime.CompositionLocalProvider

CompositionLocalProvider(LocalControllableInsets provides controllableInsetsTypeMask) {
    RoadReelsTheme {
        RoadReelsApp(calculateWindowSizeClass(this))
    }
}
```

4. In `PlayerScreen.kt`, use the controllable insets:

```kotlin
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.union
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.unit.dp
import com.example.android.cars.roadreels.LocalControllableInsets

val controllableInsetsTypeMask by rememberUpdatedState(LocalControllableInsets.current)

DisposableEffect(Unit) {
    ...
    windowInsetsController.hide(WindowInsetsCompat.Type.systemBars().and(controllableInsetsTypeMask))
    ...
}

...

var windowInsetsForPadding = WindowInsets(0.dp)
if (controllableInsetsTypeMask.and(WindowInsetsCompat.Type.statusBars()) == 0) {
    windowInsetsForPadding = windowInsetsForPadding.union(WindowInsets.statusBars)
}
if (controllableInsetsTypeMask.and(WindowInsetsCompat.Type.navigationBars()) == 0) {
    windowInsetsForPadding = windowInsetsForPadding.union(WindowInsets.navigationBars)
}

Box(
    modifier = Modifier
        .fillMaxSize()
        .windowInsetsPadding(windowInsetsForPadding)
) {
    PlayerView(...)
    PlayerControls(...)
}
```

## 7. Meet the Android Automotive OS quality requirements: Driver distraction

Parked apps must pause playback when user experience restrictions become active (the **DD-2** guideline).

### Pause playback when driving begins

1. Add dependency in `libs.version.toml`:

```toml
androidx-lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycle" }
```

And in `build.gradle.kts`:

```kotlin
implementation(libs.androidx.lifecycle.runtime.compose)
```

2. Add lifecycle effect in `PlayerScreen.kt`:

```kotlin
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LifecycleEventEffect

@Composable
fun PlayerScreen(...) {
    ...
    LifecycleEventEffect(Lifecycle.Event.ON_PAUSE) {
        viewModel.pause()
    }

    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) {
        viewModel.play()
    }
    ...
}
```

## 8. Test the app in the distant display emulator

### Install the Automotive Distant Display image
1. Open the SDK Manager in Android Studio
2. Select **SDK Platforms** tab
3. Check **Show package details**
4. Install the API 33 _Automotive Distant Display with Google Play_ emulator image

### Create an Android Virtual Device
1. Open the Device Manager
2. Select **Automotive** category
3. Select _Automotive Distant Display with Google Play_ bundled hardware profile
4. Click **Next** and select the system image
5. Click **Finish**

## 9. Improve the app experience on the distant display

### Improve app continuity

Add `android:configChanges` to handle size-based configuration changes:

```xml
<!-- AndroidManifest.xml -->
<activity
    android:name="com.example.android.cars.roadreels.MainActivity"
    ...
    android:configChanges="screenSize|smallestScreenSize|orientation|screenLayout|density">
        ...
</activity>
```

### Implement playback controls

Add dependency for Media3 session in `libs.version.toml`:

```toml
androidx-media3-mediasession = { group = "androidx.media3", name = "media3-session", version.ref = "media3" }
```

And in `build.gradle.kts`:

```kotlin
implementation(libs.androidx.media3.mediasession)
```

In `PlayerViewModel.kt`:

```kotlin
import androidx.media3.session.MediaSession

class PlayerViewModel(...) {
    ...

    private var mediaSession: MediaSession? = null

    init {
        viewModelScope.launch {
            _player.onEach { player ->
                playerUiStateUpdateJob?.cancel()
                mediaSession?.release()

                if (player != null) {
                    initializePlayer(player)
                    mediaSession = MediaSession.Builder(application, player).build()
                    playerUiStateUpdateJob = viewModelScope.launch {... }
                }
            }.collect()
        }
    }
}

override fun onCleared() {
    super.onCleared()
    mediaSession?.release()
    _player.value?.release()
}
```

Test media controls:

```bash
# To play content
adb shell cmd media_session dispatch play

# To pause content
adb shell cmd media_session dispatch pause

# To toggle the playing state
adb shell cmd media_session dispatch play-pause
```

### Constrain playback resumption

1. Add to `build.gradle.kts`:

```kotlin
android {
    ...
    useLibrary("android.car")
}
```

2. Create `RoadReelsPlayer.kt`:

```kotlin
import android.car.Car
import android.car.drivingstate.CarUxRestrictions
import android.car.drivingstate.CarUxRestrictionsManager
import android.content.pm.PackageManager
import androidx.media3.common.ForwardingSimpleBasePlayer
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import com.google.common.util.concurrent.ListenableFuture

@UnstableApi
class RoadReelsPlayer(context: Context) :
    ForwardingSimpleBasePlayer(ExoPlayer.Builder(context).build()) {
    private var shouldPreventPlay = false
    private var pausedByUxRestrictions = false
    private lateinit var carUxRestrictionsManager: CarUxRestrictionsManager

    init {
        with(context) {
            // Only listen to UX restrictions if the device is running Android Automotive OS
            if (packageManager.hasSystemFeature(PackageManager.FEATURE_AUTOMOTIVE)) {
                val car = Car.createCar(context)
                carUxRestrictionsManager =
                    car.getCarManager(Car.CAR_UX_RESTRICTION_SERVICE) as CarUxRestrictionsManager

                // Get the initial UX restrictions and update the player state
                shouldPreventPlay =
                    carUxRestrictionsManager.currentCarUxRestrictions.isRequiresDistractionOptimization
                invalidateState()

                // Register a listener to update the player state as the UX restrictions change
                carUxRestrictionsManager.registerListener { carUxRestrictions: CarUxRestrictions ->
                    shouldPreventPlay = carUxRestrictions.isRequiresDistractionOptimization

                    if (!shouldPreventPlay && pausedByUxRestrictions) {
                        handleSetPlayWhenReady(true)
                        invalidateState()
                    } else if (shouldPreventPlay && isPlaying) {
                        pausedByUxRestrictions = true
                        handleSetPlayWhenReady(false)
                        invalidateState()
                    }
                }
            }

            addListener(object : Player.Listener {
                override fun onEvents(player: Player, events: Player.Events) {
                    if (events.contains(EVENT_IS_PLAYING_CHANGED) && isPlaying) {
                        pausedByUxRestrictions = false
                    }
                }
            })
        }
    }

    override fun getState(): State {
        val state = super.getState()

        return state.buildUpon()
            .setAvailableCommands(
                state.availableCommands.buildUpon().removeIf(COMMAND_PLAY_PAUSE, shouldPreventPlay)
                    .build()
            ).build()
    }

    override fun handleRelease(): ListenableFuture<*> {
        if (::carUxRestrictionsManager.isInitialized) {
            carUxRestrictionsManager.unregisterListener()
        }
        return super.handleRelease()
    }
}
```

3. Update `PlayerViewModel.kt` to use `RoadReelsPlayer`:

```kotlin
init {
    ...
    _player.update { RoadReelsPlayer(application) }
}
```

4. Update lifecycle effects in `PlayerScreen.kt`:

```kotlin
LifecycleEventEffect(Lifecycle.Event.ON_START) {
    viewModel.play()
}
LifecycleEventEffect(Lifecycle.Event.ON_STOP) {
    viewModel.pause()
}
```

## 10. Test the app under different system configurations

### Configure a side system bar

Enable a left system bar configuration:

```bash
adb shell cmd overlay enable --user 0 com.android.systemui.rro.left
```

To revert:

```bash
adb shell cmd overlay disable --user 0 com.android.systemui.rro.left
```

## 11. Work with display cutouts

### Enable display cutout

```bash
adb shell cmd overlay enable --user 0 com.android.internal.display.cutout.emulation.top_and_right
```

To disable:

```bash
adb shell cmd overlay disable --user 0 com.android.internal.display.cutout.emulation.top_and_right
```

### Render into the display cutout

Create `res/values-car-v30/integers.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <integer name="windowLayoutInDisplayCutoutMode">3</integer>
</resources>
```

The value `3` corresponds to `LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS`.

### Fix the top app bars

Add `windowInsets` to `CenterAlignedTopAppBar`:

```kotlin
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.safeDrawing

windowInsets = WindowInsets.safeDrawing.only(WindowInsetsSides.Horizontal + WindowInsetsSides.Top)
```

### Fix the main screen

Update `contentWindowInsets` in `Scaffold`:

```kotlin
// RoadReelsApp.kt
Scaffold(
    ...,
    contentWindowInsets = WindowInsets(0.dp)
) { ... }
```

Add padding to row headers in `MainScreen.kt`:

```kotlin
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding

LazyColumn(
    contentPadding = PaddingValues(bottom = dimensionResource(R.dimen.screen_edge_padding))
) {
    items(NUM_ROWS) { rowIndex: Int ->
        Text(
            "Row $rowIndex",
            style = MaterialTheme.typography.headlineSmall,
            modifier = Modifier
                .padding(
                    horizontal = dimensionResource(R.dimen.screen_edge_padding),
                    vertical = dimensionResource(R.dimen.row_header_vertical_padding)
                )
                .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Horizontal))
        )
    ...
}
```

Add spacers for scrollable content in `MainScreen.kt`:

```kotlin
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsEndWidth
import androidx.compose.foundation.layout.windowInsetsStartWidth

LazyRow(
    horizontalArrangement = Arrangement.spacedBy(dimensionResource(R.dimen.list_item_spacing)),
) {
    item {
        Spacer(
            Modifier
                .windowInsetsStartWidth(WindowInsets.safeDrawing)
                .widthIn(min = dimensionResource(R.dimen.screen_edge_padding))
        )
    }
    items(NUM_ITEMS_PER_ROW) { ... }
    item {
        Spacer(
            Modifier
                .windowInsetsEndWidth(WindowInsets.safeDrawing)
                .widthIn(min = dimensionResource(R.dimen.screen_edge_padding))
        )
    }
}
```

Add bottom spacer:

```kotlin
import androidx.compose.foundation.layout.windowInsetsBottomHeight

LazyColumn(...){
    items(NUM_ROWS) { ... }
    item {
        Spacer(Modifier.windowInsetsBottomHeight(WindowInsets.safeDrawing))
    }
}
```

### Fix the detail screen

Add padding in `DetailScreen.kt`:

```kotlin
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding

Box(
    modifier = modifier
        .padding(dimensionResource(R.dimen.screen_edge_padding))
        .windowInsetsPadding(WindowInsets.safeDrawing)
) { ... }
```

### Fix the player screen

Update padding initialization in `PlayerScreen.kt`:

```kotlin
import androidx.compose.foundation.layout.displayCutout

var windowInsetsForPadding = WindowInsets(WindowInsets.displayCutout)
```

## 12. Congratulations

You've successfully migrated and optimized a parked app for Android Automotive OS! The app now:
- Declares Android Automotive OS support
- Provides proper navigation affordances
- Adapts to screen orientation constraints
- Handles system bar controllability
- Pauses playback during driving
- Supports distant display transitions
- Implements media session controls
- Properly handles display cutouts and window insets
