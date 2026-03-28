# AssetTrack — Nonprofit Technology Manager

## 🚀 Quick Start (Local Dev)

```bash
cd assettrack
cp .env.example .env        # then fill in your Supabase credentials
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔌 Supabase Setup (One Time)

### Step 1 — Create a free Supabase project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**, give it a name (e.g. `assettrack`), set a password
3. Wait ~2 min for it to provision

### Step 2 — Run the database SQL
1. In your Supabase project go to **SQL Editor**
2. Open `SUPABASE_SETUP.sql` from this folder, paste it in, click **Run**
3. This creates the `assets` table and security rules

### Step 3 — Get your API credentials
1. Go to **Settings → API** in your Supabase project
2. Copy **Project URL** and **anon public** key
3. Paste them into your `.env` file:

```
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Step 4 — Create user accounts for your team
1. Go to **Authentication → Users** in Supabase
2. Click **Invite User** (or **Add User**)
3. Enter each team member's email + a password
4. They log in at your app URL with those credentials

---

## 🌐 Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel           # follow the prompts
```

When Vercel asks for environment variables, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Your app will be live at `https://assettrack-xxx.vercel.app`

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── supabase.js        ← Supabase client (reads from .env)
│   └── assetService.js    ← All database operations
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx  ← Login + forgot password screen
│   │   └── LoginPage.module.css
│   ├── asset/             ← AssetTable, AssetForm, AssetDetail
│   ├── modals/            ← BarcodeScanner, ImportModal, Dashboard
│   └── ui/                ← Modal, Badge
├── App.jsx                ← Main app + auth state
├── constants.js           ← Departments, locations, device types
└── index.css              ← Global styles
```

---

## 👥 Managing Users

All user management is done in Supabase — no code needed:
- **Add user**: Authentication → Users → Invite User
- **Reset password**: Authentication → Users → click user → Send reset email
- **Remove access**: Authentication → Users → Delete user

---

## 🔒 Security Notes

- `.env` is in `.gitignore` — your keys are never committed to Git
- Row Level Security (RLS) is enabled — users can only access data when logged in
- Passwords are handled entirely by Supabase (hashed, never stored in plaintext)
