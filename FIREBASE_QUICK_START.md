# Quick Firebase Setup Checklist

## ⚡ Quick Start (5 minutes)

### 1️⃣ Create Firebase Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Name it (e.g., "yubol-impressions")
- [ ] Create project

### 2️⃣ Enable Realtime Database
- [ ] Click "Realtime Database" in sidebar
- [ ] Click "Create Database"
- [ ] Choose location (e.g., us-central1)
- [ ] Start in **test mode**
- [ ] Click "Enable"

### 3️⃣ Get Configuration
- [ ] Click ⚙️ → "Project settings"
- [ ] Scroll to "Your apps"
- [ ] Click Web icon `</>`
- [ ] Copy the `firebaseConfig` object

### 4️⃣ Update Your Code
- [ ] Open `assets/js/word-cloud.js`
- [ ] Replace the `firebaseConfig` object (around line 20)
- [ ] Paste your actual Firebase config
- [ ] Save file

### 5️⃣ Set Security Rules
- [ ] In Firebase Console → Realtime Database → Rules
- [ ] Copy rules from `FIREBASE_SETUP.md` Step 5
- [ ] Click "Publish"

### 6️⃣ Test Locally
```bash
bundle exec jekyll serve
```
- [ ] Visit http://localhost:4000/impressions/
- [ ] Add a word
- [ ] Refresh page - word should still be there
- [ ] Open in incognito - word should appear there too!

### 7️⃣ Deploy
```bash
git add .
git commit -m "Add Firebase word cloud"
git push
```

## 🔧 Your Firebase Config Location

**File:** `assets/js/word-cloud.js`  
**Line:** ~20

Replace this:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

With your actual config from Firebase!

## ✅ You're Done!

Your word cloud will now:
- ✨ Be shared across all visitors
- 🔄 Update in real-time
- 💾 Persist forever (until you delete it)
- 🚀 Work on GitHub Pages

**Live URL:** https://yubol-bobo.github.io/impressions/

---

💡 **Tip:** See `FIREBASE_SETUP.md` for detailed instructions and troubleshooting.
