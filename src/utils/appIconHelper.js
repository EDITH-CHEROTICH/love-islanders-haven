
/**
 * App Icon Helper
 * 
 * This script provides guidance for preparing a 512x512px icon for your dating app
 */

console.log('\x1b[36m%s\x1b[0m', '=================================================');
console.log('\x1b[36m%s\x1b[0m', '   APP ICON PREPARATION GUIDE - 512x512px   ');
console.log('\x1b[36m%s\x1b[0m', '=================================================');
console.log('\n');

console.log('\x1b[33m%s\x1b[0m', '1. Icon Requirements:');
console.log('   - Your app icon should be exactly 512x512 pixels');
console.log('   - Use a PNG format with transparency if needed');
console.log('   - Keep the file size under 1MB for best performance\n');

console.log('\x1b[33m%s\x1b[0m', '2. Design Recommendations:');
console.log('   - Ensure the design is recognizable even at smaller sizes');
console.log('   - Use a simple, clean design with minimal text');
console.log('   - Match your app\'s color scheme (the purple gradient theme)');
console.log('   - Apply adequate padding around the main element (about 10-15%)\n');

console.log('\x1b[33m%s\x1b[0m', '3. Preparing Your Image:');
console.log('   - You can use design tools like Figma, Photoshop, or Canva');
console.log('   - Online tool recommendation: https://www.canva.com/create/app-icons/');
console.log('   - Make sure the icon is centered within the square canvas\n');

console.log('\x1b[33m%s\x1b[0m', '4. Testing Your Icon:');
console.log('   - View it at different sizes to ensure clarity');
console.log('   - Check how it looks on both light and dark backgrounds');
console.log('   - Verify it scales well to smaller sizes (96px, 72px, etc.)\n');

console.log('\x1b[33m%s\x1b[0m', '5. Using Your 512x512px Icon:');
console.log('   - This size is primarily for app store listings');
console.log('   - For actual device display, Android will resize it automatically');
console.log('   - Place your final icon in: public/app-icon.png');
console.log('   - Update capacitor.config.ts to reference this icon\n');

console.log('\x1b[32m%s\x1b[0m', 'For automatic icon generation from your 512x512px image:');
console.log('Run: npx @capacitor/assets generate --iconBackgroundColor=#673AB7 --splashBackgroundColor=#1A1F2C\n');

console.log('\x1b[36m%s\x1b[0m', 'Good luck with your app icon preparation!');

