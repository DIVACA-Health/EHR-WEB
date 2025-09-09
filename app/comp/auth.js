'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    // Don't check auth on login or signup routes
    if (!token && pathname !== '/login' && pathname !== '/createpage' && pathname !== '/authentication' && pathname !== '/contact' && pathname !== '/about' && pathname !== '/changepassword' && pathname !== '/forgotpassword' && pathname !== '/forgotpasswordauthentication' && pathname !== '/') {
      toast.error('Session expired. Please log in again.');
      router.push('/login');
    }
  }, [router, pathname]);

  return children;
}
