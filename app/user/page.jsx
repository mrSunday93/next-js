'use client'
import { useEffect, useState } from 'react'
import { auth, db } from '@/app/db/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { User, Phone, Mail, LogOut, ShoppingBag } from "lucide-react"

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const [extraData, setExtraData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          const snap = await getDoc(doc(db, 'users', currentUser.uid))
          if (snap.exists()) setExtraData(snap.data())
        } catch (err) {
          console.error('Gagal ambil data user:', err)
        }
      } else {
        router.replace('/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.replace('/login')
    } catch (err) {
      console.error('Logout gagal:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <p className="text-gray-400 text-lg font-medium animate-pulse">
          Memuat data user...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      <div className="
        w-full max-w-md p-8 rounded-2xl 
        bg-[#0F0F0F]
        border border-[#2E2E2E]
      ">

        <div className="text-center mb-8">
          <div
            className="
              w-20 h-20 mx-auto rounded-full flex items-center justify-center
              border border-[#FF9300] bg-[#141414]
            "
          >
            <User className="w-10 h-10 text-[#FF9300]" />
          </div>

          <h1 className="text-3xl font-extrabold text-[#FF9300] tracking-wider mt-4">
            User Dashboard
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            Selamat datang kembali!
          </p>
        </div>

        <div className="h-[1px] w-full bg-[#2E2E2E] mb-6"></div>

        <div className="space-y-4">

          <div className="
            flex items-center gap-4 p-4 rounded-xl
            bg-[#141414] border border-[#2E2E2E]
            hover:border-[#FF9300] transition-all
          ">
            <User className="text-[#FF9300] w-6 h-6" />
            <p className="text-gray-200">
              <strong className="text-white">Nama:</strong> {extraData?.name || "Tidak ada"}
            </p>
          </div>

          <div className="
            flex items-center gap-4 p-4 rounded-xl
            bg-[#141414] border border-[#2E2E2E]
            hover:border-[#FF9300] transition-all
          ">
            <Mail className="text-[#FF9300] w-6 h-6" />
            <p className="text-gray-200">
              <strong className="text-white">Email:</strong> {extraData?.email || user.email}
            </p>
          </div>

          <div className="
            flex items-center gap-4 p-4 rounded-xl
            bg-[#141414] border border-[#2E2E2E]
            hover:border-[#FF9300] transition-all
          ">
            <Phone className="text-[#FF9300] w-6 h-6" />
            <p className="text-gray-200">
              <strong className="text-white">No. Telepon:</strong> {extraData?.phoneNumber || "Belum terdaftar"}
            </p>
          </div>

        </div>

        <div className="h-[1px] w-full bg-[#2E2E2E] my-6"></div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/order-status/user")}
            className="
              w-full py-3 rounded-xl flex items-center justify-center gap-2
              font-semibold text-black bg-[#FF9300]
              hover:bg-[#e68300] transition-all
            "
          >
            <ShoppingBag className="w-5 h-5" />
            Cek Pesanan Kamu
          </button>

          <button
            onClick={handleLogout}
            className="
              w-full py-3 rounded-xl flex items-center justify-center gap-2
              font-semibold border border-[#FF9300] text-[#FF9300]
              hover:bg-[#1F1505] transition-all
            "
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

        </div>

      </div>
    </div>
  )
}
