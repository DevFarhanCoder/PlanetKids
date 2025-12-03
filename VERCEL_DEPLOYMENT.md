# 🚀 Deploy PlanetKids to Vercel

## Step 1: Push to GitHub ✅ (DONE!)
Your code is now at: https://github.com/DevFarhanCoder/PlanetKids

## Step 2: Set Up Production Database

### Option A: Vercel Postgres (Recommended - Easy)
1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `DATABASE_URL` connection string

### Option B: External Database (Supabase/Neon/Railway)
**Supabase (Free tier available):**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the connection string

**Neon (Free tier available):**
1. Go to https://neon.tech
2. Create new project
3. Copy the connection string

## Step 3: Deploy to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Your Repository:**
   - Click "Add New" → "Project"
   - Select "DevFarhanCoder/PlanetKids"
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables:**
   Click "Environment Variables" and add these THREE variables:

   ```
   DATABASE_URL
   postgresql://username:password@host:port/database
   (Your production database URL from Step 2)

   NEXTAUTH_SECRET
   (Generate at: https://generate-secret.vercel.app/32)

   NEXTAUTH_URL
   https://your-project-name.vercel.app
   (You'll get this after deployment - can update later)
   ```

5. **Click "Deploy"** 🚀

## Step 4: After First Deployment

1. **Get Your Vercel URL:**
   - You'll see something like: `https://planet-kids-xyz123.vercel.app`

2. **Update NEXTAUTH_URL:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Edit `NEXTAUTH_URL` to your actual Vercel URL
   - Redeploy: Deployments → ... → Redeploy

3. **Set Up Database:**
   Open Vercel terminal or use your local terminal:
   ```bash
   # Set DATABASE_URL in your terminal
   npx prisma db push
   ```

4. **Create Admin User:**
   Two options:

   **Option A - Via API (Easiest):**
   ```bash
   curl -X POST https://your-project.vercel.app/api/setup/admin \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@planetkids.com","password":"admin123","name":"Admin"}'
   ```

   **Option B - Via Prisma Studio:**
   ```bash
   npx prisma studio
   # Manually create user with hashed password
   ```

5. **Seed Categories (Optional):**
   ```bash
   node scripts/seed-categories.js
   ```

## Step 5: Access Your Live Website

- **Website:** https://your-project.vercel.app
- **Admin Login:** https://your-project.vercel.app/admin/login
  - Email: `admin@planetkids.com`
  - Password: `admin123` (change this immediately!)

## Step 6: Give Admin Access to Others

To give someone admin access:

1. **Option A: Create New Admin User**
   - Use the same API endpoint with different credentials
   - Send them their login details

2. **Option B: Share Existing Credentials**
   - Share the admin email/password securely
   - They can login at: https://your-project.vercel.app/admin/login

## Important Notes:

✅ **Automatic Deployments:**
   - Any push to `main` branch auto-deploys to Vercel
   - Product uploads by admin are instantly live!

✅ **Image Storage:**
   - Vercel has a file size limit
   - For production, consider using:
     - Cloudinary
     - AWS S3
     - Vercel Blob Storage

✅ **Database Backups:**
   - Set up automatic backups for your production database
   - Most providers offer this feature

## Troubleshooting:

**Build fails?**
- Check environment variables are set correctly
- Check build logs in Vercel dashboard

**Database connection issues?**
- Verify DATABASE_URL is correct
- Check if database allows external connections
- Whitelist Vercel IPs if needed

**Images not showing?**
- Uploaded images are stored in Vercel's filesystem
- They persist during the deployment
- For better reliability, use external storage (Cloudinary/S3)

## Custom Domain (Optional):

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., planetkids.com)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

---

## 🎉 You're Done!

Your website is now live and anyone can:
1. Visit your website
2. Admin can login and upload products
3. Products automatically appear on the website
4. Share the link with anyone!

**Need help?** Check Vercel docs: https://vercel.com/docs
