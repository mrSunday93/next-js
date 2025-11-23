"use client"

import { useEffect, useState } from "react"
import { db } from "@/app/db/firebase"
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore"

export default function AdminTransaksi() {
  const [activeTab, setActiveTab] = useState("Menunggu")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState("")
  const [search, setSearch] = useState("")

  const formatTokopediaTime = (date) => {
    const d = new Date(date)
    const now = new Date()

    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()

    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)

    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()

    const time = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })

    if (isToday) return `Hari ini, ${time}`
    if (isYesterday) return `Kemarin, ${time}`

    return `${d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}, ${time}`
  }

  const generateOrderId = (num) => {
    return `ORD-${String(num).padStart(5, "0")}`
  }

  const getVariant = (item) => {
    const raw =
      item.selectedVariant ||
      item.variant ||
      item.rasa ||
      item.flavor ||
      item.varian ||
      null

    if (!raw) return null
    return Array.isArray(raw) ? raw.join(", ") : raw
  }

  useEffect(() => {
    const loadOrders = async () => {
      const snap = await getDocs(collection(db, "orders"))
      let list = []
      let counter = 1

      for (const d of snap.docs) {
        const order = { id: d.id, ...d.data() }

        if (!order.orderId) {
          const newId = generateOrderId(counter++)
          order.orderId = newId
          await updateDoc(doc(db, "orders", d.id), { orderId: newId })
        }

        if (order.items && Array.isArray(order.items)) {
          order.items = order.items.map((item) => ({
            ...item,
            itemId: item.itemId || crypto.randomUUID(),
          }))
        }

        if (order.userId) {
          const userDoc = await getDoc(doc(db, "users", order.userId))
          if (userDoc.exists()) {
            const u = userDoc.data()
            order.userName = u.name || u.fullName || "Tanpa Nama"
            order.userEmail = u.email || "Tanpa Email"
            order.userPhone = u.phoneNumber || "Tanpa Nomor Telepon"
          }
        }

        list.push(order)
      }

      setOrders(list)
      setLoading(false)
    }

    loadOrders()
  }, [])

  const simpanTransaksi = async (order) => {
    try {
      const menuString =
        order.items
          ?.map((i) => {
            const v = getVariant(i)
            return `${i.name} x ${i.quantity}${v ? ` (${v})` : ""}`
          })
          .join(", ") ||
        `${order.produk} x ${order.jumlah}${
          order.varian ? ` (${order.varian})` : ""
        }`

      await addDoc(collection(db, "transaksi"), {
        transaksiId: crypto.randomUUID(),
        orderId: order.orderId,
        nama: order.userName || "Tanpa Nama",
        email: order.userEmail || "Tanpa Email",
        phone: order.userPhone || "Tanpa Nomor Telepon",
        menu: menuString,
        total: order.total,
        items: order.items || [],
        tanggal: new Date().toLocaleString("id-ID"),
      })
    } catch (e) {
      console.error("Gagal menyimpan transaksi:", e)
    }
  }

  const updateStatus = async (id, status) => {
    const order = orders.find((o) => o.id === id)

    await updateDoc(doc(db, "orders", id), { status })

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    )

    if (status === "Dikonfirmasi") {
      await simpanTransaksi(order)
    }
  }

  if (loading) return <p className="p-6 text-white">Loading...</p>

  const tabList = [
    "Menunggu",
    "Dikonfirmasi",
    "Siap pickup",
    "Selesai",
    "Ditolak",
  ]

  const filteredOrders = orders.filter((o) => {
    const sameStatus = o.status === activeTab
    if (!sameStatus) return false

    if (filterDate && o.waktu?.toDate) {
      const orderDate = o.waktu.toDate().toISOString().split("T")[0]
      if (orderDate !== filterDate) return false
    }

    if (search.trim() !== "") {
      const s = search.toLowerCase()
      return (
        o.userName?.toLowerCase().includes(s) ||
        o.userEmail?.toLowerCase().includes(s) ||
        o.userPhone?.toLowerCase().includes(s)
      )
    }

    return true
  })

  return (
    <div className="bg-[#1E1E1E] min-h-screen text-white p-8">
      <h2 className="text-4xl font-extrabold mb-8 text-[#FF9300]">Order</h2>

      {/* Search */}
      <div className="mb-6 bg-[#252525] p-4 rounded-lg border border-[#3a3a3a] w-full max-w-md">
        <label className="text-sm text-gray-300">
          Cari nama / email / no telp:
        </label>
        <input
          type="text"
          placeholder="Misal: Bagas, 0812, gmail.com"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1b1b1b] mt-2 px-3 py-2 rounded-lg outline-none border border-[#555] w-full text-gray-200"
        />
      </div>

      {/* Filter tanggal */}
      <div className="mb-6 bg-[#252525] p-4 rounded-lg border border-[#3a3a3a] w-fit">
        <label className="text-sm text-gray-300">Sortir berdasarkan tanggal:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="bg-[#1b1b1b] mt-2 px-3 py-2 rounded-lg outline-none border border-[#555] text-gray-200"
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-[#1c1c1c] rounded-xl overflow-hidden border border-[#3a3a3a]">
        {tabList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-8 py-4 font-semibold transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#FF9300] text-black"
                : "text-gray-300 hover:text-white hover:bg-[#333333]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-[#1f1f1f] text-gray-100 rounded-2xl p-6 border border-[#FF9300]"
          >
            <p className="text-sm mb-2">
              <span className="font-bold text-[#FF9300]">Order ID:</span>{" "}
              {order.orderId}
            </p>

            {/* Waktu Tokopedia */}
            {order.waktu?.toDate && (
              <p className="text-sm mb-2">
                <span className="font-bold text-[#FF9300]">Waktu:</span>{" "}
                {formatTokopediaTime(order.waktu.toDate())}
              </p>
            )}

            <p className="text-sm">
              <span className="font-bold text-[#FF9300]">Nama:</span>{" "}
              {order.userName}
            </p>
            <p className="text-sm">
              <span className="font-bold text-[#FF9300]">Email:</span>{" "}
              {order.userEmail}
            </p>
            <p className="text-sm">
              <span className="font-bold text-[#FF9300]">No Telp:</span>{" "}
              {order.userPhone}
            </p>

            <div className="border-b border-gray-700 my-3" />

            <p className="font-semibold text-[#FF9300]">Pesanan</p>

            {order.items?.map((i) => {
              const v = getVariant(i)
              return (
                <p key={i.itemId}>
                  {i.name} — {i.quantity}
                  {v && (
                    <>
                      {" "}
                      — <span className="text-[#FF9300]">{v}</span>
                    </>
                  )}
                </p>
              )
            })}

            <p className="text-[#FF9300] font-bold mt-3 text-lg">
              Total: Rp {order.total?.toLocaleString("id-ID")}
            </p>

            {/* Status Badge */}
            <div className="mt-4">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide border
                  ${
                    order.status === "Menunggu" &&
                    "bg-yellow-800 text-yellow-200 border-yellow-600"
                  }
                  ${
                    order.status === "Dikonfirmasi" &&
                    "bg-green-800 text-green-200 border-green-600"
                  }
                  ${
                    order.status === "Siap pickup" &&
                    "bg-blue-800 text-blue-200 border-blue-600"
                  }
                  ${
                    order.status === "Selesai" &&
                    "bg-emerald-800 text-emerald-200 border-emerald-600"
                  }
                  ${
                    order.status === "Ditolak" &&
                    "bg-red-800 text-red-200 border-red-600"
                  }
                `}
              >
                {order.status}
              </span>
            </div>

            {/* Buttons */}
            {activeTab === "Menunggu" && (
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => updateStatus(order.id, "Dikonfirmasi")}
                  className="flex-1 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Konfirmasi
                </button>

                <button
                  onClick={() => updateStatus(order.id, "Ditolak")}
                  className="flex-1 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Tolak
                </button>
              </div>
            )}

            {activeTab === "Dikonfirmasi" && (
              <button
                onClick={() => updateStatus(order.id, "Siap pickup")}
                className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 mt-4 rounded-lg text-sm font-semibold transition"
              >
                Tandai Siap Pickup
              </button>
            )}

            {activeTab === "Siap pickup" && (
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => {
                    if (!confirm("Konfirmasi: pesanan sudah diambil?")) return
                    updateStatus(order.id, "Selesai")
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Tandai Pesanan Diambil
                </button>

                <button
                  onClick={() => {
                    if (!confirm("Kembalikan status ke Dikonfirmasi?")) return
                    updateStatus(order.id, "Dikonfirmasi")
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Kembalikan
                </button>
              </div>
            )}

            {order.buktiPembayaran && (
              <button
                onClick={() => window.open(order.buktiPembayaran, "_blank")}
                className="w-full bg-[#FF9300] hover:bg-[#e58100] px-4 py-2 mt-4 rounded-lg text-sm font-semibold text-black transition"
              >
                Lihat Bukti Pembayaran
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          Tidak ada pesanan yang cocok.
        </p>
      )}
    </div>
  )
}
