import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Nav from "@/widgets/nav/Nav";
import Footer from "@/widgets/footer/Footer";
import "./globals.scss";

const gilroy = localFont({
  src: [
    {
      path: "./../public/static/fonts/Gilroy/Gilroy-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Spins",
  description:
    "Experience the thrill of CryptoSpins — the ultimate crypto casino. Play now and hit the jackpot with your favorite cryptocurrency!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gilroy.className} ${inter.className}`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
