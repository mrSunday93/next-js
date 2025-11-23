"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/db/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const CLOUDINARY_CLOUD_NAME = "ddpzackiq";
const CLOUDINARY_UPLOAD_PRESET = "ondemande";

export default function CartMobile() {
  const router = useRouter();
  const menuId = "onde-onde";
  const fileInputRef = useRef(null);

  const [menu, setMenu] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [variantList, setVariantList] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(600);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [historyPushed, setHistoryPushed] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const ref = doc(db, "menus", menuId);
        const snap = await getDoc(ref);
        if (!snap.exists()) return;
        const data = snap.data();

        const variants =
          Array.isArray(data.variant)
            ? data.variant
            : typeof data.variant === "string"
            ? [data.variant]
            : [];

        setMenu({ id: menuId, ...data });
        setVariantList(variants);
        setSelectedVariant(variants[0] || "");
      } catch (err) {
        console.error("Fetch menu error:", err);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    if (!showModal) return;

    let t = null;
    if (countdown > 0) {
      t = setInterval(() => setCountdown((s) => s - 1), 1000);
    } else {
      setShowModal(false);
      alert("Waktu QRIS habis. Silakan ulangi pembayaran.");
    }

    return () => {
      if (t) clearInterval(t);
    };
  }, [showModal, countdown]);

  useEffect(() => {
    const beforeUnload = (e) => {
      if (showModal && !uploadedUrl) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    const blockBack = () => {
      if (showModal && !uploadedUrl) {
        history.pushState(null, "", location.href);
        alert("Upload bukti pembayaran dulu.");
      }
    };

    if (showModal && !uploadedUrl) {
      window.addEventListener("beforeunload", beforeUnload);

      if (!historyPushed) {
        history.pushState({ qris: true }, "", location.href);
        setHistoryPushed(true);
      }

      window.addEventListener("popstate", blockBack);
    }

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("popstate", blockBack);
    };
  }, [showModal, uploadedUrl, historyPushed]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (showModal) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [showModal]);

  if (!menu) {
    return (
      <div className="text-white p-6 text-center">
        Loading data menu...
      </div>
    );
  }

  const price = Number(menu.price || 0);
  const stock = Number(menu.stock || 0);
  const sold = Number(menu.sold || 0);
  const img = menu.image || "/image/placeholder.png";

  const remaining = Math.max(stock - quantity, 0);
  const total = price * quantity;
  const minOrder = 5;
  const handleMinus = () => setQuantity((q) => Math.max(1, q - 1));
  const handlePlus = () => setQuantity((q) => Math.min(stock, q + 1));

  const handleManualQty = (val) => {
    if (val === "") return setQuantity("");
    const n = parseInt(val, 10);
    if (isNaN(n)) return;
    setQuantity(Math.min(Math.max(n, 1), stock));
  };

  const handleQtyBlur = () => {
    if (quantity === "" || isNaN(Number(quantity))) setQuantity(1);
  };

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const c = String(s % 60).padStart(2, "0");
    return `${m}:${c}`;
  };

  const handleBayar = () => {
    if (quantity < minOrder) return;
    setShowModal(true);
    setCountdown(600);
    setUploadedUrl(null);
    setUploadError(null);
    setHistoryPushed(false);
  };

  const handleUploadToCloudinary = async (file) => {
    if (!file) return null;

    setUploading(true);
    setUploadError(null);

    try {
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(url, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload gagal");

      const data = await res.json();
      setUploadedUrl(data.secure_url);
      setUploading(false);
      return data.secure_url;
    } catch (err) {
      setUploading(false);
      setUploadError(err.message || "Upload error");
      return null;
    }
  };

  const onSelectFileAndUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await handleUploadToCloudinary(f);
  };

  const saveOrderToFirestore = async (buktiUrl) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Silakan login terlebih dahulu.");
      router.push("/login");
      return false;
    }

    try {
      const orderId = crypto.randomUUID();

      const item = {
        id: menuId,
        name: menu.name,
        selectedVariant,
        quantity: Number(quantity),
        price,
        subtotal: Number(quantity) * price,
        stock,
        sold,
      };

      await setDoc(doc(db, "orders", orderId), {
        orderId,
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        items: [item],
        jumlahItem: item.quantity,
        total: item.subtotal,
        waktu: serverTimestamp(),
        status: "Menunggu",
        buktiPembayaran: buktiUrl,
      });

      await updateDoc(doc(db, "menus", menuId), {
        stock: Math.max(stock - item.quantity, 0),
        sold: sold + item.quantity,
      });

      return true;
    } catch {
      return false;
    }
  };

  const handleCloseModal = async () => {
    if (!uploadedUrl) return alert("Upload bukti dulu!");

    const ok = await saveOrderToFirestore(uploadedUrl);
    if (ok) {
      alert("Pembayaran tersimpan. Terima kasih!");
      setShowModal(false);
      router.push("/order-status/user");
    } else {
      alert("Gagal menyimpan order. Coba lagi.");
    }
  };

  const handleBackClick = () => {
    if (showModal && !uploadedUrl) {
      return alert("Upload bukti pembayaran dulu.");
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-white pb-6">
      {/* HEADER */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-[#2A2A2A] bg-[#111111] sticky top-0 z-20">
        <button onClick={handleBackClick} className="text-[#FF9300]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Keranjang Belanja</h1>
      </header>

      {/* CARD */}
      <div className="mx-4 mt-6 p-5 rounded-2xl bg-[#141414] border border-[#2A2A2A] shadow relative overflow-hidden">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 relative rounded-xl overflow-hidden border border-[#333]">
            <Image src={img} alt={menu.name} fill className="object-cover" />
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold">{menu.name}</h2>
          {menu.description && (
            <p className="text-sm text-gray-400 mt-1">{menu.description}</p>
          )}
        </div>

        {/* Varian */}
        {variantList.length > 0 && (
          <div className="mb-4">
            <label className="text-sm text-gray-400">Varian</label>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="w-full mt-2 bg-[#101010] border border-[#2A2A2A] rounded-lg px-3 py-2"
            >
              {variantList.map((v, i) => (
                <option key={i}>{v}</option>
              ))}
            </select>
          </div>
        )}

        {/* Info */}
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <span className="text-gray-400">Stok</span>
          <span>{stock}</span>

          <span className="text-gray-400">Harga</span>
          <span>Rp {price.toLocaleString()}</span>

          <span className="text-gray-400">Terjual</span>
          <span>{sold}</span>

          <span className="text-gray-400">Tersisa</span>
          <span>{remaining}</span>
        </div>

        {/* Qty */}
        <div className="mt-6 p-3 rounded-xl bg-[#101010] border border-[#2A2A2A] flex justify-between items-center">
          <span className="text-gray-400">Jumlah</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMinus}
              className={`w-9 h-9 rounded-md ${
                quantity > 1
                  ? "bg-[#FF9300] text-black"
                  : "bg-[#2A2A2A] text-gray-500"
              }`}
            >
              -
            </button>

            <input
              type="number"
              value={quantity}
              onChange={(e) => handleManualQty(e.target.value)}
              onBlur={handleQtyBlur}
              className="w-16 text-center bg-transparent"
              min={1}
              max={stock}
            />

            <button
              onClick={handlePlus}
              className={`w-9 h-9 rounded-md ${
                quantity < stock
                  ? "bg-[#FF9300] text-black"
                  : "bg-[#2A2A2A] text-gray-500"
              }`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mx-4 mt-auto p-5 rounded-2xl bg-[#141414] border border-[#2A2A2A] sticky bottom-0 z-20">
        <div className="flex justify-between text-lg font-semibold mb-3">
          <span>Total Belanja</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>

        <button
          disabled={quantity < minOrder}
          onClick={handleBayar}
          className={`w-full py-3 rounded-xl ${
            quantity < minOrder
              ? "bg-[#2A2A2A] text-gray-600"
              : "bg-[#FF9300] text-black"
          }`}
        >
          {quantity < minOrder
            ? `Minimal ${minOrder} item (${quantity}/${minOrder})`
            : "Bayar Sekarang"}
        </button>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-[#141414] p-6 rounded-xl w-full max-w-xs border border-[#2A2A2A] max-h-[90vh] overflow-auto">
            <p className="text-gray-300 mb-3">
              Kode hilang dalam:{" "}
              <span className="text-red-500 font-bold">
                {formatTime(countdown)}
              </span>
            </p>

            <div className="w-56 mx-auto mb-4 rounded-lg overflow-hidden border border-[#333]">
              <Image
                src="/image/qris.jpeg"
                alt="QRIS"
                width={560}
                height={560}
              />
            </div>

            <div className="mb-4 text-left">
              <label className="text-sm text-gray-300 font-semibold">
                Upload Bukti Pembayaran
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onSelectFileAndUpload}
                className="mt-2 text-sm w-full"
              />

              {uploading && <p className="text-sm mt-2">Mengunggah...</p>}
              {uploadError && (
                <p className="text-sm text-red-400 mt-2">{uploadError}</p>
              )}

              {uploadedUrl && (
                <div className="mt-2 w-full h-40 relative rounded-lg overflow-hidden">
                  <Image
                    src={uploadedUrl}
                    alt="preview bukti"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleCloseModal}
              className="bg-[#FF9300] w-full py-3 rounded-lg text-black font-bold mb-2"
            >
              Sudah Bayar
            </button>

            <button
              onClick={() => {
                if (!uploadedUrl) return alert("Upload bukti dulu!");
                alert(
                  "Klik tombol 'Sudah Bayar' untuk menyelesaikan pembayaran."
                );
              }}
              className="w-full py-2 border border-[#333] text-gray-300 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
