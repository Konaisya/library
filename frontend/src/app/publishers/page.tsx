"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { BASE_URL } from "@/links/APIURL";
import Image from "next/image";
interface Publisher {
  id: number;
  name: string;
  image: string;
}

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get<Publisher[]>("http://127.0.0.1:8000/api/publishers/")
      .then((response) => {
        setPublishers(response.data);
      })
      .catch((error) => {
        console.log("Ошибка загрузки издателей:", error);
        setPublishers([]);
      });
  }, []);

  if (publishers.length === 0) {
    return <p className="text-center mt-10">Загрузка...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
    <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Издательства
      </motion.h1>

      {publishers.length === 0 ? (
        <p className="text-center text-gray-500">Нет доступных издателей</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {publishers.map((publisher) => (
            <motion.div
              key={publisher.id}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push(`/publishers/${publisher.id}`)}
            >
              <Image
                width={300}
                height={300}
                objectFit="cover"
                src={`${BASE_URL}${publisher.image}`}
                alt={publisher.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h2 className="text-xl font-semibold mt-4 text-center">{publisher.name}</h2>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
