"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL, BASE_URL } from "@/links/APIURL";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAdminCheck } from "@/hooks/useAdminCheck";

type Publisher = {
  id: number;
  name: string;
  image: string | null;
  description: string;
  foundation_year: number;
};

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isAdmin = useAdminCheck();

  useEffect(() => {
    axios
      .get<Publisher[]>(`${API_URL}publishers/`)
      .then((response) => {
        setPublishers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки издателей:", error);
        setLoading(false);
      });
  }, []);

  if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;

  if (loading) {
    return <p className="text-center mt-10 text-lg font-semibold">Загрузка издателей...</p>;
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center mb-6">🏢 Издательства</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publishers.map((publisher) => (
          <motion.div
            key={publisher.id}
            className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-between cursor-pointer"
            onClick={() => router.push(`publisher/${publisher.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-4">
              {publisher.image && (
                <Image
                  src={`${BASE_URL}${publisher.image}`}
                  alt={publisher.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-lg font-semibold">{publisher.name}</span>
            </div>
            <span className="text-gray-500 text-sm">{publisher.foundation_year} г.</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
