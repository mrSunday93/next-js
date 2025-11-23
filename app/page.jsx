"use client"
import { useSection } from "./components/SectionContext"

import Hero from "./components/Hero"
import About from "./components/About"
import Gallery from "./components/Gallery"
import Footer from "./components/Footer"

import HeroMobile from "./components/HeroMobile"
import AboutMobile from "./components/AboutMobile"
import GalleryMobile from "./components/GalleryMobile"

export default function Home() {
  const { homeRef, aboutRef, galleryRef, contactRef } = useSection()

  return (
    <>
      {/* Hero */}
      <section id="home" ref={homeRef}>
        {/* Desktop */}
        <div className="hidden md:block">
          <Hero />
        </div>
        {/* Mobile */}
        <div className="block md:hidden">
          <HeroMobile />
        </div>
      </section>

      {/* About */}
      <section id="about" ref={aboutRef}>
        {/* Desktop */}
        <div className="hidden md:block">
          <About />
        </div>
        {/* Mobile */}
        <div className="block md:hidden">
          <AboutMobile />
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" ref={galleryRef}>
        {/* Desktop */}
        <div className="hidden md:block">
          <Gallery />
        </div>
        {/* Mobile */}
        <div className="block md:hidden">
          <GalleryMobile />
        </div>
      </section>

      {/* Footer / Contact */}
      <section id="contact" ref={contactRef}>
        {/* Desktop */}
        <div className="hidden md:block">
          <Footer />
        </div>
        {/* Mobile */}
        <div className="block md:hidden">
          <Footer />
        </div>
      </section>
    </>
  )
}
