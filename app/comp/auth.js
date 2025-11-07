'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login', '/createpage', '/authentication', '/contact', '/about', '/changepassword', '/forgotpassword', '/forgotpasswordauthentication', '/'];

  const isTokenExpired = (token) => {
    try {
      // Decode JWT token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const decoded = JSON.parse(jsonPayload);
      
      // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If we can't decode it, treat it as expired
    }
  };

  useEffect(() => {
    // Skip validation on public routes
    if (publicRoutes.includes(pathname)) {
      return;
    }

    const token = localStorage.getItem('access_token');

    // No token present
    if (!token) {
      toast.error('Session expired. Please log in again.');
      router.push('/login');
      return;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      localStorage.removeItem('access_token');
      toast.error('Session expired. Please log in again.');
      router.push('/login');
    }
  }, [router, pathname]);

  return children;
}