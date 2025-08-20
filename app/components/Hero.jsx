'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Hero = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Cek status login saat komponen dimount
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleBuyNow = () => {
    if (user) {
      router.push('/cart'); // kalau sudah login, ke cart
    } else {
      alert('Silakan login terlebih dahulu.');
      router.push('/login'); // arahkan ke login
    }
  };

  return (
    <section className="bg-[#272727] py-8 px-4 sm:py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Teks di sebelah kiri */}
        <div className="w-full md:w-1/2 space-y-3 sm:space-y-4 order-2 md:order-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-white">Onde-onde</span>{' '}
            <span className="text-[#FF9300]">Mas Amba</span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-medium text-[#FF9300]">
            Awali harimu dengan Onde-onde
          </h2>

          <p className="text-base sm:text-lg text-[#FF9300]">
            Nikmati Onde-onde Mas Amba yang lezat untuk mengawali harimu. Makan selagi hangat.
          </p>

          {/* Bagian harga */}
          <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 border-2 border-[#FF9300] text-[#FF9300] hover:bg-[#FF9300] hover:text-white rounded-md transition duration-300 font-medium text-center"
            >
              Buy now
            </button>

            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="h-6 w-1 bg-[#FF9300] hidden sm:block"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <p className="text-lg sm:text-xl font-bold text-white">Rp 5,000</p>
                <p className="text-lg sm:text-sm text-white/80">Minimal pembelian</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gambar di sebelah kanan */}
        <div className="w-full md:w-1/2 order-1 md:order-2 mb-4 md:mb-0">
          <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-md md:shadow-lg">
            <Image
              src="/image/onde.png"
              alt="Onde-onde Mas Amba"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
