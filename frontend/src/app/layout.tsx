import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NewsletterModalContextProvider } from "@/contexts/newsletter-modal.context";
import { UserProvider } from "@/contexts/UserContext";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FindIt",
  description: "Pronađi. Objavi. Prodaj.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          <NewsletterModalContextProvider>

            {/* ✅ Navbar je ovde sada na svakoj stranici */}
            <Navbar
              items={[
                { href: "/oglasi_prikaz", title: "Shop" },
                { href: "/about", title: "About" },
                { href: "/contact", title: "Contact", outlined: true },
              ]}
            />

            {children}

          </NewsletterModalContextProvider>
        </UserProvider>
      </body>
    </html>
  );
}
