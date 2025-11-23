'use client'
import { signOut } from "firebase/auth"
import { auth } from "@/app/db/firebase"
import { useRouter, usePathname } from "next/navigation"
import { Home, Clock, ShoppingCart, LogOut } from "lucide-react"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menu = [
    { name: "Home", icon: <Home size={20} />, href: "/admin/dashboard" },
    { name: "Order", icon: <Clock size={20} />, href: "/admin/transaksi" },
    { name: "Edit Menu", icon: <ShoppingCart size={20} />, href: "/admin/menu" },
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.log("Logout gagal:", error)
    }
  }

  return (
    <div
      className="
        w-72 min-h-screen relative
        bg-[#1a1a1a]
        border-r border-[#3a3a3a]
        text-white p-6 flex flex-col justify-between
      "
    >

      <div>
        <h1 className="text-3xl font-bold mb-12 tracking-[0.15em] text-orange-400 text-center">
          ADMIN
        </h1>

        <nav className="space-y-2">
          {menu.map((item) => {
            const active = pathname === item.href

            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg 
                  border transition-all
                  ${active
                    ? "bg-[#FF9300] text-black border-[#FF9300]"
                    : "bg-[#262626] border-[#3a3a3a] hover:bg-[#2e2e2e]"
                  }
                `}
              >
                <span className={`${active ? "text-black" : "text-orange-400"}`}>
                  {item.icon}
                </span>

                <span className={`font-medium tracking-wide ${active ? "text-black" : "text-white"}`}>
                  {item.name}
                </span>
              </a>
            )
          })}
        </nav>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-3 justify-center w-full py-3 
          bg-red-700 hover:bg-red-600
          rounded-xl border border-red-600
          transition-all font-semibold
        "
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  )
}
