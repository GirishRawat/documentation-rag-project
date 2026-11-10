// Verbatim demo content for the hackathon showcase question
// "Building a messaging app for Android Auto" — ported from a reference
// brief the user supplied, so the demo is guaranteed-correct and instant
// rather than dependent on a live model call. See DEMO_QUESTION below for
// the exact-match trigger; any other question goes through the live
// Agents.invoke + RAG pipeline as usual.

export const DEMO_QUESTION = 'building a messaging app for android auto';

export const DEMO_TITLE = 'Building a messaging app for Android Auto';

export const DEMO_HTML = `
<div class="breadcrumb"><a href="https://developer.android.com/training/cars">Android for Cars</a> &rsaquo; <a href="https://developer.android.com/training/cars/communication">Communication apps</a> &rsaquo; Messaging app brief</div>

<h1>Building a messaging app for Android&nbsp;Auto</h1>
<p class="lede">Two integration paths — stable notification-powered messaging and the beta templated experience — how they work, what Google requires, and how Apple CarPlay handles the same job.</p>

<div class="meta-chips">
  <span class="chip android"><span class="dot"></span>Android Auto</span>
  <span class="chip apple"><span class="dot"></span>Apple CarPlay comparison</span>
  <span class="chip">Internal brief &middot; KAM &amp; sales</span>
</div>

<h2 id="at-a-glance">At a glance<span class="rule"></span></h2>
<ul>
  <li>There are <strong>two ways</strong> to bring messaging to Android Auto:
    <ol>
      <li><strong>Notification-powered messaging</strong> (stable, available to all): the app posts standard <code>MessagingStyle</code> notifications with reply and mark-as-read actions, and Android Auto surfaces them in the car, reads them aloud, and handles voice replies <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></li>
      <li><strong>Templated messaging</strong> (beta): a richer experience built with the Android for Cars App Library that also shows conversation history on the car screen — currently publishable only to Internal and Closed Testing tracks on Google Play <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></li>
    </ol>
  </li>
  <li><strong>Messaging is Android Auto only.</strong> New and existing messaging apps can't be directly installed as driver-optimized apps on Android Automotive OS; they can only be distributed through Android Auto <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a>; the distribution page confirms communication apps are supported on Android Auto only, not on Android Automotive OS <a class="cite" href="https://developer.android.com/training/cars/distribute">source &#8599;</a></li>
  <li>The experience is <strong>voice-first by design</strong>: Android Auto's messaging app template &ldquo;uses a single navigation model across all messaging apps&rdquo;, and apps &ldquo;receive and respond to text-based messages only, transforming text such as SMS and email into audio&rdquo; <a class="cite" href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">source &#8599;</a></li>
  <li>On Apple's side, CarPlay has an equivalent <strong>Communication</strong> app category (entitlement <code>com.apple.developer.carplay-communication</code>), but messaging works very differently: it is handled by <strong>Siri + SiriKit intents</strong>, and message <strong>content may never be shown on the CarPlay screen</strong> <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a>. Full comparison in <a href="#carplay">&ldquo;How Apple CarPlay does it&rdquo;</a> below.</li>
</ul>

<h2 id="platform-scope">Platform scope<span class="rule"></span></h2>
<table>
  <thead><tr><th></th><th>Notification-powered messaging</th><th>Templated messaging</th></tr></thead>
  <tbody>
    <tr><td class="dim"><strong>Platform</strong></td><td>Android Auto <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></td><td>Android Auto <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></td></tr>
    <tr><td class="dim"><strong>Status</strong></td><td>Stable (production) <a class="cite" href="https://developer.android.com/training/cars/communication">source &#8599;</a></td><td>Beta <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></td></tr>
    <tr><td class="dim"><strong>Publishing</strong></td><td>All track types <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></td><td>Internal Testing &amp; Closed Testing tracks only <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></td></tr>
    <tr><td class="dim"><strong>What users get</strong></td><td>Receive notifications, read messages aloud (TTS), reply by voice <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></td><td>Additionally: browse conversation history, read historical messages aloud, reply by voice <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></td></tr>
    <tr><td class="dim"><strong>Built with</strong></td><td><code>MessagingStyle</code> notifications + a <code>Service</code> for reply / mark-as-read <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></td><td>Android for Cars App Library (<code>ConversationItem</code>) <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></td></tr>
  </tbody>
</table>
<div class="note warn"><strong>Important:</strong> Messaging apps can't be installed as driver-optimized apps on Android Automotive OS — Android Auto is the only in-car surface for them <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></div>

<h2 id="path-1-notifications">Path 1 — Notification-powered messaging (production path)<span class="rule"></span></h2>
<p>This is the integration every Android Auto messaging app must have. Apps building the templated experience must <strong>also</strong> implement this notification integration, so users can read and reply without opening the templated app <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a>.</p>

<h3>How it works</h3>
<ol class="flow">
  <li>Your app receives a message.</li>
  <li>Your app generates a <code>MessagingStyle</code> notification with reply and mark-as-read <code>Action</code> objects.</li>
  <li>Android Auto receives the &ldquo;new notification&rdquo; event from the Android system and finds the <code>MessagingStyle</code>, reply <code>Action</code>, and mark-as-read <code>Action</code>.</li>
  <li>Android Auto generates and displays a notification in the car.</li>
  <li>If the user taps the notification, Android Auto triggers the mark-as-read <code>Action</code>; your app handles it in the background.</li>
  <li>If the user replies by voice, Android Auto puts a transcription of the response into the reply <code>Action</code> and triggers it; your app handles it in the background.</li>
</ol>
<p><a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></p>

<figure class="docimg">
  <div class="hint" aria-hidden="true">Real screenshot &mdash; click to open its official doc page</div>
  <a class="imglink" href="https://developers.google.com/cars/design/android-auto/apps/incoming-messages" target="_blank" rel="noopener" aria-label="Open the Design for Driving Incoming messages page (source of this image) in a new tab">
    <img src="https://developers.google.com/cars/design/android-auto/apps/images/notification-half-sheet-multi-action.png" alt="Dark Android Auto in-car message notification overlay for WhatsApp: circular avatar with a green WhatsApp badge, sender name Leslie Moss, subtitle New message, an X close icon, and two pill-shaped buttons: Play and Mute conversation." loading="lazy">
  </a>
  <figcaption>Message notification as displayed in Android Auto — a WhatsApp-style message from &ldquo;Leslie Moss&rdquo; with a &ldquo;Play&rdquo; primary action and a &ldquo;Mute conversation&rdquo; secondary action. Source: <a href="https://developers.google.com/cars/design/android-auto/apps/incoming-messages">Design for Driving — Incoming messages &#8599;</a></figcaption>
</figure>

<div class="note"><strong>Limitation:</strong> users only see message history from notifications received <strong>during their active Android Auto session</strong>. To show messages from before the session began, build the templated experience <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></div>

<div class="pathcard">
  <h3 id="step-1-manifest">Step 1 — Declare Android Auto support in the manifest</h3>
  <div class="codepanel"><div class="bar"><span></span><span class="lang">XML</span></div><pre>&lt;application&gt;
    ...
    &lt;meta-data
        android:name="com.google.android.gms.car.application"
        android:resource="@xml/automotive_app_desc"/&gt;
    ...
&lt;/application&gt;</pre></div>
  <p>Create <code>res/xml/automotive_app_desc.xml</code>:</p>
  <div class="codepanel"><div class="bar"><span></span><span class="lang">XML</span></div><pre>&lt;automotiveApp&gt;
    &lt;uses name="notification" /&gt;
&lt;/automotiveApp&gt;</pre></div>
  <p>If your app can be set as the <strong>default SMS handler</strong>, also add <code>&lt;uses name="sms" /&gt;</code> — otherwise Android Auto uses its built-in default handler for incoming SMS/MMS, which can lead to duplicate notifications <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></p>

  <h3 id="step-2-androidx">Step 2 — Import the AndroidX core library</h3>
  <p><code>androidx.core:core:1.19.0</code> (Java) or <code>androidx.core:core-ktx:1.19.0</code> (Kotlin) is required to build notifications for Android Auto <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></p>

  <h3 id="step-3-service">Step 3 — Handle reply and mark-as-read with a Service</h3>
  <p>Handle the two action types in the background with an <code>IntentService</code> (still works for these use cases because it starts in response to a <code>PendingIntent</code> from a notification, which places the app on a system allowlist) <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a>:</p>
  <div class="codepanel"><div class="bar"><span></span><span class="lang">Kotlin</span></div><pre>private const val ACTION_REPLY = "com.example.REPLY"
private const val ACTION_MARK_AS_READ = "com.example.MARK_AS_READ"

class MessagingService : IntentService("MessagingService") {
    override fun onHandleIntent(intent: Intent?) {
        val conversationId = intent!!.getIntExtra(EXTRA_CONVERSATION_ID_KEY, -1)
        val conversation = YourAppConversation.getById(conversationId)
        when (intent.action) {
            ACTION_REPLY -&gt; {
                val results: Bundle = RemoteInput.getResultsFromIntent(intent)
                val message = results.getString(REMOTE_INPUT_RESULT_KEY)
                conversation.reply(message)
            }
            ACTION_MARK_AS_READ -&gt; conversation.markAsRead()
        }
    }
}</pre></div>
  <div class="note warn"><strong>Warning:</strong> Do <strong>not</strong> use an <code>Activity</code> or <code>Fragment</code> to handle an <code>Action</code> — they run in the foreground and are known to cause UI issues that can get an app <strong>blocked from Android Auto</strong> <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></div>
  <p>Create a <code>RemoteInput</code> so other apps (including Android Auto) can hand the reply text to your app, and register the service in the manifest: <code>&lt;service android:name="com.example.MessagingService" /&gt;</code> <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></p>

  <h3 id="step-4-actions">Step 4 — Build the Actions with the exact Android Auto requirements</h3>
  <p><strong>Reply <code>Action</code> — three requirements</strong> <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a>:</p>
  <ul>
    <li>semantic action set to <code>Action.SEMANTIC_ACTION_REPLY</code></li>
    <li>indicates it won't show any UI when fired</li>
    <li>contains exactly one <code>RemoteInput</code></li>
  </ul>
  <p><strong>Mark-as-read <code>Action</code> — two requirements</strong> <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a>:</p>
  <ul>
    <li>semantic action set to <code>Action.SEMANTIC_ACTION_MARK_AS_READ</code></li>
    <li>indicates it won't show any UI when fired</li>
  </ul>
  <p>The reply <code>PendingIntent</code> <strong>must</strong> use <code>PendingIntent.FLAG_MUTABLE</code> so Android Auto can update it with the <code>RemoteInput</code> contents; request codes (<code>createReplyId</code> / <code>createMarkAsReadId</code>) must return <strong>unique IDs per conversation</strong> but the <em>same</em> ID on repeated calls for the same conversation <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></p>
  <div class="codepanel"><div class="bar"><span></span><span class="lang">Kotlin</span></div><pre>val replyAction = Action.Builder(R.drawable.reply, "Reply", replyPendingIntent)
    .setSemanticAction(Action.SEMANTIC_ACTION_REPLY)
    .setShowsUserInterface(false)
    .addRemoteInput(createReplyRemoteInput(context))
    .build()</pre></div>

  <h3 id="step-5-messagingstyle">Step 5 — Create the MessagingStyle and post the notification</h3>
  <p><code>MessagingStyle</code> is the carrier Android Auto uses to read messages aloud <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a>:</p>
  <div class="codepanel"><div class="bar"><span></span><span class="lang">Kotlin</span></div><pre>val messagingStyle = MessagingStyle(devicePerson)              <span class="c">// device user as Person</span>
messagingStyle.setConversationTitle(appConversation.title)     <span class="c">// conversation title</span>
messagingStyle.setGroupConversation(appConversation.recipients.size &gt; 1)

for (appMessage in appConversation.getUnreadMessages()) {
    val senderPerson = Person.Builder()
        .setName(appMessage.sender.name)
        .setIcon(appMessage.sender.icon)
        .setKey(appMessage.sender.id)
        .build()
    messagingStyle.addMessage(appMessage.body, appMessage.timeReceived, senderPerson)
}

val notification = NotificationCompat.Builder(context, channel)
    .setSmallIcon(R.drawable.notification_icon)   <span class="c">// required for the Android UI</span>
    .setLargeIcon(appConversation.icon)           <span class="c">// shows in Android Auto as conversation image</span>
    .setStyle(messagingStyle)
    .addAction(replyAction)
    .addInvisibleAction(markAsReadAction)         <span class="c">// invisible in the phone UI; still satisfies Auto</span>
    .build()

NotificationManagerCompat.from(context).notify(appConversation.id, notification)</pre></div>
  <p>The device <code>Person</code>'s display name is also the name read aloud in Android Auto; more complex messages (e.g. images) can be added by instantiating <code>MessagingStyle.Message</code> directly <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></p>
</div>

<h2 id="path-2-templated">Path 2 — Templated messaging (beta)<span class="rule"></span></h2>
<p>A richer, screen-based experience using the Android for Cars App Library on top of the notification integration. <strong>All apps that support templated messaging must also extend messaging notifications</strong> <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a>; start from the <a href="https://developer.android.com/training/cars/apps/library">Android for Cars App Library</a> and <a href="https://developer.android.com/training/cars/apps/auto">Android Auto templated app</a> guides.</p>
<div class="note info"><strong>Beta status:</strong> anyone can publish templated messaging apps to <strong>Internal Testing and Closed Testing</strong> tracks on Play; publishing to Open Testing and Production &ldquo;will be permitted at a later date&rdquo;. Promoting builds to those tracks gets the submission <strong>rejected</strong> <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></div>

<h3>Manifest configuration</h3>
<div class="codepanel"><div class="bar"><span></span><span class="lang">XML</span></div><pre>&lt;service android:name=".MyCarAppService" android:exported="true"&gt;
    &lt;intent-filter&gt;
        &lt;action android:name="androidx.car.app.CarAppService" /&gt;
        &lt;category android:name="androidx.car.app.category.MESSAGING"/&gt;
    &lt;/intent-filter&gt;
&lt;/service&gt;

&lt;meta-data
    android:name="androidx.car.app.minCarApiLevel"
    android:value="7"/&gt;   <span class="c">&lt;!-- ConversationItem requires Car API 7+ --&gt;</span></pre></div>
<p>And in <code>automotive_app_desc.xml</code>, declare <strong>both</strong> capabilities (plus <code>sms</code> if the app can be the default SMS handler) <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a>:</p>
<div class="codepanel"><div class="bar"><span></span><span class="lang">XML</span></div><pre>&lt;automotiveApp&gt;
    &lt;uses name="notification" /&gt;
    &lt;uses name="template" /&gt;
&lt;/automotiveApp&gt;</pre></div>
<p>Apps supporting both messaging and calling include <strong>both</strong> <code>androidx.car.app.category.CALLING</code> and <code>androidx.car.app.category.MESSAGING</code> categories in the same intent filter <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></p>

<h3>Displaying conversations</h3>
<p>Show conversations as <code>ConversationItem</code> objects in a <code>ListTemplate</code> or <code>SectionedItemTemplate</code> <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a>:</p>
<div class="codepanel"><div class="bar"><span></span><span class="lang">Kotlin</span></div><pre>itemListBuilder.addItem(
    ConversationItem.Builder(
        conversation.id,
        CarText.create(conversation.title),
        Person.Builder().setName("Me").setKey("self_id").build(),
        carMessages,          <span class="c">// CarMessage: sender, body, received time, read flag</span>
        myConversationCallback
    ).build()
)</pre></div>
<p>Each <code>ConversationItem</code> automatically shows actions for <strong>playing a message, marking it as read, and replying</strong>; the actions are handled by the <code>ConversationCallbackDelegate</code> you supply <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a>. Guidance for a good experience:</p>
<ul>
  <li>At most <strong>5–10 recent/important conversations</strong>, with <strong>no more than the 5 most recent messages</strong> per conversation <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></li>
  <li>Refresh screens as messages arrive by calling <code>invalidate()</code> — keep refreshes to <strong>500 ms or fewer</strong> (otherwise show a loading state) <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></li>
  <li>When a conversation is on screen, lower the incoming notification's importance to <code>IMPORTANCE_DEFAULT</code> or lower so it doesn't appear as a heads-up notification (HUN) <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></li>
</ul>

<h2 id="in-car-ux">The in-car UX (Design for Driving)<span class="rule"></span></h2>
<p>Google's <a href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">Design for Driving — Messaging apps</a> describes the experience users actually get:</p>
<ul>
  <li>Voice-based messaging &ldquo;allows drivers to keep their eyes on the road while communicating&rdquo;; the messaging app template uses a <strong>single navigation model across all messaging apps</strong> <a class="cite" href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">source &#8599;</a></li>
  <li>Apps using this template receive and respond to <strong>text-based messages only</strong>, transforming text such as SMS and email into <strong>audio</strong> <a class="cite" href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">source &#8599;</a></li>
  <li>Users play and reply to a message in a <strong>single conversational flow</strong> — e.g. driver: &ldquo;Reply!&rdquo; &rarr; Google voice: &ldquo;What's the message?&rdquo; &rarr; driver dictates &rarr; voice reads the message back and asks &ldquo;Do you want to send it?&rdquo; &rarr; &ldquo;Yes!&rdquo; &rarr; &ldquo;Message sent&rdquo; <a class="cite" href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">source &#8599;</a></li>
</ul>

<figure class="docimg">
  <div class="hint" aria-hidden="true">Real screenshot &mdash; click to open its official doc page</div>
  <a class="imglink" href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging" target="_blank" rel="noopener" aria-label="Open the Design for Driving Messaging apps page (source of this image) in a new tab">
    <img src="https://developers.google.com/cars/design/android-auto/apps/images/img-notification.png" alt="Landscape dark Android Auto in-car screenshot: a large dark message notification card over a dimmed car UI, with a circular avatar and green WhatsApp badge, sender name Sarah Wilkinson, subtitle New Message, and Play and Mute Conversation buttons." loading="lazy">
  </a>
  <figcaption>The incoming-message experience: a notification card (sender &ldquo;Sarah Wilkinson&rdquo;, &ldquo;New Message&rdquo;) over the dimmed car UI, with &ldquo;Play&rdquo; and &ldquo;Mute Conversation&rdquo; actions. Source: <a href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">Design for Driving — Messaging apps &#8599;</a></figcaption>
</figure>

<h3>Conversational flow</h3>
<table>
  <thead><tr><th>Driver</th><th>Google Voice</th></tr></thead>
  <tbody>
    <tr><td>&ldquo;Reply!&rdquo;</td><td>&ldquo;What's the message?&rdquo;</td></tr>
    <tr><td>&ldquo;I'll be 10 minutes late. Please start without me. I'll find you when I get there.&rdquo;</td><td>&ldquo;Here is your message to Firstname Lastname: &lsquo;I'll be 10 minutes late. Please start without me. I'll find you when I get there.&rsquo; Do you want to send it?&rdquo;</td></tr>
    <tr><td>&ldquo;Yes!&rdquo;</td><td>&ldquo;Message sent to Firstname Lastname&rdquo;</td></tr>
  </tbody>
</table>

<figure class="docimg">
  <div class="hint" aria-hidden="true">Real screenshot &mdash; click to open its official doc page</div>
  <a class="imglink" href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging" target="_blank" rel="noopener" aria-label="Open the Design for Driving Messaging apps page (source of this image) in a new tab">
    <img src="https://developers.google.com/cars/design/android-auto/apps/images/conversationalflow.png" alt="Official flow diagram on a light-blue background: message notification appears, decision user taps notification, No branch to message shows in notification center, Yes branch through message plays, reply to sender, compose reply, send reply." loading="lazy">
  </a>
  <figcaption>Official conversational flow diagram: &ldquo;Message notification appears&rdquo; &rarr; &ldquo;User taps notification?&rdquo; &rarr; &ldquo;Message plays&rdquo; &rarr; &ldquo;Reply to sender?&rdquo; &rarr; &ldquo;Compose reply&rdquo; &rarr; &ldquo;Send reply&rdquo; (or &ldquo;Message shows in notification center&rdquo;). Source: <a href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">Design for Driving — Messaging apps &#8599;</a></figcaption>
</figure>

<h3>Saved messages &amp; the Notification Center</h3>
<ul>
  <li>In addition to appearing briefly as incoming notifications (which are automatically dismissed if not addressed), messages also appear in the <strong>Notification Center</strong>, where users can interact with them later <a class="cite" href="https://developers.google.com/cars/design/android-auto/apps/saved-messages">source &#8599;</a></li>
  <li>Messages in the Notification Center are displayed as <strong>individual cards</strong>, <strong>ordered by time of arrival</strong> (most recent at the top), and <strong>capped in quantity</strong> to limit driver distraction <a class="cite" href="https://developers.google.com/cars/design/android-auto/apps/saved-messages">source &#8599;</a></li>
</ul>

<figure class="docimg">
  <div class="hint" aria-hidden="true">Real screenshot &mdash; click to open its official doc page</div>
  <a class="imglink" href="https://developers.google.com/cars/design/android-auto/apps/saved-messages" target="_blank" rel="noopener" aria-label="Open the Design for Driving Saved messages page (source of this image) in a new tab">
    <img src="https://developers.google.com/cars/design/android-auto/apps/images/notification-center.png" alt="Android Auto Notification Center in dark mode with two message cards — Laura Smith, New message, 2m and Jess Steele, New message, 30m — each with Play and Show message buttons." loading="lazy">
  </a>
  <figcaption>The Notification Center with two saved message cards (&ldquo;Laura Smith — New message &bull; 2m&rdquo; and &ldquo;Jess Steele — New message &bull; 30m&rdquo;), each with &ldquo;Play&rdquo; and &ldquo;Show message&rdquo; actions. Source: <a href="https://developers.google.com/cars/design/android-auto/apps/saved-messages">Design for Driving — Saved messages &#8599;</a></figcaption>
</figure>

<h2 id="quality-gates">Quality gates and distribution<span class="rule"></span></h2>
<ul>
  <li>Before submitting to Google Play, test the UX and check the app against the criteria for its category on <a href="https://developer.android.com/docs/quality-guidelines/car-app-quality">Android app quality for cars</a>.</li>
  <li>Messaging-specific quality criteria: <strong>MF-1..5</strong> (core tier) — receive/group/reply; <strong>short-form messaging only</strong>; must be a <strong>peer-to-peer service</strong> (not a notification service). For templated messaging: <strong>TMF-1</strong> (Tier 1) — conversations as described <a class="cite" href="https://developer.android.com/docs/quality-guidelines/car-app-quality">source &#8599;</a></li>
  <li>Apps for cars get an <strong>additional manual review</strong>; the Play team contacts you via Play Console email if requirements aren't met <a class="cite" href="https://developer.android.com/docs/quality-guidelines/car-app-quality">source &#8599;</a></li>
</ul>

<h3>Testing tools</h3>
<ul>
  <li><strong>Desktop Head Unit (DHU)</strong> — install and use it to run Android Auto apps during development <a class="cite" href="https://developer.android.com/training/cars/testing">source &#8599;</a></li>
  <li><strong>Android Auto developer mode</strong> — enable via the Android Auto &ldquo;About&rdquo; screen (tap &ldquo;Version and permission info&rdquo; 10 times) to unlock developer options <a class="cite" href="https://developer.android.com/training/cars/testing">source &#8599;</a></li>
  <li>To test in real vehicles, distribute via <strong>Internal App Sharing</strong> or an <strong>Internal Test Track</strong> to bypass the Play review process <a class="cite" href="https://developer.android.com/training/cars/testing">source &#8599;</a></li>
</ul>

<h2 id="carplay">How Apple CarPlay does it<span class="rule"></span></h2>
<div class="carplay-card">
  <div class="pill-row"><span class="pill"><span class="p-dot"></span>Apple CarPlay</span></div>
  <p>Apple's equivalent is the <strong>Communication</strong> app category in CarPlay, but the architecture is fundamentally different from Android's: <strong>messaging runs through Siri and SiriKit intents, not through a message UI on the car screen</strong> <a class="cite" href="https://developer.apple.com/documentation/carplay">source &#8599;</a></p>

  <h3>App category and entitlement</h3>
  <ul>
    <li>CarPlay classifies &ldquo;Communication&rdquo; as one of its supported app categories; a CarPlay messaging app requires the <strong><code>com.apple.developer.carplay-communication</code> entitlement</strong> (available since iOS 14) <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a></li>
    <li>Unlike Android — where any app can declare support in its manifest and ship — the entitlement must be <strong>requested from Apple</strong> at the <a href="https://developer.apple.com/contact/carplay">CarPlay Contact Us</a> page, requires agreeing to the <strong>CarPlay Entitlement Addendum</strong>, and <strong>Apple reviews each application using predefined criteria</strong> before adding the entitlement to the developer account via managed capabilities <a class="cite" href="https://developer.apple.com/documentation/carplay/requesting-carplay-entitlements">source &#8599;</a></li>
  </ul>

  <h3>Messaging = SiriKit intents, voice-first</h3>
  <ul>
    <li>Per the CarPlay Developer Guide, communication apps &ldquo;must provide <strong>short-form text messaging</strong>, VoIP calling, or both (<strong>email not permitted</strong>)&rdquo; <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a></li>
    <li>Text messaging apps <strong>must support</strong> <code>INSendMessageIntent</code>, <code>INSearchForMessagesIntent</code>, and <code>INSetMessageAttributeIntent</code> (SiriKit) <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a></li>
    <li>VoIP calling apps must support <strong>CallKit</strong> and <code>INStartCallIntent</code> <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a></li>
  </ul>

  <h3>Driver-distraction rules — the sharpest contrast</h3>
  <ul>
    <li>Apple's driver distraction requirements for all CarPlay apps explicitly state: <strong>&ldquo;Never show message/text/email content on the CarPlay screen.&rdquo;</strong> <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a></li>
    <li>In practice, a CarPlay messaging experience is voice-driven end-to-end: Siri reads incoming messages aloud and transcribes dictated replies <a class="cite" href="https://developer.apple.com/documentation/carplay">source &#8599;</a></li>
    <li>This contrasts with Android Auto, where the notification-powered path shows the conversation (sender, message, actions) in Android Auto's own messaging UI and reads it aloud <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></li>
  </ul>

  <h3>What's on screen: CPContactTemplate and general-purpose templates</h3>
  <ul>
    <li>The only CarPlay template exclusive to the communication entitlement is <strong><code>CPContactTemplate</code></strong> — &ldquo;a template that displays information about a person or a business&rdquo;, available only to apps with the <strong>communication or navigation</strong> entitlements <a class="cite" href="https://developer.apple.com/documentation/carplay/cpcontacttemplate">source &#8599;</a></li>
    <li>Communication-entitled apps get a template hierarchy depth of 5 <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a> and can also use general-purpose templates — <code>CPListTemplate</code>, <code>CPGridTemplate</code>, <code>CPTabBarTemplate</code>, plus alerts and action sheets <a class="cite" href="https://developer.apple.com/documentation/carplay/cplisttemplate">source &#8599;</a></li>
  </ul>

  <h3>Side-by-side: Android Auto vs Apple CarPlay (messaging)</h3>
  <table class="cmp">
    <thead>
      <tr>
        <th>Dimension</th>
        <th class="col-g"><span class="tag g">Google</span><br>Android Auto</th>
        <th class="col-a"><span class="tag a">Apple</span><br>Apple CarPlay</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="dim">App category</td>
        <td>&ldquo;Communication – messaging notifications&rdquo; (stable) and &ldquo;Communication – templated messaging&rdquo; (beta); category declared in the app's own manifest <a class="cite" href="https://developer.android.com/docs/quality-guidelines/car-app-quality">source &#8599;</a></td>
        <td>&ldquo;Communication&rdquo; category; requires Apple-granted entitlement <code>com.apple.developer.carplay-communication</code> <a class="cite" href="https://developer.apple.com/documentation/carplay/requesting-carplay-entitlements">source &#8599;</a></td></tr>
      <tr><td class="dim">Approval / entitlement</td>
        <td>No pre-approval to build; Google Play performs an additional manual car-quality review at submission <a class="cite" href="https://developer.android.com/docs/quality-guidelines/car-app-quality">source &#8599;</a></td>
        <td>Must request the entitlement from Apple, agree to the CarPlay Entitlement Addendum, and pass Apple's predefined-criteria review <a class="cite" href="https://developer.apple.com/documentation/carplay/requesting-carplay-entitlements">source &#8599;</a></td></tr>
      <tr><td class="dim">Core mechanism</td>
        <td>App posts <code>NotificationCompat.MessagingStyle</code> notifications with reply + mark-as-read <code>Action</code>s; Android Auto renders them in the car <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a>; beta templated path uses Car App Library <code>ConversationItem</code> <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></td>
        <td>App adopts SiriKit messaging intents (<code>INSendMessageIntent</code>, <code>INSearchForMessagesIntent</code>, <code>INSetMessageAttributeIntent</code>); Siri drives read/send by voice <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a></td></tr>
      <tr><td class="dim">Message content on car screen</td>
        <td>Yes — Android Auto's messaging UI shows the conversation <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a>; templated beta also shows conversation lists <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></td>
        <td><strong>No — never show message/text/email content on the CarPlay screen</strong> (explicit driver-distraction rule) <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a></td></tr>
      <tr><td class="dim">Voice interaction</td>
        <td>Read-aloud (TTS) + voice reply via <code>RemoteInput</code> transcription <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a>; single conversational flow per Design for Driving <a class="cite" href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">source &#8599;</a></td>
        <td>Siri reads messages aloud and transcribes replies via SiriKit support; voice-first by mandate <a class="cite" href="https://developer.apple.com/documentation/carplay">source &#8599;</a></td></tr>
      <tr><td class="dim">Screen templates for the category</td>
        <td>Car App Library templates (<code>ListTemplate</code>, <code>SectionedItemTemplate</code>, <code>ConversationItem</code> auto-actions) — beta only <a class="cite" href="https://developer.android.com/training/cars/communication/templated-messaging">source &#8599;</a></td>
        <td><code>CPContactTemplate</code> exclusive to the communication entitlement <a class="cite" href="https://developer.apple.com/documentation/carplay/cpcontacttemplate">source &#8599;</a>; general-purpose templates with hierarchy depth 5 <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a></td></tr>
      <tr><td class="dim">Platform availability</td>
        <td>Android Auto only — no driver-optimized messaging apps on Android Automotive OS <a class="cite" href="https://developer.android.com/training/cars/messaging">source &#8599;</a></td>
        <td>CarPlay (iPhone projection); CarPlay Ultra extends CarPlay to vehicle-owned screens <a class="cite" href="https://developer.apple.com/carplay/">source &#8599;</a></td></tr>
      <tr><td class="dim">Testing</td>
        <td>Desktop Head Unit; Android Auto developer mode; Internal App Sharing / Internal Test Track <a class="cite" href="https://developer.android.com/training/cars/testing">source &#8599;</a></td>
        <td>Xcode Simulator: I/O &gt; External Displays &gt; CarPlay <a class="cite" href="https://developer.apple.com/documentation/carplay/using-the-carplay-simulator">source &#8599;</a></td></tr>
    </tbody>
  </table>
  <div class="note"><strong>Where no direct equivalent exists:</strong> Android Auto's templated messaging (on-screen conversation browsing) has no CarPlay counterpart — Apple deliberately prohibits message content on screen and routes everything through Siri <a class="cite" href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">source &#8599;</a>. Conversely, Apple's entitlement-gated, pre-approved distribution model has no Android equivalent — Google relies on post-submission quality review rather than pre-granted entitlements <a class="cite" href="https://developer.android.com/docs/quality-guidelines/car-app-quality">source &#8599;</a></div>
</div>

<footer>
  <h3 style="margin-top:0">Sources</h3>
  <ol>
    <li><a href="https://developer.android.com/training/cars/messaging">Extend messaging notifications to Android Auto</a> — developer.android.com</li>
    <li><a href="https://developer.android.com/training/cars/communication/templated-messaging">Build templated messaging experiences for Android Auto</a> — developer.android.com</li>
    <li><a href="https://developer.android.com/training/cars/communication">Build communication apps for Android Auto</a> — developer.android.com</li>
    <li><a href="https://developer.android.com/training/cars/apps/library">Use the Android for Cars App Library</a> — developer.android.com</li>
    <li><a href="https://developer.android.com/training/cars/apps/auto">Add support for Android Auto to your templated app</a> — developer.android.com</li>
    <li><a href="https://developer.android.com/training/cars">Android for Cars overview</a> — developer.android.com</li>
    <li><a href="https://developer.android.com/training/cars/testing">Test Android apps for cars</a> — developer.android.com</li>
    <li><a href="https://developer.android.com/training/cars/distribute">Distribute to cars</a> — developer.android.com</li>
    <li><a href="https://developer.android.com/docs/quality-guidelines/car-app-quality">Android app quality for cars</a> — developer.android.com</li>
    <li><a href="https://developers.google.com/cars/design/android-auto/apps/voice-messaging">Design for Driving: Messaging apps</a> — developers.google.com</li>
    <li><a href="https://developers.google.com/cars/design/android-auto/apps/incoming-messages">Design for Driving: Incoming messages</a> — developers.google.com</li>
    <li><a href="https://developers.google.com/cars/design/android-auto/apps/saved-messages">Design for Driving: Saved messages</a> — developers.google.com</li>
    <li><a href="https://developer.apple.com/download/files/CarPlay-Developer-Guide.pdf">CarPlay Developer Guide (PDF)</a> — developer.apple.com</li>
    <li><a href="https://developer.apple.com/documentation/carplay">CarPlay framework overview</a> — developer.apple.com</li>
    <li><a href="https://developer.apple.com/documentation/carplay/requesting-carplay-entitlements">Requesting CarPlay entitlements</a> — developer.apple.com</li>
    <li><a href="https://developer.apple.com/documentation/carplay/cpcontacttemplate">CPContactTemplate</a> — developer.apple.com</li>
    <li><a href="https://developer.apple.com/documentation/carplay/cplisttemplate">CPListTemplate</a> — developer.apple.com</li>
    <li><a href="https://developer.apple.com/documentation/carplay/using-the-carplay-simulator">Using the CarPlay Simulator</a> — developer.apple.com</li>
    <li><a href="https://developer.apple.com/carplay/">CarPlay for developers (ecosystem overview)</a> — developer.apple.com</li>
  </ol>
  <p style="margin-top:18px">Internal knowledge brief &middot; Android answers grounded in official Android developer documentation; CarPlay answers grounded in Apple's official documentation.</p>
  <p class="back-to-top"><a href="#top">&uarr; Back to top</a></p>
</footer>
`;
