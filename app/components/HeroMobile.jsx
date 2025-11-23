"use client"
import { useEffect, useState } from "react"
import { auth } from "@/app/db/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function HeroMobile() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleBuyNow = () => {
    if (user) {
      router.push("/cart-mobile")
    } else {
      router.push("/login")
    }
  }

  return (
    <section
      className="relative h-72 bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/image/ondehd.png')"
      }}
    >
  
      <div className="absolute inset-0 bg-[#0F0F0F]/70"></div>

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-2xl font-bold leading-tight">
          Onde-onde <span className="text-[#FF9300]">Mas Imron</span>
        </h1>

        <p className="text-sm text-white/80 mt-1 tracking-wide">
          #awali harimu dengan onde-onde
        </p>

        <button
          onClick={handleBuyNow}
          className="mt-4 px-5 py-2 rounded-md font-semibold 
          border-2 border-[#FF9300] text-[#FF9300]
          hover:bg-[#FF9300] hover:text-black transition-all duration-300"
        >
          Buy Now
        </button>
      </div>
    </section>
  )
}
