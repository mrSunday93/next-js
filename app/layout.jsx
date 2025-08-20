import localFont from "next/font/local";
import "./globals.css";
import { SectionProvider } from "./components/SectionContext"; // Import SectionProvider
import Navbar from "./components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Onde-onde Mas Amba", // Ganti dengan title Anda
  description: "Onde-onde lezat dengan resep turun-temurun", // Ganti dengan deskripsi Anda
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SectionProvider> {/* Bungkus children dengan SectionProvider */}
          <Navbar/>
          {children}
        </SectionProvider>
      </body>
    </html>
  );
}