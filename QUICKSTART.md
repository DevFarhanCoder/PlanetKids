# PlanetKids - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL if not already installed
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql

# Create database
createdb planetkids

# Update .env with your connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/planetkids"
```

**Option B: Cloud Database (Recommended)**
- [Supabase](https://supabase.com/) (Free tier available)
- [Neon](https://neon.tech/) (Free tier available)
- [Railway](https://railway.app/) (Free tier available)

### Step 3: Initialize Database
```bash
npm run db:push
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 📋 Next Steps

### 1. Google OAuth Setup (Optional but Recommended)

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Choose "Web application"
6. Add Authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy Client ID and Secret to `.env`:
   ```
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### 2. Admin Account Setup

Create first admin user via database or seed script:

```bash
# Option A: Using Prisma Studio
npm run db:studio

# Option B: Create seed script
npm run db:seed
```

### 3. Add Sample Products

You can add products via:
- Admin panel (http://localhost:3000/admin)
- Database seeding
- Manual entry via Prisma Studio

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
```

## 🎯 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   - Edit code
   - Test locally
   - Check for errors

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

4. **Push & Deploy**
   ```bash
   git push origin feature/your-feature
   ```

## 📱 Testing on Mobile

1. Find your local IP:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Update `NEXTAUTH_URL` in `.env`:
   ```
   NEXTAUTH_URL="http://192.168.x.x:3000"
   ```

3. Visit `http://192.168.x.x:3000` on mobile

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
# Windows: Services → PostgreSQL
# Mac: brew services list

# Test connection
psql -U postgres -h localhost
```

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Prisma Generate Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run db:generate
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)

## 🎉 You're Ready!

Your PlanetKids platform is now set up. Check out:
- **DESIGN_DOCUMENTATION.md** for design specs
- **DATABASE_SCHEMA.md** for database structure
- **README.md** for detailed information

Happy coding! 🚀
