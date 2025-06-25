import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NewsletterModalContextProvider } from "@/contexts/newsletter-modal.context";
import { UserProvider } from "@/contexts/UserContext";
import Navbar from "./components/Navbar";
import ClientWrapper from "../components/ClientWrapper"; // novi klijentski sloj

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
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <NewsletterModalContextProvider>
            <ClientWrapper>
              <Navbar items={[{ href: "/oglasi_prikaz", title: "Shop" }]} />
              {children}
            </ClientWrapper>
          </NewsletterModalContextProvider>
        </UserProvider>
      </body>
    </html>
  );
}
