
# Android App Icon Setup Guide

This guide will help you set up the provided silhouette image as your Android app icon.

## Step 1: Prepare Your Icon Images

The image you've provided (`public/lovable-uploads/3ece49ae-c98d-469f-a127-f7e646e3016d.png`) needs to be:

1. Cropped to a square format
2. Resized to the following dimensions:
   - ldpi: 36x36 px
   - mdpi: 48x48 px
   - hdpi: 72x72 px
   - xhdpi: 96x96 px
   - xxhdpi: 144x144 px
   - xxxhdpi: 192x192 px
   - Play Store: 512x512 px

You can use image editing tools like Photoshop, GIMP, or online tools like Canva or [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) to generate these different sizes.

## Step 2: Add the Icons to Your Android Project

After running `npx cap add android` (if you haven't already), follow these steps:

1. Navigate to your Android project's resource directory:
   ```
   android/app/src/main/res/
   ```

2. Replace the existing icon files in the following directories with your resized images:
   - mipmap-ldpi/
   - mipmap-mdpi/
   - mipmap-hdpi/
   - mipmap-xhdpi/
   - mipmap-xxhdpi/
   - mipmap-xxxhdpi/

3. For modern Android versions, set up adaptive icons:
   - Update files in `mipmap-anydpi-v26/` to reference your foreground and background

## Step 3: Update Your Android Manifest

Make sure your `AndroidManifest.xml` file references the correct icon:

```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    ...
```

## Step 4: Sync and Build Your Project

After adding the icon files:

1. Run `npx cap sync android` to sync your web code with the Android project
2. Open the Android project in Android Studio: `npx cap open android`
3. Build and run your project to see the icon in action

## Additional Tips

- For the best results, ensure your icon looks good on different backgrounds
- Test how your icon looks on devices with different screen densities
- The Play Store requires a 512x512 px version of your icon

Your silhouette image with the purple background should make an attractive app icon once properly formatted to these specifications.
