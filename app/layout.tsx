import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ConditionalLayout from "./ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlanetKids - Quality Kids Products | Toys, Learning Kits & More",
  description: "Explore PlanetKids for the best selection of toys, learning kits, school essentials, bags, stationery, and baby products. Safe, quality products for children of all ages.",
  keywords: "kids toys, learning kits, school essentials, kids bags, stationery, baby products, educational toys",
  authors: [{ name: "PlanetKids" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://planetkids.com",
    siteName: "PlanetKids",
    title: "PlanetKids - Quality Kids Products",
    description: "Your trusted destination for quality kids products",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PlanetKids",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanetKids - Quality Kids Products",
    description: "Your trusted destination for quality kids products",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
