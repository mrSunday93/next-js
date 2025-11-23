const Footer = () => {
  return (
    <footer className="relative bg-[#101015] text-[#BEBEC4] py-16 px-6 border-t border-[#1F1F27]">

      <div className="absolute top-0 left-0 w-20 h-[2px] bg-[#FF9300]/40"></div>
      <div className="absolute top-0 left-0 h-20 w-[2px] bg-[#FF9300]/40"></div>
      <div className="absolute bottom-0 right-0 w-20 h-[2px] bg-[#FF9300]/40"></div>
      <div className="absolute bottom-0 right-0 h-20 w-[2px] bg-[#FF9300]/40"></div>

      <div className="container mx-auto max-w-7xl relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#FF9300] tracking-wider uppercase border-b border-[#FF9300]/40 pb-2">
              Onde-onde
            </h2>
            <p className="text-sm">Jl. Los angeles</p>
            <p className="text-sm">Email: anandasicopratama@gmail.com</p>
            <a
              href="https://wa.me/6281932827666"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white transition underline underline-offset-2"
            >
              Telepon: +62 819-3282-7666
            </a>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#FF9300] uppercase tracking-wider border-b border-[#FF9300]/40 pb-2">
              Menu
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="hover:text-white transition">Tentang Kami</li>
              <li className="hover:text-white transition">Produk</li>
              <li className="hover:text-white transition">Kontak</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#FF9300] uppercase tracking-wider border-b border-[#FF9300]/40 pb-2">
              Jam Operasional
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>Senin – Jumat: 08.00 - 20.00</li>
              <li>Sabtu: 08.00 - 22.00</li>
              <li>Minggu: Tutup</li>
            </ul>
          </div>

        </div>
        <div className="text-center mt-14 text-xs text-[#8b8b95] tracking-wide">
          © {new Date().getFullYear()} Onde-masImron. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
