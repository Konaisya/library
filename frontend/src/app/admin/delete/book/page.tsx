"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
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
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await axios.get<Book[]>("http://127.0.0.1:8000/api/books/");
            setBooks(data);
        } catch (err) {
            toast.error("Ошибка", { description: "Не удалось загрузить книги" });
            console.log("Ошибка загрузки книг:", err);
        }
    };

    const handleDelete = async () => {
        if (!selectedBook) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/books/${selectedBook.id}/`);
            toast.success("Книга удалена");
            setBooks((prev) => prev.filter((b) => b.id !== selectedBook.id));
            setDialogOpen(false);
            setSelectedBook(null);
        } catch (err: unknown) {
            console.log("Ошибка удаления книги:", err);
            
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 400) {
                    toast.error("Ошибка", { description: "Невозможно удалить книгу, так как она уже заказана" });
                } else {
                    toast.error("Ошибка", { description: "Не удалось удалить книгу" });
                }
            } else {
                toast.error("Ошибка", { description: "Произошла неизвестная ошибка" });
            }
        }
    };

    if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;

    return (
        <div className="p-8 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Список книг</h1>
            {books.map(book => (
                <Card key={book.id} className="p-4 space-y-2 relative">
                    <CardContent className="space-y-1">
                        <h2 className="text-xl font-semibold">{book.name}</h2>
                        <p><b>Авторы:</b> {book.authors.map(a => a.name).join(", ")}</p>
                        <p><b>Жанры:</b> {book.genres.map(g => g.name).join(", ")}</p>
                        <p><b>Издатель:</b> {book.publisher.name}</p>
                        <p><b>Год:</b> {book.year}</p>
                        <p><b>Количество:</b> {book.count}</p>
                    </CardContent>
                    <Button
                        variant="destructive"
                        className="absolute top-4 right-4"
                        onClick={() => {
                            setSelectedBook(book);
                            setDialogOpen(true);
                        }}
                    >
                        Удалить
                    </Button>
                </Card>
            ))}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Вы точно хотите удалить книгу?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
                        <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}