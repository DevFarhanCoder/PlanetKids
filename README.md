# 🌍 PlanetKids E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 14, TypeScript, PostgreSQL, and Prisma ORM. Designed for selling quality kids' products with an exceptional user experience.

![PlanetKids](public/logo.png)

## 🚀 Features

### Customer Features
- 🛍️ **Product Browsing**: Browse products by categories, age groups, and price ranges
- 🔍 **Advanced Filtering**: Multi-filter system (category, price, age, rating)
- ⭐ **Reviews & Ratings**: Customer reviews with images and verified purchase badges
- 💝 **Wishlist**: Save favorite products for later
- 🔄 **Product Comparison**: Compare up to 4 products side-by-side
- 🛒 **Shopping Cart**: Persistent cart with quantity management
- 💳 **Multiple Payment Options**: COD, Prepaid, Custom Gateway
- 📦 **Order Tracking**: Track orders from placement to delivery
- 👤 **User Account**: Manage profile, orders, addresses, and wishlist
- 📧 **Email Notifications**: Order confirmations, shipping updates
- 📱 **Responsive Design**: Seamless experience on all devices

### Admin Features
- 📊 **Dashboard**: Sales analytics and key metrics
- 📦 **Product Management**: Add, edit, delete products with variants
- 📂 **Category Management**: Hierarchical category structure
- 🛍️ **Order Management**: Process orders, update statuses, generate invoices
- 👥 **Customer Management**: View customer data and order history
- 💬 **Review Moderation**: Approve/reject customer reviews
- 🎯 **Marketing Tools**: Coupon management, banners, promotions
- ⚙️ **Settings**: Configure site settings, shipping, payments

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Custom Design System
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google Cloud Console account (for OAuth)
- Payment gateway account (optional)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd planetkids
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

### 4. Set up the database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or create and run migrations (for production)
npm run db:migrate
```

### 5. Seed the database (optional)

```bash
npm run db:seed
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
planetkids/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (shop)/            # Shop pages (homepage, products, cart)
│   ├── account/           # User account pages
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components (Navbar, Footer)
│   ├── products/         # Product-related components
│   ├── cart/             # Cart components
│   └── admin/            # Admin components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Authentication config
│   ├── utils.ts          # Helper functions
│   └── validations/      # Zod schemas
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── public/               # Static assets
├── DESIGN_DOCUMENTATION.md    # Design specs
├── DATABASE_SCHEMA.md         # Database documentation
└── README.md             # This file
```

## 🎨 Design System

PlanetKids uses a custom design system with:

### Color Palette
- **Primary**: `#6C63FF` (Vibrant Purple)
- **Secondary**: `#FF6B9D` (Coral Pink)
- **Accent**: `#FFB800` (Sunny Yellow)
- **Success**: `#00D9A3` (Mint Green)

### Typography
- **Headings**: Inter (Bold, Semi-Bold)
- **Body**: Inter (Regular, Medium)
- **Playful**: Nunito

See `DESIGN_DOCUMENTATION.md` for complete design specifications.

## 📚 Documentation

- **[Design Documentation](DESIGN_DOCUMENTATION.md)**: Complete UI/UX specifications
- **[Database Schema](DATABASE_SCHEMA.md)**: Database structure and relationships
- **[API Documentation](docs/API.md)**: API endpoints (coming soon)
- **[Component Documentation](docs/COMPONENTS.md)**: Component API (coming soon)

## 🔐 Authentication

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

## 💳 Payment Gateway Integration

Add your custom payment gateway configuration in `.env`:

```
PAYMENT_GATEWAY_KEY=your-key
PAYMENT_GATEWAY_SECRET=your-secret
```

Implement payment logic in `app/api/payments/route.ts`

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Run E2E tests (coming soon)
npm run test:e2e
```

## 📈 Performance

- Server-side rendering for SEO
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Edge caching for product listings
- Optimized database queries with Prisma

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: [Your Name]
- **Designer**: [Your Name]

## 📞 Support

For support, email support@planetkids.com or join our Slack channel.

## 🙏 Acknowledgments

- Inspired by modern e-commerce best practices
- UI components inspired by Shadcn/ui
- Icons by Lucide React

---

**Made with ❤️ for kids and parents everywhere**
