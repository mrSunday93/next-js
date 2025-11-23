"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/app/db/firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  getDocs,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const CLOUDINARY_CLOUD_NAME = "ddpzackiq";
const CLOUDINARY_UPLOAD_PRESET = "ondemande";

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showQRIS, setShowQRIS] = useState(false);
  const [countdown, setCountdown] = useState(600);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const [historyPushed, setHistoryPushed] = useState(false);

  const subtotal = cartItems.reduce((t, i) => {
    return t + (Number(i.price) || 0) * (Number(i.quantity) || 0);
  }, 0);

  const totalQty = cartItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0);

  const generateIncrementId = async () => {
    const counterRef = doc(db, "system", "orderCounter");

    const orderIdString = await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      let next = 1;
      if (snap.exists()) {
        const data = snap.data();
        next = (Number(data.value) || 0) + 1;
      }
      tx.set(counterRef, { value: next }, { merge: true });

      return `ORD-${String(next).padStart(4, "0")}`;
    });

    return orderIdString;
  };

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setUserData(snap.data());
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menuRef = collection(db, "menus");
        const snap = await getDocs(menuRef);

        const list = snap.docs.map((d) => {
          const data = d.data();

          const variants =
            Array.isArray(data.variant)
              ? data.variant
              : typeof data.variant === "string"
              ? [data.variant]
              : [];

          return {
            id: d.id,
            quantity: 1,
            selectedVariant: variants[0] || "",
            variantList: variants,
            ...data,
          };
        });

        setCartItems(list);
      } catch (err) {
        console.error("Load menu error:", err);
      }
    };

    loadMenu();
  }, []);

  const handleVariantChange = (id, variant) => {
    setCartItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selectedVariant: variant } : it))
    );
  };

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, quantity: Math.min((Number(it.quantity) || 0) + 1, it.stock) }
          : it
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, quantity: Math.max((Number(it.quantity) || 0) - 1, 1) }
          : it
      )
    );
  };

  const handleManualQty = (id, val) => {
    setCartItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (val === "") return { ...it, quantity: "" };

        const num = parseInt(val, 10);
        if (isNaN(num)) return it;

        return {
          ...it,
          quantity: Math.min(Math.max(num, 1), it.stock),
        };
      })
    );
  };

  const handleQtyBlur = (id, val) => {
    if (val === "" || isNaN(Number(val))) {
      setCartItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, quantity: 1 } : it))
      );
    }
  };

  useEffect(() => {
    let t;
    if (showQRIS && countdown > 0) {
      t = setInterval(() => setCountdown((s) => s - 1), 1000);
    }
    return () => clearInterval(t);
  }, [showQRIS, countdown]);

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const c = String(s % 60).padStart(2, "0");
    return `${m}:${c}`;
  };

  const handlePayment = () => {
    if (totalQty < 5) return;
    setShowQRIS(true);
    setCountdown(600);
    setUploadedUrl(null);
    setUploadError(null);
    setHistoryPushed(false);
  };

  const saveOrderToFirestore = async (buktiUrl = null) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Harus login!");
      router.push("/login");
      return null;
    }

    const orderId = await generateIncrementId();

    const cleanItems = cartItems.map((it) => {
      const q = Number(it.quantity) || 1;
      return {
        id: it.id,
        name: it.name,
        selectedVariant: it.selectedVariant,
        quantity: q,
        price: it.price,
        subtotal: q * it.price,
        stock: it.stock,
        sold: it.sold || 0,
      };
    });

    await setDoc(doc(db, "orders", orderId), {
      orderId,
      userId: user.uid,
      userName: userData?.name || user.email,
      userEmail: userData?.email || user.email,
      items: cleanItems,
      jumlahItem: cleanItems.reduce((s, i) => s + i.quantity, 0),
      total: cleanItems.reduce((s, i) => s + i.subtotal, 0),
      waktu: serverTimestamp(),
      status: "Menunggu",
      buktiPembayaran: buktiUrl,
    });

    for (const it of cleanItems) {
      await updateDoc(doc(db, "menus", it.id), {
        stock: Math.max((it.stock || 0) - it.quantity, 0),
        sold: (it.sold || 0) + it.quantity,
      }).catch((err) => console.warn("Update stok gagal:", err));
    }

    return orderId;
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
      setUploadError(err.message);
      return null;
    }
  };

  const onSelectFileAndUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleUploadToCloudinary(file);
  };

  useEffect(() => {
    const beforeUnload = (e) => {
      if (showQRIS && !uploadedUrl) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const blockBack = () => {
      if (showQRIS && !uploadedUrl) {
        history.pushState(null, "", location.href);
        alert("Upload bukti pembayaran dulu.");
      }
    };

    if (showQRIS && !uploadedUrl) {
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
  }, [showQRIS, uploadedUrl, historyPushed]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = showQRIS ? "hidden" : prev;
    return () => (document.body.style.overflow = prev || "");
  }, [showQRIS]);

  const handleCloseQRIS = async () => {
    if (!uploadedUrl) return alert("Upload bukti dulu!");

    try {
      const orderId = await saveOrderToFirestore(uploadedUrl);
      if (!orderId) throw new Error("Order gagal dibuat");

      alert("Pembayaran berhasil!"); // ← REVISI DI SINI

      setShowQRIS(false);

      router.push(`/order-status/user?orderId=${encodeURIComponent(orderId)}`);
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat membuat order.");
    }
  };

  const handleBackLinkClick = (e) => {
    if (showQRIS && !uploadedUrl) {
      e.preventDefault();
      alert("Upload bukti pembayaran dulu.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-[#FF9300] to-[#9e4b00] bg-clip-text text-transparent">
          Keranjang Belanja
        </h1>

        {/* HEADER */}
        <div className="grid grid-cols-8 gap-4 px-6 py-3 mb-4 bg-[#141414] border border-[#2B2B2B] rounded-xl text-gray-300 text-sm">
          <div>Produk</div>
          <div>Varian</div>
          <div className="text-center">Stok</div>
          <div className="text-center">Harga</div>
          <div className="text-center">Jumlah</div>
          <div className="text-center">Total</div>
          <div className="text-center">Tersisa</div>
          <div className="text-center">Terjual</div>
        </div>

        {/* LIST ITEM */}
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-8 gap-4 items-center p-4 rounded-xl bg-[#131313] border border-[#2B2B2B]"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                  <Image src={item.image} fill alt={item.name} className="object-cover" />
                </div>
                <span className="font-semibold">{item.name}</span>
              </div>

              {/* VARIAN */}
              <div>
                <select
                  value={item.selectedVariant}
                  onChange={(e) => handleVariantChange(item.id, e.target.value)}
                  className="bg-[#1F1F1F] border border-[#333] rounded-lg px-2 py-1 text-sm"
                >
                  {item.variantList.map((v, i) => (
                    <option key={i} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center">{item.stock}</div>

              <div className="text-center">
                Rp {Number(item.price).toLocaleString("id-ID")}
              </div>

              {/* QTY */}
              <div className="flex justify-center">
                <div className="flex items-center border border-[#FF9300] rounded-lg px-2">
                  <button className="px-2" onClick={() => handleDecrease(item.id)}>
                    -
                  </button>

                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    max={item.stock}
                    onChange={(e) => handleManualQty(item.id, e.target.value)}
                    onBlur={() => handleQtyBlur(item.id, item.quantity)}
                    className="w-14 text-center bg-transparent outline-none"
                  />

                  <button
                    className="px-2"
                    onClick={() => handleIncrease(item.id)}
                    disabled={(Number(item.quantity) || 0) >= item.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-center">
                Rp{" "}
                {(Number(item.price) * (Number(item.quantity) || 0)).toLocaleString(
                  "id-ID"
                )}
              </div>

              <div className="text-center">
                {Math.max((item.stock || 0) - (Number(item.quantity) || 0), 0)}
              </div>

              <div className="text-center">{item.sold || 0}</div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl p-6 mt-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-300">Total Belanja</span>
            <span className="text-3xl font-bold text-[#FF9300]">
              Rp {subtotal.toLocaleString("id-ID")}
            </span>
          </div>

          <button
            disabled={totalQty < 5}
            onClick={handlePayment}
            className={`w-full py-4 rounded-xl font-bold text-lg ${
              totalQty < 5 ? "bg-[#2A2A2A] text-gray-500" : "bg-[#FF9300] text-black"
            }`}
          >
            {totalQty < 5 ? `Minimal pembelian 5 item (${totalQty}/5)` : "Bayar Sekarang"}
          </button>
        </div>

        {/* QRIS POPUP */}
        {showQRIS && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-[#141414] border border-[#2A2A2B] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-auto">
              <h2 className="text-2xl font-bold mb-4 text-[#FF9300]">Pembayaran QRIS</h2>

              <p className="text-gray-400">Kode akan hilang dalam:</p>

              <p className="text-red-500 text-3xl font-bold mb-4">{formatTime(countdown)}</p>

              <div className="flex justify-center mb-4">
                <Image src="/image/qris.jpeg" width={280} height={280} alt="QRIS" />
              </div>

              {/* Upload */}
              <div className="mb-4 text-left">
                <label className="block text-sm text-gray-300 font-semibold">
                  Upload Bukti Pembayaran
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onSelectFileAndUpload}
                  className="mt-2 text-sm"
                />

                {uploading && <p className="text-sm mt-2">Mengunggah...</p>}

                {uploadError && <p className="text-sm text-red-400 mt-2">{uploadError}</p>}

                {uploadedUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-green-300">Bukti terunggah.</p>
                    <div className="mt-2 w-full h-40 relative rounded-lg overflow-hidden">
                      <Image src={uploadedUrl} fill alt="preview bukti" className="object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleCloseQRIS}
                className="bg-[#FF9300] w-full py-3 rounded-lg font-bold text-black"
              >
                Sudah Bayar
              </button>

              <button
                onClick={() => {
                  if (!uploadedUrl) return alert("Upload bukti dulu!");
                  alert("Klik tombol 'Sudah Bayar'");
                }}
                className="w-full mt-2 py-2 border border-[#333] text-gray-300 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        <Link href="/" onClick={handleBackLinkClick} className="text-[#FF9300] hover:underline block mt-6">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
