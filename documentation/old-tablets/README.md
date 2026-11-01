# Older Android tablets

Many wall tablets run an old Android System WebView. This page says which ones Magic Card supports and what to expect on the oldest.

## The floor

Magic Card needs Chromium 85 or newer. On Android that means Android System WebView 85, which is the same version number as Chrome. An older WebView still loads Home Assistant, but Magic Card does not run on it.

The other engines Magic Card supports are Safari and iOS 16.4 and the current Firefox ESR.

## What has been checked

Magic Card was checked on a desktop copy of Chromium 85.0.4183.0, the engine of Android System WebView 85. It has not been checked on a real tablet.

-   **Cards show on this engine.** The [old engine check](old-engine-check.md) shows two animated cards on it.
-   **Some animation effects do not show.** The bell swing, the glow around a button and the ripple rings are missing on Chromium 85, because the engine lacks CSS features those effects use. Magic Card has no simpler version of them today. The cards still draw and the other effects still run.
-   **Particle layers fade in.** A particle layer now fades in over 200 ms when its file arrives. With reduced motion switched on, a particle simulation appears at once and a ripple layer stays hidden. On Chromium 85 the fade runs, but a ripple layer has no size there, so you see nothing.
-   **Loading can stutter.** When one of the extra files arrives, the engine was measured to take 100 to 183 ms to draw the next frame, with the CPU slowed to a quarter of its speed. A frame should take 50 ms or less, so this is over. A change to how the files load was tried, measured worse and was removed. Loading works as it did before.
-   **No speed claim.** These numbers come from a desktop, not from a tablet, so Magic Card makes no claim about how fast it runs on yours.

## Guest network

An old WebView no longer gets security fixes. If you cannot update the tablet, put it on your guest network, away from the devices you care about. Log it in to Home Assistant as a limited kiosk user, not an administrator, and use the tablet only for the dashboard.

## Report a problem

When you open a bug report, the form asks for the browser version as a range. The answer is optional. Like the rest of the report, it is public.
