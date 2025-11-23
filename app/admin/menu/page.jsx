"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/db/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditMenu() {
  const menuId = "onde-onde";

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState("");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const ref = doc(db, "menus", menuId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setName(data.name ?? "");
          setPrice(String(data.price ?? ""));
          setStock(String(data.stock ?? ""));
          setPreview(data.image ?? "");

          let loadedVariant = data.variant;

          if (!Array.isArray(loadedVariant)) {
            console.warn("⚠️ variant bukan array, diconvert otomatis:", loadedVariant);

            if (typeof loadedVariant === "string") {
              loadedVariant = loadedVariant.split(",").map(v => v.trim());
            } else {
              loadedVariant = [];
            }
          }

          setVariants(loadedVariant);
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchMenu();
  }, []);

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  // Tambah Varian
  const addVariant = () => {
    if (!newVariant.trim()) return;
    setVariants([...variants, newVariant.trim()]);
    setNewVariant("");
  };

  // Edit Varian
  const editVariant = (index, newName) => {
    const updated = [...variants];
    updated[index] = newName;
    setVariants(updated);
  };

  // Hapus Varian
  const deleteVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalImageURL = preview;

    try {
      if (!name || !price || !stock) throw new Error("Semua field wajib diisi.");
      if (imageFile) {
        if (!cloudName || !uploadPreset) {
          throw new Error("Cloudinary ENV tidak ditemukan.");
        }

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "menus");

        const uploadURL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const uploadRes = await fetch(uploadURL, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          throw new Error("Upload Cloudinary gagal: " + errText);
        }

        const uploadData = await uploadRes.json();
        finalImageURL = uploadData.secure_url;
      }

      await updateDoc(doc(db, "menus", menuId), {
        name,
        price: Number(price),
        stock: Number(stock),
        image: finalImageURL,
        variant: variants, 
      });

      alert("Menu berhasil diperbarui!");
    } catch (err) {
      console.error("❌ ERROR :", err);
      alert("Gagal memperbarui menu: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-[#272727] text-white">

      <h1 className="text-3xl font-bold mb-6 tracking-widest text-[#FF9300]">
        EDIT MENU
      </h1>

      <div className="w-[450px] p-6 rounded-2xl bg-[#1d1d1d]/90 backdrop-blur-sm border border-[#FF9300]/20">

        <img
          src={preview || "/image/default.jpg"}
          className="rounded-xl w-full h-48 object-cover mb-5 border border-[#FF9300]/30"
          alt="Preview"
        />

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAMA */}
          <div>
            <label className="font-semibold text-[#FF9300] mb-1 block">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#272727] border border-[#FF9300]/30"
            />
          </div>

          {/* HARGA */}
          <div>
            <label className="font-semibold text-[#FF9300] mb-1 block">Harga (Rp)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#272727] border border-[#FF9300]/30"
            />
          </div>

          {/* STOK */}
          <div>
            <label className="font-semibold text-[#FF9300] mb-1 block">Stok</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#272727] border border-[#FF9300]/30"
            />
          </div>

          {/* VARIANT */}
          <div>
            <label className="font-semibold text-[#FF9300] mb-1 block">Varian Rasa</label>

            <div className="space-y-2 mb-3">
              {Array.isArray(variants) &&
                variants.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={v}
                      onChange={(e) => editVariant(i, e.target.value)}
                      className="flex-1 p-2 rounded bg-[#272727] border border-[#FF9300]/30"
                    />
                    <button
                      type="button"
                      onClick={() => deleteVariant(i)}
                      className="text-red-400 px-2"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
            </div>

            {/* TAMBAH VARIANT */}
            <div className="flex gap-2 mt-2">
              <input
                value={newVariant}
                onChange={(e) => setNewVariant(e.target.value)}
                placeholder="Tambah varian baru..."
                className="flex-1 p-2 rounded bg-[#272727] border border-[#FF9300]/30"
              />
              <button
                type="button"
                onClick={addVariant}
                className="bg-[#FF9300] text-black px-3 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* GAMBAR */}
          <div>
            <label className="font-semibold text-[#FF9300] mb-1 block">Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full p-3 rounded-lg bg-[#1d1d1d] border border-[#FF9300]/30"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-[#FF9300] text-black hover:bg-[#ffae42]"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
