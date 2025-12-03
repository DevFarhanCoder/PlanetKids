# 🔐 VERCEL ENVIRONMENT VARIABLES - QUICK SETUP

## ⚠️ CRITICAL: Set These in Vercel Dashboard NOW

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## 1️⃣ DATABASE_URL (Required)

### Option A: Vercel Postgres
```
Dashboard → Storage → Create Database → Postgres
Copy the connection string provided
```

### Option B: Supabase (Free)
```
1. Go to https://supabase.com
2. Create project
3. Settings → Database → Connection String (Pooling)
4. Use the Transaction mode URL

Format:
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### Option C: Neon (Free)
```
1. Go to https://neon.tech
2. Create project
3. Copy connection string

Format:
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

---

## 2️⃣ NEXTAUTH_SECRET (Required)

Generate a secure random string (minimum 32 characters):

### Method 1: Online Generator
```
Visit: https://generate-secret.vercel.app/32
Copy the generated secret
```

### Method 2: OpenSSL Command (if you have it)
```bash
openssl rand -base64 32
```

### Method 3: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Example format:**
```
NEXTAUTH_SECRET=xK8mP9nQ2rS5tU6vW7xY8zA1bC2dE3fG4hI5jK6lM7n=
```

---

## 3️⃣ NEXTAUTH_URL (Required)

Your Vercel deployment URL:

**After first deployment:**
```
NEXTAUTH_URL=https://your-project-name.vercel.app
```

**For preview deployments:**
```
NEXTAUTH_URL=https://your-project-name-git-main-username.vercel.app
```

---

## 📝 How to Add Variables in Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select Your Project**
   - Click on "PlanetKids" project

3. **Navigate to Settings**
   - Click "Settings" tab
   - Click "Environment Variables" in left sidebar

4. **Add Each Variable**
   - Variable Name: `DATABASE_URL`
   - Value: [your database URL]
   - Environment: **Select ALL** (Production, Preview, Development)
   - Click "Save"

5. **Repeat for All Variables**
   - Add `NEXTAUTH_SECRET`
   - Add `NEXTAUTH_URL`

6. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## ✅ Verification Checklist

After adding environment variables:

- [ ] `DATABASE_URL` added for all environments
- [ ] `NEXTAUTH_SECRET` added for all environments  
- [ ] `NEXTAUTH_URL` added for all environments
- [ ] Clicked "Save" for each variable
- [ ] Triggered a redeploy
- [ ] Checked deployment logs for success
- [ ] No "Environment variable not found" errors

---

## 🚀 Quick Database Setup Options

### For Testing/Development (Free):

**Supabase (Recommended for beginners)**
- Free tier: 500MB database
- Easy setup with GUI
- Built-in authentication option
- https://supabase.com

**Neon (Good for production)**
- Free tier: 0.5GB storage
- Serverless Postgres
- Good performance
- https://neon.tech

### For Production:

**Vercel Postgres**
- Integrated with Vercel
- Automatic connection pooling
- Simple setup
- Starting at $20/month

---

## 🆘 Troubleshooting

### Issue: "DATABASE_URL is not defined"
- Verify variable is saved in Vercel Dashboard
- Check it's enabled for ALL environments
- Try redeploying

### Issue: "Invalid connection string"
- Check format includes `?sslmode=require` for most providers
- Verify password doesn't contain special characters that need encoding
- Try connection string with quotes in Vercel

### Issue: "Cannot reach database server"
- Ensure database is running
- Check firewall/IP restrictions
- Verify SSL mode is correct

---

## 📞 Next Steps After Setting Variables

1. **Redeploy on Vercel** - Trigger new deployment
2. **Check Build Logs** - Verify no errors
3. **Initialize Database** - Run `npx prisma db push`
4. **Create Admin User** - Use the API endpoint
5. **Test Login** - Visit `/admin/login`

---

**Pro Tip:** Keep your environment variables in a secure password manager!

