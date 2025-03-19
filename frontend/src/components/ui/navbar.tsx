"use client"
import Link from "next/link";
import { motion } from "framer-motion";
export const Navbar = () => {
    return (
        <nav className="fixed w-full bg-white shadow-md p-4 flex justify-between items-center fixed top-0 left-0 z-50">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
            <motion.div 
              className="text-2xl font-bold text-blue-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Библиотека
            </motion.div>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">Главная</Link>
            <Link href="/books" className="text-gray-700 hover:text-blue-600 transition">Книги</Link>
            <Link href="/authors" className="text-gray-700 hover:text-blue-600 transition">Авторы</Link>
            <Link href="/login" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg transition hover:bg-blue-600 hover:text-white">
              Авторизация
            </Link>
          </div>
        </nav>
      );
    }
