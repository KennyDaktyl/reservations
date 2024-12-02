/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	env: {
	  NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
	  NEXT_PUBLIC_ROOMS_API_URL: process.env.NEXT_PUBLIC_ROOMS_API_URL,
	  NEXT_PUBLIC_RESERVATION_API_URL: process.env.NEXT_PUBLIC_RESERVATION_API_URL,
	},
	poweredByHeader: false,
  };
  
  module.exports = nextConfig;
  