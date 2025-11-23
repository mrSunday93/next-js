/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "res.cloudinary.com", // URL gambar
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "api.cloudinary.com", // supaya Next.js tidak error
          pathname: "/**",
        },
      ],
    },
  };
  
  export default nextConfig;
  