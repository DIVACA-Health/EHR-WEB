import { Inter } from 'next/font/google';
import "./globals.css";
import { icons } from "lucide-react";
import 'typeface-inter';
import { Toaster } from "react-hot-toast";
import AuthGuard from './comp/AuthGuard'


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: "DIVACA HEALTH",
  description: "Your Trusted Platform for Digital Health Records",  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.variable}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
