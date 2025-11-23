"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/db/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddpzackiq/image/upload";
const UPLOAD_PRESET = "ondemande";

export default function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [uploadFiles, setUploadFiles] = useState({});
  const [loadingUpload, setLoadingUpload] = useState({});
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return router.push("/login");

    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const snap = await getDocs(q);

      let list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));

      list.sort((a, b) => {
        const t1 = a.waktu?.toDate?.() ?? 0;
        const t2 = b.waktu?.toDate?.() ?? 0;
        return t2 - t1;
      });

      setOrders(list);
      setFilteredOrders(list);
    };

    fetchOrders();
  }, []);

  const handleDateFilter = (date) => {
    setSelectedDate(date);

    if (!date) return setFilteredOrders(orders);

    const filtered = orders.filter((order) => {
      if (!order.waktu?.toDate) return false;
      const orderDate = order.waktu.toDate().toISOString().split("T")[0];
      return orderDate === date;
    });

    setFilteredOrders(filtered);
  };

  const uploadBukti = async (orderId) => {
    const file = uploadFiles[orderId];
    if (!file) return alert("Pilih gambar dulu!");

    setLoadingUpload((p) => ({ ...p, [orderId]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const uploadRes = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();
      if (!data.secure_url) throw new Error("Upload gagal");

      await updateDoc(doc(db, "orders", orderId), {
        buktiPembayaran: data.secure_url,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, buktiPembayaran: data.secure_url } : o
        )
      );

      setFilteredOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, buktiPembayaran: data.secure_url } : o
        )
      );

      alert("Bukti pembayaran berhasil diupload!");
    } catch (e) {
      alert("Terjadi kesalahan saat upload!");
    }

    setLoadingUpload((p) => ({ ...p, [orderId]: false }));
  };

  const isPickup = (status) => {
    if (!status) return false;
    const s = status.toLowerCase();
    return (
      s.includes("pickup") ||
      s.includes("pick up") ||
      s.includes("siap") ||
      s.includes("diambil")
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <h1 className="text-5xl font-extrabold text-[#FF9300] tracking-[0.15em] drop-shadow-sm">
          ORDER STATUS
        </h1>

        <div className="mt-5 md:mt-0 flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-400">
            Filter tanggal
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[#1b1b1b] text-white border border-[#3a3a3a]
                       focus:border-[#FF9300] focus:ring-1 focus:ring-[#FF9300] transition"
          />
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-gray-500 text-center text-lg mt-20">
          Tidak ada pesanan.
        </p>
      )}

      <div className="space-y-8">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="
              group 
              bg-[#151515]
              border border-transparent 
              hover:border-[#FF9300]/50
              transition-all duration-300 
              p-7 rounded-2xl 
              shadow-[0px_0px_8px_rgba(0,0,0,0.4)]
              hover:shadow-[0px_0px_15px_rgba(0,0,0,0.6)]
            "
          >
            <span
              className={`
                px-5 py-1 text-xs font-bold rounded-full uppercase tracking-wider
                border 
                ${
                  order.status?.toLowerCase() === "menunggu" &&
                  "text-yellow-300 border-yellow-700 bg-yellow-700/10"
                }
                ${
                  order.status?.toLowerCase() === "dikonfirmasi" &&
                  "text-green-300 border-green-700 bg-green-700/10"
                }
                ${
                  isPickup(order.status) &&
                  "text-blue-300 border-blue-700 bg-blue-700/10"
                }
                ${
                  order.status?.toLowerCase() === "ditolak" &&
                  "text-red-300 border-red-700 bg-red-700/10"
                }
                ${
                  order.status?.toLowerCase() === "selesai" &&
                  "text-green-300 border-green-700 bg-green-700/20"
                }
              `}
            >
              {order.status}
            </span>

            <div className="mt-6">
              <p className="text-sm text-gray-500">Total Pembayaran</p>
              <p className="text-4xl font-extrabold text-[#FF9300] tracking-wide">
                Rp {(order.total || 0).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Waktu Pesanan</p>
              <p className="text-lg text-gray-300">
                {order.waktu?.toDate
                  ? order.waktu.toDate().toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-sm text-gray-400 mb-2">Produk</p>

              <ul className="text-gray-500 space-y-2 ml-4">
                {order.items?.map((item, i) => {
                  const variant =
                    item.selectedVariant ||
                    item.variant ||
                    item.rasa ||
                    item.flavor ||
                    item.varian ||
                    null;

                  return (
                    <li key={i} className="leading-relaxed">
                      • {item.name} — {item.quantity} pcs{" "}
                      {variant && (
                        <span className="text-[#FF9300] font-semibold">
                          ({variant})
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-7">
              <p className="text-sm font-semibold text-gray-300 mb-2">
                Bukti Pembayaran:
              </p>

              {!order.buktiPembayaran && (
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setUploadFiles((prev) => ({
                        ...prev,
                        [order.id]: e.target.files[0],
                      }))
                    }
                    className="text-gray-300"
                  />

                  <button
                    onClick={() => uploadBukti(order.id)}
                    disabled={loadingUpload[order.id]}
                    className={`
                      px-5 py-2 rounded-xl font-semibold text-black
                      transition-all
                      ${
                        loadingUpload[order.id]
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-[#FF9300] hover:bg-[#e57f00]"
                      }
                    `}
                  >
                    {loadingUpload[order.id]
                      ? "Mengupload..."
                      : "Upload Bukti Pembayaran"}
                  </button>
                </div>
              )}

              {order.buktiPembayaran && (
                <div className="mt-2">
                  <p className="text-green-400 font-semibold">
                    Sudah Upload ✔
                  </p>
                  <img
                    src={order.buktiPembayaran}
                    className="w-44 rounded-xl border border-[#3a3a3a] mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
