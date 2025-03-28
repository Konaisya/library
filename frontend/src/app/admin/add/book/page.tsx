"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
// import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CreateBookPage() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        image: null as File | null,
        ids_author: [] as number[],
        ids_genre: [] as number[],
        id_publisher: 0,
        year: 0,
        ISBN: "",
        count: 0,
    });

    const [authors, setAuthors] = useState<any[]>([]);
    const [publishers, setPublishers] = useState<any[]>([]);
    const [genres, setGenres] = useState<any[]>([]);
    const [genreModalOpen, setGenreModalOpen] = useState(false);
    const [newGenreName, setNewGenreName] = useState("");
    // const [imagePreview, setImagePreview] = useState<string | null>(null);


    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/authors/").then(res => setAuthors(res.data));
        axios.get("http://127.0.0.1:8000/api/publishers/").then(res => setPublishers(res.data));
        axios.get("http://127.0.0.1:8000/api/genres/").then(res => setGenres(res.data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0] || null;
    //     setForm({ ...form, image: file });
    //     setImagePreview(file ? URL.createObjectURL(file) : null);
    // };

    const handleCreateGenre = async () => {
        if (!newGenreName.trim()) return;
        try {
            const { data } = await axios.post("http://127.0.0.1:8000/api/genres/", { name: newGenreName });
            setGenres(prev => [...prev, data]);
            setForm(prev => ({ ...prev, ids_genre: [...prev.ids_genre, data.id] }));
            setGenreModalOpen(false);
            setNewGenreName("");
            toast("Жанр успешно создан");  
        } catch (err) {
            toast("Ошибка", {description: "Не удалось создать жанр"});
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = { ...form, year: Number(form.year), count: Number(form.count) };
    
            await axios.post("http://127.0.0.1:8000/api/books/", payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            toast("Книга успешно создана");  
        } catch (error) {
            toast("Ошибка", {description: "Не удалось создать книгу"});
            
        }
    };
    

    return (
    <motion.div 
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 mt-16"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        >
        <Card className="w-full max-w-2xl p-8 space-y-6 shadow-2xl rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md">
            <h1 className="text-3xl font-extrabold text-center text-gray-800">Добавить книгу </h1>
            
            <div className="space-y-1">
                <Label>Название</Label>
                <Input placeholder="Введите название книги" name="name" value={form.name} onChange={handleChange} />
            </div>

            {/* Описание */}
            <div className="space-y-1">
                <Label>Описание</Label>
                <Textarea placeholder="Краткое описание" name="description" value={form.description} onChange={handleChange} />
            </div>

            {/* <div className="space-y-1">
                <Label>Обложка (необязательно)</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                <AnimatePresence>
                    {imagePreview && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative rounded-xl overflow-hidden mt-2"
                        >
                            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-xl shadow" />
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2 backdrop-blur bg-white/60 hover:bg-white"
                                onClick={() => { setForm({ ...form, image: null }); setImagePreview(null); }}
                            >
                                Удалить
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div> */}

            <div className="space-y-1">
                <Label>Авторы</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                            {form.ids_author.length > 0
                                ? authors.filter(a => form.ids_author.includes(a.id)).map(a => a.name).join(', ')
                                : "Выберите авторов"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 space-y-2 max-h-60 overflow-y-auto rounded-xl">
                        {authors.map(author => (
                            <div key={author.id} className="flex items-center space-x-2">
                                <Checkbox
                                    checked={form.ids_author.includes(author.id)}
                                    onCheckedChange={(checked) => {
                                        setForm(prev => ({
                                            ...prev,
                                            ids_author: checked
                                                ? [...prev.ids_author, author.id]
                                                : prev.ids_author.filter(id => id !== author.id)
                                        }))
                                    }}
                                />
                                <span>{author.name}</span>
                            </div>
                        ))}
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-1">
                <Label>Издатель</Label>
                <select
                    className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
                    value={form.id_publisher}
                    onChange={(e) => setForm({ ...form, id_publisher: Number(e.target.value) })}
                >
                    <option value={0}>Выберите издателя</option>
                    {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <Label>Жанры</Label>
                    <Button variant="outline" size="sm" onClick={() => setGenreModalOpen(true)}>+ Жанр</Button>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                            {form.ids_genre.length > 0
                                ? genres.filter(g => form.ids_genre.includes(g.id)).map(g => g.name).join(', ')
                                : "Выберите жанры"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 space-y-2 max-h-60 overflow-y-auto rounded-xl">
                        <AnimatePresence>
                            {genres.map(genre => (
                                <motion.div
                                    key={genre.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        checked={form.ids_genre.includes(genre.id)}
                                        onCheckedChange={(checked) => {
                                            setForm(prev => ({
                                                ...prev,
                                                ids_genre: checked
                                                    ? [...prev.ids_genre, genre.id]
                                                    : prev.ids_genre.filter(id => id !== genre.id)
                                            }))
                                        }}
                                    />
                                    <span>{genre.name}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Год</Label>
                    <Input name="year" type="number" value={form.year} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                    <Label>Количество</Label>
                    <Input name="count" type="number" value={form.count} onChange={handleChange} />
                </div>
            </div>
            <div className="space-y-1">
                <Label>ISBN</Label>
                <Input name="ISBN" value={form.ISBN} onChange={handleChange} />
            </div>

            <Button className="w-full text-lg font-semibold rounded-xl hover:scale-[1.02] transition-transform duration-200" onClick={handleSubmit}>
                Создать книгу
            </Button>
        </Card>

        <Dialog open={genreModalOpen} onOpenChange={setGenreModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Создать жанр</DialogTitle>
                </DialogHeader>
                <Input placeholder="Название жанра" value={newGenreName} onChange={(e) => setNewGenreName(e.target.value)} />
                <DialogFooter>
                    <Button onClick={handleCreateGenre}>Создать</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </motion.div>
    );
}