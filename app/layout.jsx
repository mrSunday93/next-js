import localFont from "next/font/local"
import "./globals.css"
import { SectionProvider } from "./components/SectionContext"
import Navbar from "./components/Navbar"
import NavbarMobile from "./components/NavbarMobile"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata = {
  title: "Onde-onde Mas Amba",
  description: "Onde-onde lezat dengan resep turun-temurun",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SectionProvider>
          {/* Navbar responsive */}
          <header>
            <div className="hidden md:block">
              <Navbar />
            </div>
            <div className="block md:hidden">
              <NavbarMobile />
            </div>
          </header>

          {/* Halaman utama */}
          <main>{children}</main>
        </SectionProvider>
      </body>
    </html>
  )
}
