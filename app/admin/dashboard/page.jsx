"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/app/db/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function AdminHome() {
  const router = useRouter();

  const [transaksi, setTransaksi] = useState([]);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return router.push("/login");
      if (user.email !== "admin@gmail.com") return router.push("/");
      fetchTransaksi();
    });
    return () => unsub();
  }, []);

  const fetchTransaksi = async () => {
    const querySnapshot = await getDocs(collection(db, "transaksi"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTransaksi(data);

    const total = data.reduce((sum, item) => sum + Number(item.total), 0);
    setTotalPendapatan(total);

    setLoading(false);
  };

  const hapusTransaksi = async (id) => {
    const target = transaksi.find((t) => t.id === id);
    if (!target) return;

    await deleteDoc(doc(db, "transaksi", id));

    const updatedList = transaksi.filter((item) => item.id !== id);
    setTransaksi(updatedList);

  
    setTotalPendapatan((prev) => prev - Number(target.total));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d] text-white text-xl tracking-wide">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#1F1F1F] min-h-screen">
      <div className="flex-1 p-10 text-white">

        <h2
          className="
            text-4xl font-extrabold mb-10 text-center tracking-widest
            text-[#FF9300]
          "
        >
          RINGKASAN TRANSAKSI
        </h2>

        <div
          className="
            rounded-xl
            bg-[#151515]
            border border-[#2a2a2a]
            p-6
          "
        >
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr className="border-b border-[#2f2f2f] text-[#FF9300] text-sm uppercase tracking-wider">
                <th className="py-3">No</th>
                <th>Nama</th>
                <th>Jumlah per Menu</th>
                <th>Total</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {transaksi.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Belum ada transaksi
                  </td>
                </tr>
              )}

              {transaksi.map((item, index) => (
                <tr
                  key={item.id}
                  className="
                    border-b border-[#1f1f1f]
                    hover:bg-[#1b1b1b]
                    transition
                  "
                >
                  <td className="py-3">{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.menu}</td>

                  <td className="font-semibold text-[#FF9300]">
                    Rp {Number(item.total).toLocaleString()}
                  </td>

                  <td className="text-gray-400">{item.tanggal}</td>

                  <td>
                    <button
                      onClick={() => hapusTransaksi(item.id)}
                      className="
                        text-red-500 
                        hover:text-red-400 
                        transition 
                        w-6 h-6 flex items-center justify-center
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 7h12M9 7V4h6v3m-7 4v7m4-7v7m4-7v7M4 7h16l-1 13H5L4 7z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL PENDAPATAN */}
        <div
          className="
            mt-10 w-full
            bg-[#141414]
            border border-[#363636]
            rounded-xl
            p-6
            flex items-center justify-between
          "
        >
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-10 h-10 text-[#FF9300]"
            >
              <path d="M12 2C6.49 2 2 4.69 2 8v8c0 3.31 4.49 6 10 6s10-2.69 10-6V8c0-3.31-4.49-6-10-6zm8 14c0 2.21-3.58 4-8 4s-8-1.79-8-4v-2.22C6.09 15.56 8.83 16 12 16s5.91-.44 8-1.22V16zm0-4c0 1.48-3.82 3-8 3s-8-1.52-8-3v-2.22C6.09 11.56 8.83 12 12 12s5.91-.44 8-1.22V12zm-8-2c-4.42 0-8-1.79-8-4s3.58-4 8-4 8 1.79 8 4-3.58 4-8 4z" />
            </svg>

            <p className="font-bold tracking-wide text-[#FF9300] text-xl">
              TOTAL PENDAPATAN
            </p>
          </div>

          <p className="text-4xl font-extrabold text-white tracking-wider">
            Rp {totalPendapatan.toLocaleString()}
          </p>
        </div>

      </div>
    </div>
  );
}
