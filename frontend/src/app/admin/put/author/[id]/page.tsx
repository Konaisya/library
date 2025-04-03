"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { API_URL, BASE_URL } from "@/links/APIURL";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { toast } from "sonner";

type Author = {
  name: string;
  image: string | null;
  birth_date: string;
  death_date: string | null;
  bio: string;
};

export default function EditAuthor() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const isAdmin = useAdminCheck();

  const [author, setAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<Author>({
    name: "",
    image: null,
    birth_date: "",
    death_date: null,
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  // Функция для загрузки данных автора
  const fetchAuthor = async () => {
    try {
      const response = await axios.get<Author>(`${API_URL}authors/${id}`);
      setAuthor(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Ошибка загрузки автора:", error);
      toast("Ошибка", { description: "Не удалось загрузить данные автора" });
    }
  };

  useEffect(() => {
    if (id) {
      fetchAuthor();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "death_date" && value === "" ? null : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.put(`${API_URL}authors/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      toast("Данные автора успешно обновлены");
      fetchAuthor(); // Автообновление данных после редактирования
    } catch (error) {
      toast("Ошибка", { description: "Не удалось обновить данные автора" });
      console.error("Ошибка обновления автора:", error);
    } finally {
      setLoading(false);
    }
  };

  // Обновление изображения
  const handleImageUpload = async () => {
    if (!imageFile || !id) return;

    // Проверка типа файла (разрешены только изображения)
    if (!imageFile.type.startsWith("image/")) {
      toast("Ошибка", { description: "Можно загружать только изображения!" });
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      await axios.patch(`${API_URL}authors/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      toast("Изображение обновлено");

      // Обновляем данные автора, чтобы изображение сразу отобразилось
      fetchAuthor();
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
      toast("Ошибка", { description: "Не удалось загрузить изображение" });
    }
  };

  if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;
  if (!author) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-center mb-4">✏️ Редактировать автора</h1>
      
      {author.image && (
        <div className="flex justify-center mb-4">
          <Image src={`${BASE_URL}${author.image}`} alt={author.name} width={120} height={120} className="rounded-full" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Имя</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div>
          <Label htmlFor="birth_date">Дата рождения</Label>
          <Input id="birth_date" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="death_date">Дата смерти (если есть)</Label>
          <Input id="death_date" type="date" name="death_date" value={formData.death_date || ""} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="bio">Биография</Label>
          <Input id="bio" name="bio" value={formData.bio} onChange={handleChange} required />
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </motion.div>
      </form>

      <hr className="my-4" />

      <div>
        <Label>Изменить изображение</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleImageUpload} className="w-full mt-2" disabled={!imageFile}>
            Загрузить новое изображение
          </Button>
        </motion.div>
      </div>

      {success && <p className="text-green-500 text-center mt-2">Изменения сохранены!</p>}
    </motion.div>
  );
}
