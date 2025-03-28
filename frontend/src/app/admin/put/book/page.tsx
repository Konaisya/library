"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';  
import Link from "next/link";
import Image from "next/image";

export default function BooksPage() {
    const [books, setBooks] = useState<any[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        const { data } = await axios.get("http://127.0.0.1:8000/api/books/");
        setBooks(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Image  width={150} height={150} src="/gif/loading.gif" alt="Loading..." /> 
            </div>
        );
    }

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
                    <Card className="p-4 space-y-2">
                        <CardContent className="space-y-1">
                            <h2 className="text-xl font-semibold">{book.name}</h2>
                            <p><b>Авторы:</b> {book.authors.map((a: any) => a.name).join(', ')}</p>
                            <p><b>Жанры:</b> {book.genres.map((g: any) => g.name).join(', ')}</p>
                            <p><b>Издатель:</b> {book.publisher.name}</p>
                            <p><b>Год:</b> {book.year}</p>
                            <p><b>Количество:</b> {book.count}</p>
                            <Link href={`/admin/put/book/${book.id}`}>
                                <Button className="bg-blue-500 text-white hover:bg-blue-600">Редактировать</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

