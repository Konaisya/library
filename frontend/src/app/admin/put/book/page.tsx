"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import Link from "next/link";
import Image from "next/image";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAdminCheck } from "@/hooks/useAdminCheck";


interface Author {
    id: number;
    name: string;
}

interface Genre {
    id: number;
    name: string;
}

interface Publisher {
    id: number;
    name: string;
}

interface Book {
    id: number;
    name: string;
    authors: Author[];
    genres: Genre[];
    publisher: Publisher;
    year: number;
    count: number;
}


export default function BooksPage() {
    const isAdmin = useAdminCheck();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        const { data } = await axios.get<Book[]>("http://127.0.0.1:8000/api/books/");
        setBooks(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Image width={150} height={150} src="/gif/loading.gif" alt="Loading..." />
            </div>
        );
    }

    if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;

    return (
        <div className="p-8 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Список книг</h1>
            {books.map(book => (
                <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="shadow-lg rounded-lg"
                >
                    <HoverCard>
                        <HoverCardTrigger>
                            <Card className="p-4 space-y-2">
                                <CardContent className="space-y-1">
                                    <h2 className="text-xl font-semibold">{book.name}</h2>
                                    <p><b>Авторы:</b> {book.authors.map((a) => a.name).join(', ')}</p>
                                    <p><b>Жанры:</b> {book.genres.map((g) => g.name).join(', ')}</p>
                                    <p><b>Издатель:</b> {book.publisher.name}</p>
                                    <p><b>Год:</b> {book.year}</p>
                                    <p><b>Количество:</b> {book.count}</p>
                                    <Link href={`/admin/put/book/${book.id}`}>
                                        <Button className="bg-blue-500 text-white hover:bg-blue-600">Редактировать</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <p>Редактировать можно только: </p>
                            <span><b>Название</b>, <b>Авторов</b>, <b>Жанры</b>, <b>Издательство</b>, <b>Год</b>, <b>Количество</b></span>
                        </HoverCardContent>
                    </HoverCard>
                </motion.div>
            ))}
        </div>
    );
}
