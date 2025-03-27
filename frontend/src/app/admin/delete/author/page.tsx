"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL, API_URL } from "@/links/APIURL";
import Image from "next/image";
import { useAdminCheck } from "@/hooks/useAdminCheck";
type Author = {
  id: number;
  name: string;
  image: string | null;
};

export default function AuthorsPage() {
  const isAdmin = useAdminCheck();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  useEffect(() => {
    axios
      .get<Author[]>(`${API_URL}authors/`)
      .then((response) => {
        setAuthors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки авторов:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: number) => {
    axios
      .delete(`${API_URL}authors/${id}`)
      .then(() => {
        setAuthors(authors.filter((author) => author.id !== id));
        setSelectedAuthor(null);
      })
      .catch((error) => console.error("Ошибка удаления автора:", error));
  };
  if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;
  if (loading) {
    return <p className="text-center text-lg font-semibold mt-10">Загрузка авторов...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h1 className="text-3xl font-bold text-center mb-6">📚 Авторы</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {authors.map((author) => (
          <motion.div
            key={author.id}
            className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-4">
              {author.image && (
                <Image
                  src={`${BASE_URL}${author.image}`}
                  alt={author.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-lg font-semibold">{author.name}</span>
            </div>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => setSelectedAuthor(author)}
            >
              Удалить
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAuthor && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center  bg-opacity-30 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-semibold mb-4 text-center">
                Вы точно хотите удалить автора <span className="text-red-500">{selectedAuthor.name}</span>?
              </p>
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => setSelectedAuthor(null)}
                >
                  Отмена
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => handleDelete(selectedAuthor.id)}
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
