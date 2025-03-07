/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL
      },
      {
        protocol: "https",
        hostname: "https://kbswiwnnsqgxhcdzrfvt.supabase.co/"
      }
    ]
  }
};

export default nextConfig;
