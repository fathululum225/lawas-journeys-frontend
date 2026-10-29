import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', // Tambahan untuk static export
  images: {
    unoptimized: true, // Wajib ditambahkan agar gambar tidak error saat di-export
  },
};

export default nextConfig;