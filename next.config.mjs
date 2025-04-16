/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: "https://ehr-backend-4vx2.onrender.com/api/:path*",
        },
      ];
    },
  };
  
  export default nextConfig;
  