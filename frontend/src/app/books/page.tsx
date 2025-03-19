"use client"
import { useState } from 'react';
import { LazyMotion, domAnimation, motion } from "framer-motion";
import Link from "next/link";
import { books } from "./books";

interface Book {
  id: number;
  name: string;
  description: string;
  image: string;
  publishers: string;
  author: string;
  year: number;
  ISBN: string;
}

interface GroupedBook extends Omit<Book, 'ISBN'> {
  ISBNs: string[];
}

function groupBooksByNameAndPublisher(books: Book[]): GroupedBook[] {
  const groupedBooks: { [key: string]: GroupedBook } = {};

  books.forEach((book) => {
    const { name, publishers, ISBN, ...restBook } = book;
    const key = `${name}-${publishers}`;
    if (groupedBooks[key]) {
      groupedBooks[key].ISBNs.push(ISBN);
    } else {
      groupedBooks[key] = {
        ...restBook,
        name,
        publishers,
        ISBNs: [ISBN], 
      };
    }
  });

  return Object.values(groupedBooks);
}

function getUniqueAuthors(books: Book[]): string[] {
    const authors = books.map(book => book.author);
    return Array.from(new Set(authors));
}

export default function BooksPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false); // Состояние для видимости поиска
    const groupedBooks = groupBooksByNameAndPublisher(books);
    const uniqueAuthors = getUniqueAuthors(books);
    const filteredBooks = groupedBooks.filter(book => {
      const matchesSearchTerm = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAuthor = authorFilter ? book.author.toLowerCase().includes(authorFilter.toLowerCase()) : true;
      const matchesYear = yearFilter ? book.year.toString().includes(yearFilter) : true;
      return matchesSearchTerm && matchesAuthor && matchesYear;
    });

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
        {filteredBooks.map((book, index) => (
          <Link key={book.id} href={`/books/${book.id}`}>
            <LazyMotion features={domAnimation}>
              <motion.div
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ transition: { duration: 0.3 }, scale: 1.05, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-40 h-40 object-cover rounded-md mb-4 mx-auto"
                />
                <h2 className="text-xl font-semibold text-gray-800 text-center">{book.name}</h2>
                <p className="text-gray-600 text-center">{book.author}</p>
              </motion.div>
            </LazyMotion>
          </Link>
        ))}
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
          <input
            type="text"
            placeholder="Год..."
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          />
        </motion.div>
      )}
    </div>
  );
}
