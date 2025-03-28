"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function BooksPage() {
    const [books, setBooks] = useState<any[]>([]);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const { data } = await axios.get("http://127.0.0.1:8000/api/books/");
        setBooks(data);
    };
    const handleDelete = async () => {
        if (!selectedBook) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/books/${selectedBook.id}/`);
            toast("Книга удалена");
            setBooks(prev => prev.filter(b => b.id !== selectedBook.id));
            setDialogOpen(false);
            setSelectedBook(null);
        } catch (error) {
            toast("Ошибка", { description: "Не удалось удалить книгу" });
        }
    };
    return (
        <div className="p-8 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Список книг</h1>
            {books.map(book => (
                <Card key={book.id} className="p-4 space-y-2 relative">
                    <CardContent className="space-y-1">
                        <h2 className="text-xl font-semibold">{book.name}</h2>
                        <p><b>Авторы:</b> {book.authors.map((a: any) => a.name).join(', ')}</p>
                        <p><b>Жанры:</b> {book.genres.map((g: any) => g.name).join(', ')}</p>
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
