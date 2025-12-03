# 📸 Cloudinary Setup Guide for PlanetKids

Cloudinary is used for storing and serving product images in production (Vercel doesn't support filesystem uploads).

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click **"Sign Up Free"**
3. Sign up with:
   - Email
   - Google
   - GitHub

### Step 2: Get Your Credentials

After signing up, you'll be redirected to the Dashboard:

1. You'll see your credentials at the top:
   ```
   Cloud name: your-cloud-name
   API Key: 123456789012345
   API Secret: abc123def456...
   ```

2. **Copy these three values** - you'll need them next

### Step 3: Add to Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add these **3 variables** (for ALL environments):

   ```
   CLOUDINARY_CLOUD_NAME
   your-cloud-name
   
   CLOUDINARY_API_KEY
   123456789012345
   
   CLOUDINARY_API_SECRET
   abc123def456...
   ```

3. Click **Save** for each

### Step 4: Redeploy on Vercel

1. Go to **Deployments** tab
2. Click latest deployment → **"Redeploy"**
3. Wait ~1-2 minutes

### Step 5: Test Image Upload

1. Go to: https://your-site.vercel.app/admin/login
2. Login as admin
3. Go to **Products** → **Add New Product**
4. Fill in details and **upload images**
5. Click **Create**
6. ✅ Images will now be stored on Cloudinary!

---

## 📋 For Local Development (Optional)

Add to your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abc123def456..."
```

---

## 🎯 Cloudinary Features

### What's Included:

✅ **Free Tier:**
- 25 GB storage
- 25 GB bandwidth/month
- Automatic image optimization
- Format conversion (WebP, AVIF)
- Image transformations (resize, crop, etc.)

### How It Works:

1. **Upload:** Images are uploaded to Cloudinary via API
2. **Storage:** Stored in cloud (no server storage needed)
3. **Delivery:** Served via CDN (fast worldwide)
4. **Optimization:** Automatically optimized for web

### Image Transformations:

Images are automatically:
- Resized to max 1000x1000px
- Quality optimized
- Format converted for best performance
- Cached on CDN

---

## 🔧 Cloudinary Dashboard

Access your dashboard: https://console.cloudinary.com/console

### Useful Features:

1. **Media Library** - View all uploaded images
2. **Reports** - Check usage and bandwidth
3. **Settings** - Configure upload presets
4. **Transformations** - Customize image processing

---

## 📊 Folder Structure

Your images are organized in Cloudinary:

```
planetkids/
  └── products/
      ├── 1701234567890-product-1.jpg
      ├── 1701234567891-product-2.jpg
      └── ...
```

---

## 🆘 Troubleshooting

### Error: "Upload failed"
- Check if credentials are correct in Vercel
- Verify Cloudinary account is active
- Check console logs in Vercel

### Images not loading
- Check if URLs start with `https://res.cloudinary.com/`
- Verify images exist in Cloudinary Media Library
- Check browser console for CORS errors

### Slow uploads
- Cloudinary free tier has rate limits
- Consider upgrading if needed
- Images are optimized during upload (takes a few seconds)

---

## 💰 Pricing

**Free Tier (Perfect for starting):**
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

**Paid Plans (if you grow):**
- Start at $99/month for more storage/bandwidth
- Pay-as-you-go options available

---

## 🔐 Security

**Best Practices:**

✅ Never commit API secrets to git
✅ Use environment variables only
✅ Keep `.env` file in `.gitignore`
✅ Rotate API keys if exposed
✅ Use signed uploads for sensitive content

---

## 📚 Additional Resources

- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Node.js SDK:** https://cloudinary.com/documentation/node_integration
- **Image Transformations:** https://cloudinary.com/documentation/image_transformations
- **API Reference:** https://cloudinary.com/documentation/image_upload_api_reference

---

## ✅ Setup Complete!

Once configured, your PlanetKids store will:
- ✅ Upload images to Cloudinary automatically
- ✅ Serve optimized images via CDN
- ✅ Work perfectly on Vercel
- ✅ Handle thousands of images effortlessly

**Now you can add products with images on your live site!** 🎉
