import { Inter } from 'next/font/google';
import "./globals.css";
import { icons } from "lucide-react";
import 'typeface-inter';
import { Toaster } from "react-hot-toast";


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: "DIVACA HEALTH",
  description: "Your Trusted Platform for Digital Health Records",
  icons: "/LOGO.png"
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.variable}
      >
         <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
