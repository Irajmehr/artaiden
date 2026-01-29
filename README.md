# Artin & Aiden Behavior Tracker

A professional, mobile-optimized behavior tracking app with Google Sheets cloud sync.

## Features

- 🔐 Password protected (password: `artaiden`)
- 📊 Daily & weekly history tracking  
- 🎁 Rewards system with milestones
- 🚫 Automatic restrictions for negative scores
- ☁️ Google Sheets cloud sync
- 📱 Mobile-optimized design
- 🎨 Earthy sandy color scheme
- ➕➖ Simple +/- buttons for each behavior
- 📁 Categories: Punctuality, Eating, Learning, Character, Responsibility, Screen Time

## Files

1. **index.html** - The main app
2. **netlify.toml** - Netlify deployment config
3. **google-apps-script.js** - Backend code for Google Sheets

---

## 🚀 GitHub + Netlify Auto-Deploy Setup

### Step 1: Push to GitHub

```bash
# Clone your repo
git clone https://github.com/Irajmehr/artaiden.git
cd artaiden

# Copy the files (index.html, netlify.toml) into this folder

# Push to GitHub
git add .
git commit -m "Update behavior tracker"
git push origin main
```

### Step 2: Connect Netlify to GitHub (One-time setup)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select repository: `Irajmehr/artaiden`
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click **Deploy site**

### Step 3: Set Custom Domain (Optional)

1. In Netlify dashboard → **Domain settings**
2. Add custom domain or use the provided `.netlify.app` URL

### 🔄 Auto-Deploy

After setup, every time you push to GitHub, Netlify will automatically deploy!

## Setting Up Google Sheets (Optional but Recommended)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Behavior Tracker Data"

### Step 2: Add Apps Script
1. In your spreadsheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Copy and paste the entire contents of `google-apps-script.js`
4. Click **Save** (disk icon)

### Step 3: Deploy as Web App
1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" → Choose **Web app**
3. Set:
   - Description: "Behavior Tracker API"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Authorize** when prompted (click through warnings - it's your own script)
6. Copy the **Web app URL**

### Step 4: Add URL to App
1. Open `index.html` in a text editor
2. Find this line near the top:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your copied URL
4. Save and re-deploy to Netlify

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Sand Primary | #C9A882 | Primary accent |
| Sand Light | #D4B996 | Secondary backgrounds |
| Sand Lighter | #E5D4B7 | Borders, backgrounds |
| Fern Green | #4F7942 | Positive actions |
| Sky Blue | #87CEEB | Info elements |
| Slate | #4A4A4A | Text |
| Danger | #B85C38 | Negative actions |

## Behaviors Included

### Positive (+points)
- Punctuality: Waking up on time, ready for school, homework time, bed on time
- Eating: Breakfast, lunch, vegetables, fruits, finishing meals
- Learning: Homework, reading books, finishing chapters
- Character: Kind words, sharing, manners, helping
- Responsibility: Chores, basketball

### Negative (-points)
- Waking late, late for tasks
- YouTube shorts
- Picky eating, refusing vegetables
- Curse words, fighting, talking back
- Skipping basketball

## Rewards

| Reward | Points Required |
|--------|-----------------|
| 15 min Game Time | 20 |
| 30 min TV Time | 30 |
| 30 min Game Time | 35 |
| Special Snack | 40 |
| Movie Night | 50 |
| Stay Up 30min Late | 60 |
| 1 Hour Game Time | 75 |
| Free Wish Bonus | 100 |
| Boss of Home (1hr) | 150 |
| Special Outing | 200 |

## Automatic Restrictions

When score drops below:
- 0: No Game Time
- -10: No TV Time
- -20: No YouTube
- -30: Early Bedtime
- -50: No Weekend Fun

---

Made with ❤️ for Artin & Aiden
