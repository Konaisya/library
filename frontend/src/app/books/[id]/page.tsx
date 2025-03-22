"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { BASE_URL, API_URL } from "@/links/APIURL";
import Link from "next/link";
interface Author {
  id: number;
  name: string;
  image: string;
  birth_date: string;
  death_date: string | null;
  bio: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Publisher {
  id: number;
  name: string;
  image: string;
  description: string;
  foundation_year: number;
}

interface Book {
  id: number;
  name: string;
  description: string;
  image: string;
  authors: Author[];
  genres: Genre[];
  publisher: Publisher;
  year: number;
  ISBN: string;
  quantity: number;
}

interface ApiResponse {
  status: string;
  book: Book;
}

export default function BookDetailPage() {
  const pathname = usePathname();
  const id = Number(pathname.split("/").pop());

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    axios
      .get<ApiResponse>(`${API_URL}books/${id}`)
      .then((response) => {
        console.log("API Response:", response.data);
        setBook(response.data.book);
      })
      .catch((error) => {
        console.error("Ошибка загрузки книги:", error);
        setError("Ошибка загрузки книги.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Image src="/gif/loading.gif" alt="Загрузка..." width={150} height={150}/>
      </div>
    );
  }

  if (error || !book) {
    return <p className="text-center text-gray-600 mt-20">Книга не найдена</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-20"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={`${BASE_URL}${book.image}`}
          alt={book.name}
          width={384}
          height={384}
          className="w-full h-96 object-cover rounded-md mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800">{book.name}</h1>
        <p className="text-gray-600 mt-2">{book.description}</p>
        <p className="text-gray-700 mt-4">
          <strong>Авторы:</strong>{" "}
                {book.authors.map((author, index) => (
                  <span key={author.id}>
                    {index > 0 && ", "}
                    <Link href={`/authors/${author.id}`} className="text-blue-500 hover:underline">
                      {author.name}
                    </Link>
                  </span>
                ))}
              </p>
        <p className="text-gray-700">
          <strong>Жанры:</strong>{" "}
          {book.genres.map((genre) => genre.name).join(", ")}
        </p>
        <p className="text-gray-700">
          <strong>Издательство:</strong> {book.publisher.name} (основано в{" "}
          {book.publisher.foundation_year})
        </p>
        <p className="text-gray-700">
          <strong>Год выпуска:</strong> {book.year}
        </p>
        <p className="text-gray-700">
          <strong>ISBN:</strong> {book.ISBN}
        </p>
        <p className="text-gray-700">
          <strong>В наличии:</strong> {book.quantity} шт.
        </p>
      </motion.div>
    </div>
  );
}
