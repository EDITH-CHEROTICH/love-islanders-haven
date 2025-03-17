
// This script guides you through preparing your Android app for deployment to the Play Store
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for better output formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.cyan}============================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}  ANDROID APP DEPLOYMENT HELPER${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}============================================${colors.reset}\n`);

const runCommand = (command, errorMessage) => {
  try {
    console.log(`${colors.yellow}Executing: ${command}${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.bright}Error: ${errorMessage}${colors.reset}`);
    console.error(error.message);
    return false;
  }
};

const steps = [
  {
    title: 'Build Production Version',
    action: () => {
      console.log(`\n${colors.bright}${colors.green}Step 1: Building production version of your app${colors.reset}`);
      return runCommand('npm run build', 'Failed to build the production version.');
    }
  },
  {
    title: 'Sync Android Project',
    action: () => {
      console.log(`\n${colors.bright}${colors.green}Step 2: Syncing web code to the Android platform${colors.reset}`);
      return runCommand('npx cap sync android', 'Failed to sync code to Android platform.');
    }
  },
  {
    title: 'Configure Version Info',
    action: () => {
      console.log(`\n${colors.bright}${colors.green}Step 3: Configure app version${colors.reset}`);
      console.log(`${colors.yellow}Before generating a signed APK/AAB, you need to set the version code and name in android/app/build.gradle${colors.reset}`);
      console.log(`${colors.yellow}Look for the 'android { defaultConfig {' section and update:${colors.reset}`);
      console.log(`${colors.cyan}- versionCode: An integer that increases with each release (e.g., 1, 2, 3)${colors.reset}`);
      console.log(`${colors.cyan}- versionName: A string representing the version (e.g., "1.0.0")${colors.reset}\n`);
      
      return new Promise(resolve => {
        rl.question(`${colors.bright}Press Enter when you've updated the version information or wish to continue...${colors.reset}`, () => {
          resolve(true);
        });
      });
    }
  },
  {
    title: 'Open Android Studio',
    action: () => {
      console.log(`\n${colors.bright}${colors.green}Step 4: Opening Android Studio${colors.reset}`);
      console.log(`${colors.yellow}In Android Studio, you will need to:${colors.reset}`);
      console.log(`${colors.cyan}1. Go to Build > Generate Signed Bundle/APK${colors.reset}`);
      console.log(`${colors.cyan}2. Select Android App Bundle or APK based on your needs${colors.reset}`);
      console.log(`${colors.cyan}3. Create a new keystore or use an existing one${colors.reset}`);
      console.log(`${colors.cyan}4. Fill in the required information and generate your signed file${colors.reset}\n`);
      
      return runCommand('npx cap open android', 'Failed to open Android Studio.');
    }
  }
];

const runSteps = async () => {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`\n${colors.magenta}[${i + 1}/${steps.length}] ${step.title}${colors.reset}`);
    
    const result = await step.action();
    if (!result) {
      console.log(`\n${colors.bright}Step failed. Please fix the issues before continuing.${colors.reset}`);
      askForNextStep(i);
      return;
    }
    
    if (i < steps.length - 1) {
      await askForNextStep(i + 1);
    } else {
      finishProcess();
    }
  }
};

const askForNextStep = (nextIndex) => {
  return new Promise(resolve => {
    if (nextIndex >= steps.length) {
      finishProcess();
      resolve();
      return;
    }
    
    const nextStep = steps[nextIndex];
    rl.question(`\n${colors.bright}Ready to proceed to "${nextStep.title}"? (y/n) ${colors.reset}`, async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        resolve();
      } else {
        console.log(`\n${colors.yellow}Deployment process paused. Run this script again when you're ready to continue.${colors.reset}`);
        rl.close();
        process.exit(0);
      }
    });
  });
};

const finishProcess = () => {
  console.log(`\n${colors.bright}${colors.green}============================================${colors.reset}`);
  console.log(`${colors.bright}${colors.green}  ANDROID DEPLOYMENT PREPARATION COMPLETE${colors.reset}`);
  console.log(`${colors.bright}${colors.green}============================================${colors.reset}\n`);
  
  console.log(`${colors.cyan}Next steps for Google Play Store submission:${colors.reset}`);
  console.log(`${colors.yellow}1. Create a Google Play Developer account if you don't have one${colors.reset}`);
  console.log(`${colors.yellow}2. Go to the Google Play Console and create a new app${colors.reset}`);
  console.log(`${colors.yellow}3. Complete the store listing (descriptions, screenshots, etc.)${colors.reset}`);
  console.log(`${colors.yellow}4. Upload your signed AAB/APK file${colors.reset}`);
  console.log(`${colors.yellow}5. Set up pricing and distribution${colors.reset}`);
  console.log(`${colors.yellow}6. Submit for review${colors.reset}\n`);
  
  console.log(`${colors.bright}Good luck with your app submission!${colors.reset}\n`);
  
  rl.close();
};

// Start the process
runSteps();
