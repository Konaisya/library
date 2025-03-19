"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { books } from "../books";

type BookDetailPageProps = {
    id: number;
    name: string;
    description: string;
    image: string;
    publishers: string;
    author: string;
    year: number;
    ISBN: string;
};

export default function BookDetailPage() {
  const pathname = usePathname();
  const id = Number(pathname.split("/").pop());
  const book = books.find((b) => b.id === id);

  if (!book) {
    return <p className="text-center text-gray-600 mt-20">Книга не найдена</p>;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <motion.div
        className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-20"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}>
            <img src={book.image} alt={book.name} className="w-full h-96 object-cover rounded-md mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">{book.name}</h1>
            <p className="text-gray-600 mt-2">{book.description}</p>
            <p className="text-gray-700 mt-4"><strong>Автор:</strong> {book.author}</p>
            <p className="text-gray-700"><strong>Издатель:</strong> {book.publishers}</p>
            <p className="text-gray-700"><strong>Год выпуска:</strong> {book.year}</p>
            <p className="text-gray-700"><strong>ISBN:</strong> {book.ISBN}</p>
      </motion.div>
    </div>
  );
}