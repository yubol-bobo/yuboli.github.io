# Firebase Setup Guide for Word Cloud

This guide will help you set up Firebase Realtime Database for your impressions word cloud feature.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "yubol-impressions")
4. (Optional) Disable Google Analytics if you don't need it
5. Click "Create project"

## Step 2: Set Up Realtime Database

1. In your Firebase project dashboard, click on "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (closest to your audience, e.g., `us-central1`)
4. **Important:** Start in **test mode** for now (we'll secure it later)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the **Web** icon `</>`
5. Register your app with a nickname (e.g., "Word Cloud Web App")
6. **Copy the firebaseConfig object** - it will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

## Step 4: Update Your Code

1. Open `assets/js/word-cloud.js`
2. Find the `firebaseConfig` object (around line 20)
3. **Replace the placeholder values** with your actual Firebase config
4. Save the file

**Before:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // ... other placeholder values
};
```

**After:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "yubol-impressions.firebaseapp.com",
  // ... your actual values from Firebase
};
```

## Step 5: Set Up Security Rules (IMPORTANT!)

By default, test mode allows anyone to read/write. Let's add better security:

1. In Firebase Console, go to "Realtime Database"
2. Click on the "Rules" tab
3. Replace the rules with this:

```json
{
  "rules": {
    "impressions": {
      "words": {
        ".read": true,
        "$word": {
          ".write": "!data.exists() || newData.val() > data.val()",
          ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= data.val() + 10"
        }
      }
    }
  }
}
```

**What these rules do:**
- ✅ Anyone can **read** the word cloud data
- ✅ Anyone can **add new words**
- ✅ Anyone can **increment** existing word counts (but only by max 10 at a time)
- ❌ No one can **decrease** counts or **delete** words
- ❌ No one can write to other parts of the database

4. Click "Publish"

## Step 6: Test Your Setup

1. Build and serve your Jekyll site:
   ```bash
   bundle exec jekyll serve
   ```

2. Open your browser to `http://localhost:4000/impressions/`

3. Try adding some words - they should appear in the cloud and persist across page refreshes

4. Open the page in a **different browser or incognito window** - you should see the same words!

## Step 7: Deploy to GitHub Pages

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add Firebase-powered word cloud impressions page"
   git push
   ```

2. GitHub Pages will automatically deploy your site

3. Visit `https://yubol-bobo.github.io/impressions/` to see your live word cloud!

## Monitoring Usage

### View Your Data
1. Go to Firebase Console → Realtime Database → Data tab
2. You'll see all submitted words under `impressions/words/`

### Check Usage
1. Go to Firebase Console → Realtime Database → Usage tab
2. Free tier includes:
   - 100 simultaneous connections
   - 1 GB stored data
   - 10 GB/month downloaded

This should be more than enough for a personal website!

## Troubleshooting

### Words not saving?
- Check browser console (F12) for errors
- Verify your Firebase config is correct
- Make sure you published the security rules

### "Permission denied" error?
- Check your security rules
- Make sure the rules allow writes to `impressions/words/`

### Can't see words from other visitors?
- Verify `databaseURL` in your config includes `-default-rtdb`
- Check that you're connected to the internet
- Look at Firebase Console → Realtime Database → Data to see if data is being saved

## Security Notes

- Your API key is **safe to expose** in client-side code - it just identifies your project
- The security rules control what can be read/written
- Consider adding rate limiting if you get spam (Firebase has built-in abuse prevention)
- You can always export your data from Firebase Console

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs/database)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/database/security)

---

**That's it!** Your word cloud will now be shared across all visitors in real-time! 🎉
