"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

type Author = {
  id: number;
  name: string;
  image: string | null;
};

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    axios.get<Author[]>("http://127.0.0.1:8000/api/authors/")
      .then(response => setAuthors(response.data))
      .catch(error => console.error("Ошибка загрузки авторов:", error));
  }, []);


  return (
    <motion.div 
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Авторы
      </motion.h1>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2 } }
        }}
      >
        {authors.map(author => (
          <motion.div 
            key={author.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-4 text-center"
          >
             <Link href={`/authors/${author.id}`}>
              <Image 
                src={author.image ? `/images/${author.image}` : "/images/placeholder.png"} 
                alt={author.name} 
                width={150} 
                height={150} 
                // unoptimized={true}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{author.name}</h2>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
