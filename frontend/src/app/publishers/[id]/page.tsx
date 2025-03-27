"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

interface Publisher {
  id: number;
  name: string;
  image: string;
  description: string;
  foundation_year: number;
}

export default function PublisherDetailPage() {
  const { id } = useParams();
  const [publisher, setPublisher] = useState<Publisher | null>(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/publishers/${id}`)
      .then((response) => setPublisher(response.data.new_publisher))
      .catch((error) => console.error("Ошибка загрузки издателя:", error));
  }, [id]);

  if (!publisher) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10 md:p-20">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          width={200}
          height={200}
          src={`http://127.0.0.1:8000/${publisher.image}`}
          alt={publisher.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{publisher.name}</h1>
        <p className="text-gray-600 mb-4">Основано в {publisher.foundation_year} году</p>
        <p className="text-lg">{publisher.description}</p>
      </motion.div>
    </div>
  );
}
