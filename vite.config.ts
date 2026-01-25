import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Configuración para evitar problemas de caché en desarrollo
    force: true,
    // Headers de seguridad para desarrollo
    headers: {
      // Protección XSS
      'X-XSS-Protection': '1; mode=block',
      // Prevenir MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      // Controlar como el sitio puede ser embedido en frames (SAMEORIGIN permite iframes en el mismo origen)
      'X-Frame-Options': 'SAMEORIGIN',
      // Política de referrer
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Content Security Policy con soporte para Google Maps y YouTube
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: https://maps.googleapis.com https://maps.gstatic.com *.googlemaps.com; connect-src 'self' https: https://maps.googleapis.com; frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://youtube.com;",
      // Permissions Policy (removiendo 'location' que causaba warning)
      'Permissions-Policy': 'camera=(), microphone=(), payment=()'
    }
  },
  preview: {
    // Headers de seguridad para preview/producción
    headers: {
      'X-XSS-Protection': '1; mode=block',
      'X-Content-Type-Options': 'nosniff', 
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: https://maps.googleapis.com https://maps.gstatic.com *.googlemaps.com; connect-src 'self' https: https://maps.googleapis.com; frame-src https://www.google.com https://maps.google.com;",
      'Permissions-Policy': 'camera=(), microphone=(), location=(), payment=()',
      // Strict Transport Security (HSTS) - solo para HTTPS
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  }
});
