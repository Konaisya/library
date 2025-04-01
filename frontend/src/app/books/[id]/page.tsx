"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { BASE_URL, API_URL } from "@/links/APIURL";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { toast, Toaster } from "sonner";

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
  const [orderError, setOrderError] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  useEffect(() => {
    if (!id) return;

    axios
      .get<Book>(`${API_URL}books/${id}`)
      .then((response) => {
        setBook({
          ...response.data,
          quantity: response.data.count,
        });
      })
      .catch(() => setError("Ошибка загрузки книги."))
      .finally(() => setLoading(false));
  }, [id]);

  const getMaxReturnDate = (): Date => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    maxDate.setDate(maxDate.getDate() + 15);
    return maxDate;
  };

  const isDateDisabled = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    return date < threeDaysLater || date > getMaxReturnDate();
  };

  const handleConfirmOrder = () => {
    if (!selectedDate) {
      toast.error("Пожалуйста, выберите дату возврата.");
      return;
    }
    if (!book?.id) return;

    setIsOrdering(true);
    axios
      .post(
        `${API_URL}orders/`,
        {
          id_book: book.id,
          due_date: selectedDate.toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Книга успешно заказана!");
        setIsModalOpen(false);
        setSelectedDate(undefined);
        setOrderError("");
      })
      .catch(() => {
        toast.error("Ошибка при оформлении заказа.");
      })
      .finally(() => setIsOrdering(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Image src="/gif/loading.gif" alt="Загрузка..." width={150} height={150} />
      </div>
    );
  }

  if (error || !book) {
    return <p className="text-center text-gray-600 mt-20">Книга не найдена</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster />
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

        {token && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button
                disabled={book.quantity === 0}
                className={`mt-4 py-2 px-4 rounded-md text-white ${
                  book.quantity === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Заказать книгу
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Выберите дату возврата</DialogTitle>
              </DialogHeader>
              <Calendar className="justify-center m-auto" mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={isDateDisabled} />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isOrdering || !selectedDate}
                  className={`py-2 px-4 text-white rounded-md ${
                    isOrdering ? "bg-blue-400 cursor-wait" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isOrdering ? "Оформление..." : "Подтвердить заказ"}
                </button>
              </div>
              {orderError && <p className="text-red-500 mt-2">{orderError}</p>}
            </DialogContent>
          </Dialog>
        )}

        {!token &&  <p className="text-gray-500 mt-4"><Link href="/auth/signIn" className="text-blue-500 hover:underline">Войдите</Link>, чтобы заказать книгу.</p>}
      </motion.div>
    </div>
  );
}
