"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return null;
  }
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [bgColor, setBgColor] = useState("bg-white");
  const [authLabel, setAuthLabel] = useState("Авторизация");
  const [authLink, setAuthLink] = useState("/auth/signIn");

  useEffect(() => {
    if (pathname === "/auth/signUp" || pathname === "/auth/signIn") {
      setBgColor("bg-indigo-600 text-white");
    } else {
      setBgColor("bg-white text-gray-700");
    }
  }, [pathname]);

  useEffect(() => {
    const updateAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      const role = getRoleFromToken(token);
  
      if (role === "ADMIN") {
        setAuthLabel("Админ панель");
        setAuthLink("/admin");
      } else if (role) {
        setAuthLabel("Профиль");
        setAuthLink("/profile/user");
      } else {
        setAuthLabel("Авторизация");
        setAuthLink("/auth/signIn");
      }
    };
    updateAuthStatus();
    const interval = setInterval(updateAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={`fixed w-full ${bgColor} shadow-md p-4 flex justify-between items-center top-0 left-0 z-1001 transition-colors duration-500`}>
      <Link href="/" className="hover:text-blue-600 transition">
        <motion.div 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Библиотека
        </motion.div>
      </Link>

      <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`lg:flex items-center space-x-6 hidden`}>
        <Link href="/" className="hover:text-blue-600 transition">Главная</Link>
        <Link href="/books" className="hover:text-blue-600 transition">Книги</Link>
        <Link href="/authors" className="hover:text-blue-600 transition">Авторы</Link>
        <Link href="/publishers" className="hover:text-blue-600 transition">Издатели</Link>
        <Link href={authLink} className="border px-4 py-2 rounded-lg transition hover:bg-blue-600 hover:text-white">
          {authLabel}
        </Link>
      </div>
      
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full shadow-md flex flex-col items-center space-y-4 py-4 transition-colors duration-500">
          <Link href="/" className="hover:text-blue-600 transition" onClick={() => setIsOpen(false)}>Главная</Link>
          <Link href="/books" className="hover:text-blue-600 transition" onClick={() => setIsOpen(false)}>Книги</Link>
          <Link href="/authors" className="hover:text-blue-600 transition" onClick={() => setIsOpen(false)}>Авторы</Link>
          <Link href="/publishers" className="hover:text-blue-600 transition" onClick={() => setIsOpen(false)}>Издатели</Link>  
          <Link href="/auth/signIn" className="border px-4 py-2 rounded-lg transition hover:bg-blue-600 hover:text-white" onClick={() => setIsOpen(false)}>
            Авторизация
          </Link>
        </div>
      )}
    </nav>
  );
};
