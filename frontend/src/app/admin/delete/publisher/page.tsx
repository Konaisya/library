"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { API_URL, BASE_URL } from "@/links/APIURL";
import { useAdminCheck } from "@/hooks/useAdminCheck";
type Publisher = {
  id: number;
  name: string;
  logo: string | null;
};

export default function PublishersPage() {
  const isAdmin = useAdminCheck();
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);

  useEffect(() => {
    axios.get<Publisher[]>(`${API_URL}publishers/`)
      .then((response) => {
        setPublishers(response.data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки издателей:", error);
        setPublishers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`${API_URL}publishers/${id}/`)
      .then(() => {
        setPublishers(publishers.filter((publisher) => publisher.id !== id));
        setSelectedPublisher(null);
      })
      .catch((error) => console.error("Ошибка удаления издателя:", error));
  };
  
  if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;

  if (loading) {
    return <p className="text-center text-lg font-semibold mt-10">Загрузка издателей...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publishers.map((publisher) => (
          <motion.div
            key={publisher.id}
            className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-4">
              {publisher.logo && (
                <Image
                  src={`${BASE_URL}${publisher.logo}`}
                  alt={publisher.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-lg font-semibold">{publisher.name}</span>
            </div>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => setSelectedPublisher(publisher)}
            >
              Удалить
            </button>
          </motion.div>
        ))}
      </div>

      {selectedPublisher && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-10 backdrop-blur-md">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg font-semibold mb-4">
              Вы точно хотите удалить издателя <span className="text-red-500">{selectedPublisher.name}</span>?
            </p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setSelectedPublisher(null)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => handleDelete(selectedPublisher.id)}
              >
                Удалить
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
