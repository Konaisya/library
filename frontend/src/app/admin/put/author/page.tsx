"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, BASE_URL } from "@/links/APIURL";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAdminCheck } from "@/hooks/useAdminCheck";

type Author = {
  id: number;
  name: string;
  image: string | null;
  birth_date: string;
  death_date: string | null;
};

export default function AuthorsList() {
  const isAdmin = useAdminCheck();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<Author[]>(`${API_URL}authors/`)
      .then((response) => setAuthors(response.data))
      .catch((error) => console.log("Ошибка загрузки авторов:", error))
      .finally(() => setLoading(false));
  }, []);

  if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;

  if (loading) {
    return <p className="text-center mt-10">Загрузка...</p>;
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

      {authors.length === 0 ? (
        <p className="text-center text-gray-600">Нет доступных авторов.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authors.map((author) => (
            <motion.div
              key={author.id}
              className="flex items-center gap-4 p-4 border rounded-lg shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              {author.image && (
                <Image
                  src={`${BASE_URL}${author.image}`}
                  alt={author.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              )}

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{author.name}</h2>
                <p className="text-gray-600 text-sm">
                  {new Date(author.birth_date).toLocaleDateString()} -{" "}
                  {author.death_date ? new Date(author.death_date).toLocaleDateString() : "н.в."}
                </p>
              </div>

              <Link href={`/admin/put/author/${author.id}`}>
                <Button>Редактировать</Button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
