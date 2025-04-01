"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BASE_URL, API_URL } from "@/links/APIURL";

type Author = {
  id: number;
  name: string;
  image: string;
  birth_date: string;
  death_date: string | null;
  bio: string;
};

export default function AuthorPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      axios
        .get<Author>(`${API_URL}authors/${id}`)
        .then((response) => setAuthor(response.data))
        .catch((error) => console.error("Ошибка загрузки автора:", error));
    }
  }, [id]);

  const calculateAge = (birthDate: string, deathDate: string | null) => {
    const birth = new Date(birthDate);
    const death = deathDate ? new Date(deathDate) : new Date();
    const age = death.getFullYear() - birth.getFullYear();
    const isBirthdayPassed =
      death.getMonth() > birth.getMonth() ||
      (death.getMonth() === birth.getMonth() && death.getDate() >= birth.getDate());

    return isBirthdayPassed ? age : age - 1;
  };

  const getAgeString = (age: number) => {
    if (age % 10 === 1 && age % 100 !== 11) return `${age} год`;
    if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) return `${age} года`;
    return `${age} лет`;
  };

  if (!author) {
    return <p className="text-center mt-10">Загрузка...</p>;
  }

  return (
    <motion.div
      className="container mx-auto p-6 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={`${BASE_URL}${author.image}`}
          alt={author.name}
          width={200}
          height={200}
          unoptimized={true}
          className="w-48 h-48 mx-auto rounded-full object-cover mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800">{author.name}</h1>
        <p className="text-gray-600 mt-2">
          {`(${new Date(author.birth_date).toLocaleDateString()} - ${
            author.death_date ? new Date(author.death_date).toLocaleDateString() : "н.в."
          })`}
        </p>
        <p className="text-lg font-semibold text-gray-700 mt-2">
          {author.death_date
            ? `Прожил ${getAgeString(calculateAge(author.birth_date, author.death_date))}`
            : `Возраст: ${getAgeString(calculateAge(author.birth_date, null))}`}
        </p>
        <motion.p className="mt-4 text-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          {author.bio}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
