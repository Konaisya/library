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
  count: number;
}

export default function BookDetailPage() {
  const pathname = usePathname();
  const id = Number(pathname.split("/").pop());

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderError, setOrderError] = useState("");  // Ошибка при заказе
  const [isOrdering, setIsOrdering] = useState(false);  // Загрузка при заказе

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!id) return;
  
    axios
      .get<Book>(`${API_URL}books/${id}`)
      .then((response) => {
        console.log("API Response:", response.data);
        setBook({
          ...response.data,
          quantity: response.data.count, 
        });
      })
      .catch((error) => {
        console.error("Ошибка загрузки книги:", error);
        setError("Ошибка загрузки книги.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getNextValidDate = (): string => {
    const today = new Date();
    const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
    let nextValidDate = today;

    while (nextValidDate <= twoMonthsLater) {
      nextValidDate.setDate(nextValidDate.getDate() + 1);
      const dayOfWeek = nextValidDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { 
        break;
      }
    }

    return nextValidDate.toISOString().split('T')[0];
  };

  const handleOrderBook = () => {
    if (!token) {
      setOrderError("Пожалуйста, войдите в систему для заказа.");
      return;
    }
    if (book && book.quantity === 0) {
      setOrderError("Книга не доступна для заказа.");
      return;
    }
    setIsOrdering(true);
    const orderData = {
      id_book: book?.id, 
      due_date: getNextValidDate(),  
    };
    console.log("Отправка данных на сервер:", orderData); 

    axios.post(`${API_URL}orders/`, orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        console.error("Ошибка при оформлении заказа:", error);
        if (error.response) {
          console.log("Ответ от сервера:", error.response.data);  
        }
        setOrderError("Ошибка при оформлении заказа.");
      })
      .finally(() => setIsOrdering(false));
  };

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
          <strong>Издательство:</strong>{" "}
          <Link href={`/publishers/${book.publisher.id}`} className="text-blue-500 hover:underline">
            {book.publisher.name}
          </Link>{" "}
          (основано в {book.publisher.foundation_year})
        </p>

        <p className="text-gray-700">
          <strong>Жанры:</strong>{" "}
          {book.genres.map((genre) => genre.name).join(", ")}
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

        <button
          onClick={handleOrderBook}
          disabled={book.quantity === 0 || isOrdering} 
          className={`mt-4 py-2 px-4 rounded-md text-white ${
            book.quantity === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isOrdering ? "Оформление..." : "Заказать книгу"}
        </button>

        {orderError && <p className="text-red-500 mt-2">{orderError}</p>}
      </motion.div>
    </div>
  );
}