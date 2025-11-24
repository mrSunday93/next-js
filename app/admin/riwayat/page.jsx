"use client"

import { useEffect, useState } from "react"
import { db } from "@/app/db/firebase"
import { collection, getDocs } from "firebase/firestore"

export default function RiwayatTransaksi() {
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")

  // === PARSER TANGGAL AMAN ===
  const parseTanggal = (str) => {
    if (!str || typeof str !== "string") return new Date()

    try {
      let d

      if (str.includes("-")) {
        d = new Date(str)
      } else {
        const [tanggal, waktu] = str.split(" ")
        const [dd, mm, yy] = tanggal.split("/")
        d = new Date(`${yy}-${mm}-${dd}T${waktu || "00:00"}`)
      }

      if (isNaN(d.getTime())) return new Date()
      return d
    } catch (e) {
      return new Date()
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const snap = await getDocs(collection(db, "transaksi"))

      const list = snap.docs.map((d) => {
        const raw = d.data()
        const tgl = parseTanggal(raw.tanggal)

        let key = !isNaN(tgl.getTime())
          ? tgl.toISOString().split("T")[0]
          : "Unknown"

        return {
          id: d.id,
          ...raw,
          tanggalDate: tgl,
          tanggalKey: key,
          tanggalTimestamp: tgl.getTime() || 0,

          // ===== AUTO DETECT FIELD NAMA USER =====
          userDisplayName:
            raw.userName ||
            raw.nama ||
            raw.username ||
            raw.customerName ||
            raw.pembeli ||
            "Tidak ada nama",
        }
      })

      const result = {}

      list.forEach((item) => {
        if (!result[item.tanggalKey]) {
          result[item.tanggalKey] = {
            totalPendapatan: 0,
            transaksi: [],
            tanggalTimestamp: item.tanggalTimestamp,
          }
        }

        result[item.tanggalKey].transaksi.push(item)
        result[item.tanggalKey].totalPendapatan += item.total || 0
      })

      setGrouped(result)
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) return <p className="p-6 text-white">Memuat...</p>

  let tanggalList = Object.keys(grouped)

  // === FILTER TANGGAL ===
  if (selectedDate) {
    tanggalList = tanggalList.filter((t) => t === selectedDate)
  }

  // === SORT TERBARU KE LAMA ===
  tanggalList.sort(
    (a, b) => grouped[b].tanggalTimestamp - grouped[a].tanggalTimestamp
  )

  return (
    <div className="bg-[#1E1E1E] min-h-screen text-white p-8">
      <h2 className="text-4xl font-extrabold mb-8 text-[#FF9300]">
        Riwayat Transaksi
      </h2>

      {/* FILTER TANGGAL */}
      <div className="mb-6 flex items-center gap-4">
        <input
          type="date"
          className="bg-[#252525] text-white px-3 py-2 rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {selectedDate && (
          <button
            onClick={() => setSelectedDate("")}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Reset
          </button>
        )}
      </div>

      {/* LIST TRANSAKSI */}
      <div className="space-y-6">
        {tanggalList.map((tgl) => {
          const hari = grouped[tgl]

          // Sort transaksi dalam tanggal: terbaru → lama
          hari.transaksi.sort(
            (a, b) => b.tanggalTimestamp - a.tanggalTimestamp
          )

          return (
            <div
              key={tgl}
              className="bg-[#252525] p-6 rounded-xl border border-[#3a3a3a]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#FF9300]">
                  {tgl === "Unknown" ? "Tanggal Tidak Valid" : tgl}
                </h3>

                <p className="text-lg font-bold">
                  Pendapatan:{" "}
                  <span className="text-[#FF9300]">
                    Rp {hari.totalPendapatan.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {hari.transaksi.map((t) => (
                  <div
                    key={t.id}
                    className="bg-[#1f1f1f] text-gray-100 rounded-xl p-4 border border-[#FF9300]"
                  >
                    <p className="text-sm">
                      <span className="font-bold text-[#FF9300]">
                        Transaksi ID:
                      </span>{" "}
                      {t.transaksiId}
                    </p>

                    <p className="text-sm mt-1">
                      <span className="font-bold text-[#FF9300]">
                        Order ID:
                      </span>{" "}
                      {t.orderId}
                    </p>

                    {/* === NAMA USER === */}
                    <p className="text-sm mt-1">
                      <span className="font-bold text-[#FF9300]">Nama:</span>{" "}
                      {t.userDisplayName}
                    </p>

                    <p className="text-sm mt-1">
                      <span className="font-bold text-[#FF9300]">Waktu:</span>{" "}
                      {t.tanggal}
                    </p>

                    <div className="border-b border-gray-700 my-3" />

                    <p className="font-semibold text-[#FF9300]">
                      Detail Pesanan:
                    </p>
                    <p className="text-sm">{t.menu}</p>

                    <p className="font-semibold text-[#FF9300] mt-3">Total:</p>
                    <p className="text-lg font-bold">
                      Rp {t.total?.toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {tanggalList.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          Belum ada transaksi.
        </p>
      )}
    </div>
  )
}
