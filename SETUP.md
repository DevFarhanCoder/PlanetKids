# PlanetKids E-commerce Platform - Setup Guide

## Prerequisites

Before starting, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
3. **npm** or **yarn** package manager

## Database Setup

### Step 1: Install and Start PostgreSQL

#### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings (port 5432, user: postgres)
3. Remember the password you set during installation
4. PostgreSQL should start automatically

#### Verify PostgreSQL is running:
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Or try connecting
psql -U postgres
```

### Step 2: Create Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE planetkids;

# Exit
\q
```

## Project Setup

### Step 1: Configure Environment Variables

Update the `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planetkids?schema=public"
NEXTAUTH_SECRET="planetkids-secret-key-change-in-production-2024"
NEXTAUTH_URL="http://localhost:3000"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### Step 2: Run Database Migrations

```powershell
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed admin user
npx prisma db seed
```

This will create an admin user:
- **Email**: admin@planetkids.com
- **Password**: admin123

### Step 3: Start Development Server

```powershell
npm run dev
```

## Access Points

- **Frontend**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## Admin Features

### 1. Dashboard
- View statistics (products, orders, revenue)
- Recent orders overview
- Low stock alerts

### 2. Products Management
- Add new products with images
- Edit existing products
- Delete products
- Manage inventory
- Set featured/new arrival products

### 3. Categories Management
- Create parent categories
- Create subcategories
- Upload category images
- Manage category hierarchy

### 4. Orders Management
- View all orders
- Update order status
- Track shipping
- Manage payment status

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products?id={id}` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products` - Update product (Admin)
- `DELETE /api/products?id={id}` - Delete product (Admin)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories?slug={slug}` - Get category with products
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories` - Update category (Admin)
- `DELETE /api/categories?id={id}` - Delete category (Admin)

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders?id={id}` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders` - Update order status (Admin)

### Admin Stats
- `GET /api/admin/stats` - Dashboard statistics (Admin)

## File Upload

Product and category images are stored locally in:
- `public/uploads/products/`
- `public/uploads/categories/`

## Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution**: Ensure PostgreSQL is running and credentials in `.env` are correct.

### Prisma Client Error
```
Error: @prisma/client did not initialize yet
```
**Solution**: Run `npx prisma generate`

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: Kill the process or use different port:
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or run on different port
$env:PORT=3001; npm run dev
```

## Production Deployment

### Before deploying:
1. Change `NEXTAUTH_SECRET` to a strong random string
2. Update `NEXTAUTH_URL` to your production domain
3. Set up proper database backups
4. Configure environment variables on hosting platform
5. Run migrations: `npx prisma migrate deploy`

## Support

For issues or questions, contact the development team.
