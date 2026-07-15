/** @type {import('next').NextConfig} */
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips = ['localhost', 'localhost:3000', '127.0.0.1'];
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && !alias.internal) {
        ips.push(alias.address);
        ips.push(`${alias.address}:3000`);
      }
    }
  }
  return ips;
};

const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false, // Disables X-Powered-By header to hide framework information
  compiler: {
    // Automatically strip all console.logs in production (Vercel)
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  allowedDevOrigins: getLocalIPs(),
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: blob: https://lh3.googleusercontent.com https://images.unsplash.com; connect-src 'self' https://xviktwxpipewopxsveab.supabase.co wss://xviktwxpipewopxsveab.supabase.co https://lh3.googleusercontent.com localhost:* 127.0.0.1:* ws://localhost:* ws://127.0.0.1:*; font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com; frame-src 'self' https://docs.google.com https://drive.google.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
