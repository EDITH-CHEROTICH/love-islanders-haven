
# App Icon Requirements

This document outlines the requirements for your dating app icon.

## Primary Icon (512x512px)

The 512x512px icon is the master image used for:
- Google Play Store listing
- Generating all other icon sizes

### Specifications:
- **Dimensions:** Exactly 512 x 512 pixels
- **Format:** PNG (with transparency if needed)
- **Max file size:** 1MB
- **Background:** If using transparency, ensure it looks good on both light and dark backgrounds

### Design Guidelines:
- Use simple, recognizable imagery
- Include adequate padding (10-15%) around the main element
- Avoid small text or complex details
- Use colors that match your app's theme (purple gradient)

## Icon Generation

You can automatically generate all required icon sizes from your 512x512px master image using Capacitor's asset generation tool:

```bash
# Install the required packages if needed
npm install @capacitor/assets

# Generate all required icon sizes
npx @capacitor/assets generate --iconBackgroundColor=#673AB7 --splashBackgroundColor=#1A1F2C
```

This will create all necessary icon sizes for both Android and iOS platforms.

## Icon Placement

Place your 512x512px master icon at:
```
public/app-icon.png
```

After generating the various sizes, they will be placed in the appropriate platform-specific directories.

## Testing

Before final submission, test your icon by:
1. Viewing it at multiple sizes
2. Checking it against different background colors
3. Ensuring it's recognizable even at smaller dimensions

