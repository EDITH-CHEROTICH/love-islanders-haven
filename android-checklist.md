
# Android App Deployment Checklist

This checklist helps you prepare and deploy your Love Islanders Haven app to the Google Play Store.

## Pre-deployment Requirements

- [ ] Google Play Developer account ($25 one-time fee)
- [ ] App icon in various resolutions
- [ ] Screenshots of your app (at least 2)
- [ ] Short description (max 80 characters)
- [ ] Full description (max 4000 characters)
- [ ] Privacy policy URL

## Build and Package

- [ ] Update version code and version name in `android/app/build.gradle`
- [ ] Run `npm run build` to create production build
- [ ] Run `npx cap sync android` to update Android project
- [ ] Create signing key (if you don't have one)
- [ ] Generate signed Android App Bundle (AAB) or APK

## Google Play Console Tasks

- [ ] Create new app in Google Play Console
- [ ] Complete store listing information
- [ ] Upload app bundle/APK
- [ ] Set up content rating
- [ ] Configure pricing & distribution
- [ ] Add release notes (for updates)

## Testing Recommendations

- [ ] Test on multiple Android versions
- [ ] Test on different screen sizes
- [ ] Check all app features work as expected
- [ ] Verify app permissions

## Helpful Commands

```bash
# Build production version
npm run build

# Sync changes to Android platform
npx cap sync android

# Open Android Studio
npx cap open android
```

## Generating a Signed APK/AAB in Android Studio

1. Open Android Studio with `npx cap open android`
2. Go to Build > Generate Signed Bundle/APK
3. Select Android App Bundle or APK
4. Create a new key store or use existing one
5. Fill in the required information
6. Generate your signed file

Remember to keep your keystore file and password safe. You'll need the same key for all future updates!
