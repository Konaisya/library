"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Библиотека МБОУ СОШ №51
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Добро пожаловать в нашу школьную библиотеку! Здесь вы найдете множество книг, 
        полезных материалов и сможете погрузиться в увлекательный мир знаний.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Link href="/books">
          <Button className="px-6 py-3 text-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition">
            Исследовать коллекцию книг
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
