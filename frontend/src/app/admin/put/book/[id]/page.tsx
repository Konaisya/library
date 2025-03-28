"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation"; 
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

export default function EditBookPage() {
    const [form, setForm] = useState<any>({
        name: "",
        description: "",
        image: null,
        ids_author: [],
        ids_genre: [],
        id_publisher: 0,
        year: 0,
        ISBN: "",
        count: 0,
    });
    const [authors, setAuthors] = useState<any[]>([]);
    const [publishers, setPublishers] = useState<any[]>([]);
    const [genres, setGenres] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);  
    const pathname = usePathname();
    const id = pathname.split("/").pop();

    useEffect(() => {
        if (id) {
            fetchBook(id);
            fetchOtherData();
        }
    }, [id]);

    const fetchBook = async (id: string) => {
        setLoading(true);  
        try {
            const { data } = await axios.get(`http://127.0.0.1:8000/api/books/${id}/`);
            setForm(data);
        } catch (error) {
            toast("Ошибка", { description: "Не удалось загрузить книгу" });
        } finally {
            setLoading(false); 
        }
    };

    const fetchOtherData = async () => {
        try {
            const authorsData = await axios.get("http://127.0.0.1:8000/api/authors/");
            setAuthors(authorsData.data);

            const publishersData = await axios.get("http://127.0.0.1:8000/api/publishers/");
            setPublishers(publishersData.data);

            const genresData = await axios.get("http://127.0.0.1:8000/api/genres/");
            setGenres(genresData.data);
        } catch (error) {
            toast("Ошибка", { description: "Не удалось загрузить дополнительные данные" });
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = { ...form, year: Number(form.year), count: Number(form.count) };
            await axios.put(`http://127.0.0.1:8000/api/books/${id}`, payload);
            toast("Книга успешно обновлена");
        } catch (error) {
            toast("Ошибка", { description: "Не удалось обновить книгу" });
        }
    };

    const handleImageSubmit = async () => {
        if (form.image) {
            const formData = new FormData();
            formData.append("image", form.image);

            try {
                await axios.patch(`http://127.0.0.1:8000/api/books/${id}/image`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast("Изображение успешно обновлено");
            } catch (error) {
                toast("Ошибка", { description: "Не удалось обновить изображение" });
            }
        } else {
            toast("Ошибка", { description: "Выберите изображение для загрузки" });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setForm({ ...form, image: file });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Image  width={150} height={150} src="/gif/loading.gif" alt="Loading..." /> 
            </div>
        );
    }

    return (
        <motion.div
        className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h1 className="text-3xl font-bold">Редактировать книгу</h1>

        <div className="space-y-4">
            <div className="space-y-1">
                <label>Название</label>
                <Input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="space-y-1">
                <label>Описание</label>
                <Textarea name="description" value={form.description} onChange={handleChange} />
            </div>
            <div className="space-y-1">
                <label>Год</label>
                <Input type="number" name="year" value={form.year} onChange={handleChange} />
            </div>
            <div className="space-y-1">
                <label>Количество</label>
                <Input type="number" name="count" value={form.count} onChange={handleChange} />
            </div>
            <div className="space-y-1">
                <label>ISBN</label>
                <Input name="ISBN" value={form.ISBN} onChange={handleChange} />
            </div>

            <div className="space-y-1">
                <label>Изображение</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border p-2 rounded"
                />
                {form.image && form.image instanceof File && (
                    <div className="mt-2">
                        <img
                            src={URL.createObjectURL(form.image)}
                            alt="Preview"
                            className="max-w-[400px] h-auto"
                        />
                    </div>
                )}
                <Button onClick={handleImageSubmit} className="mt-4">
                    Обновить изображение
                </Button>
            </div>

            <div className="space-y-1">
                <label>Издатель</label>
                <select
                    name="id_publisher"
                    value={form.id_publisher}
                    onChange={handleSelectChange}
                    className="w-full border p-2 rounded"
                >
                    {publishers.map((publisher) => (
                        <option key={publisher.id} value={publisher.id}>
                            {publisher.name}
                        </option>
                    ))}
                </select>
            </div>

            <Button onClick={handleSubmit}>Сохранить изменения</Button>
        </div>
    </motion.div>
    );
}
