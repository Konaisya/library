"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { LazyMotion, domAnimation, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL, API_URL } from "@/links/APIURL";
import { Button } from "@/components/ui/button";

interface Book {
  id: number;
  name: string;
  description: string;
  image: string;
  year: number;
  ISBN: string;
  authors: { id: number; name: string }[];
  publisher: { id: number; name: string };
  genres: { id: number; name: string }[];
  quantity: number;
}

interface GroupedBook extends Omit<Book, 'ISBN'> {
  ISBNs: string[];
}

function groupBooksByNameAndPublisher(books: Book[]): GroupedBook[] {
  const groupedBooks: { [key: string]: GroupedBook } = {};

  books.forEach((book) => {
    const { name, publisher, ISBN, ...restBook } = book;
    const key = `${name}-${publisher.name}`;
    if (groupedBooks[key]) {
      groupedBooks[key].ISBNs.push(ISBN);
      groupedBooks[key].quantity += book.quantity;
    } else {
      groupedBooks[key] = {
        ...restBook,
        name,
        publisher,
        ISBNs: [ISBN],
        quantity: book.quantity,
      };
    }
  });
  return Object.values(groupedBooks);
}

function getUniqueAuthors(books: Book[]): string[] {
  const authors = books.flatMap(book => book.authors.map(author => author.name));
  return Array.from(new Set(authors));
}

function getUniqueGenres(books: Book[]): string[] {
  const genres = books.flatMap(book => book.genres.map(genre => genre.name));
  return Array.from(new Set(genres));
}

function getUniquePublishers(books: Book[]): string[] {
  const publishers = books.map(book => book.publisher.name);
  return Array.from(new Set(publishers));
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [publisherFilter, setPublisherFilter] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<GroupedBook | null>(null);

  useEffect(() => {
    axios.get<Book[]>(`${API_URL}books/`)
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки книг:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, authorFilter, yearFilter, genreFilter, publisherFilter]);

  const groupedBooks = groupBooksByNameAndPublisher(books);
  const uniqueAuthors = getUniqueAuthors(books);
  const uniqueGenres = getUniqueGenres(books);
  const uniquePublishers = getUniquePublishers(books);

  const filteredBooks = groupedBooks.filter(book => {
    const matchesSearchTerm = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuthor = authorFilter ? book.authors.some(author => author.name.toLowerCase().includes(authorFilter.toLowerCase())) : true;
    const matchesYear = yearFilter ? book.year.toString().includes(yearFilter) : true;
    const matchesGenre = genreFilter ? book.genres.some(genre => genre.name.toLowerCase().includes(genreFilter.toLowerCase())) : true;
    const matchesPublisher = publisherFilter ? book.publisher.name.toLowerCase().includes(publisherFilter.toLowerCase()) : true;
    return matchesSearchTerm && matchesAuthor && matchesYear && matchesGenre && matchesPublisher;
  });

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const openModal = (book: GroupedBook) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Image src="/gif/loading.gif" alt="Загрузка..." width={150} height={150} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mt-20 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Коллекция книг
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {currentBooks.map((book, index) => (
        <LazyMotion key={book.id} features={domAnimation}>
          <motion.div
            className={`p-4 rounded-lg shadow-md flex flex-col justify-between transition-shadow 
              ${book.quantity === 0 ? 'bg-gray-300' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/books/${book.id}`}>
              <Image
                src={`${BASE_URL}${book.image}`}
                alt={book.name}
                width={200}
                height={100}
                className="object-cover rounded-md mb-4 mx-auto w-80 h-100"
              />
              <h2 className={`text-xl font-semibold text-center ${book.quantity === 0 ? 'text-gray-500' : 'text-gray-800'}`}>
                {book.name}
              </h2>
            </Link>

            <p className="text-gray-600 text-center">
              {book.authors.map((author, index) => (
                <span key={author.id}>
                  {index > 0 && ", "}
                  <Link href={`/authors/${author.id}`} className="text-blue-500 hover:underline">
                    {author.name}
                  </Link>
                </span>
              ))}
            </p>
            
            {book.quantity === 0 && (
              <p className="text-red-500 text-center font-bold mt-2">Книга недоступна</p>
            )}

            <Button
              onClick={(e) => {
                e.stopPropagation();
                openModal(book);
              }}
              className={`mt-2 text-white relative bottom-0 ${book.quantity === 0 ? 'bg-gray-500' : 'bg-blue-500'} hover:${book.quantity === 0 ? 'bg-gray-600' : 'bg-blue-600'} rounded-lg px-4 py-2 w-full`}
            >
              Показать все ISBNs
            </Button>
          </motion.div>
        </LazyMotion>
      ))}
      </div>

      {isModalOpen && selectedBook && (
        <motion.div
          className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">ISBNы книги: {selectedBook.name}</h2>
            {selectedBook.quantity === 0 ? (
              <p className="text-center text-red-500 font-semibold">Пока что недоступна</p>
            ) : (
              <ul className="list-disc pl-5">
                {selectedBook.ISBNs.map((isbn, index) => (
                  <li key={index} className="text-gray-600">{isbn}</li>
                ))}
              </ul>
            )}
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Закрыть
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={handlePreviousPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md disabled:bg-gray-300"
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span className="mx-4 text-xl text-gray-800">
          Страница {currentPage} из {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md disabled:bg-gray-300"
          disabled={currentPage === totalPages}
        >
          Вперёд
        </button>
      </div>

      {!isSearchVisible && (
        <button
          onClick={() => setIsSearchVisible(true)}
          className="fixed top-20 right-6 p-2 bg-blue-500 text-white rounded-lg shadow-md z-20"
        >
          Показать поиск
        </button>
      )}
      {isSearchVisible && (
        <motion.div
          className="fixed top-20 right-6 w-64 p-4 bg-white shadow-md rounded-lg z-10"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => setIsSearchVisible(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Поиск</h2>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          />
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Все авторы</option>
            {uniqueAuthors.map((author, index) => (
              <option key={index} value={author}>
                {author}
              </option>
            ))}
          </select>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Все жанры</option>
            {uniqueGenres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select 
            value={publisherFilter}
            onChange={(e) => setPublisherFilter(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Все издатели</option>
            {uniquePublishers.map((publisher, index) => (
              <option key={index} value={publisher}>
                {publisher}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Год выпуска"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          />
        </motion.div>
      )}
    </div>
  );
}