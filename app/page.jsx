'use client'
import { useSection } from './components/SectionContext'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import About from './components/About'
import Gallery from './components/Gallery'
import Footer from './components/Footer'

export default function Home() {
  const { homeRef, aboutRef, galleryRef, contactRef } = useSection()

  return (
    <>
     
      <div ref={homeRef}>
        <Hero />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={galleryRef}>
        <Gallery />
      </div>
      <div ref={contactRef}>
        <Footer />
      </div>
    </>
  )
}