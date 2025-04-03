"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { API_URL, BASE_URL } from "@/links/APIURL";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { toast } from "sonner";
type Publisher = {
  id: number;
  name: string;
  image: string | null;
  description: string;
  foundation_year: number;
};

export default function PublisherPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Publisher>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const isAdmin = useAdminCheck();

  useEffect(() => {
    if (id) {
      axios
        .get<{ status: string; new_publisher: Publisher }>(`${API_URL}publishers/${id}`)
        .then((response) => {
          if (response.data.status === "SUCCESS") {
            setPublisher(response.data.new_publisher);
            setFormData(response.data.new_publisher);
          } else {
            console.error("Ошибка получения данных издателя");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Ошибка загрузки издателя:", error);
          setLoading(false);
        });
    }
  }, [id, success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdatePublisher = async () => {
    if (!id) return;
    try {
      await axios.put(`${API_URL}publishers/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      toast("Данные издателя успешно обновлены");
    } catch (error) {
      console.error("Ошибка обновления данных издателя:", error);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !id) return;
  
    if (!imageFile.type.startsWith("image/")) {
      toast("Ошибка", { description: "Можно загружать только изображения." });
      return;
    }
  
    const formData = new FormData();
    formData.append("image", imageFile);
  
    try {
      await axios.patch(`${API_URL}publishers/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSuccess((prev) => !prev); 
      toast("Изображение успешно обновлено");
    } catch (error) {
      toast("Ошибка", { description: "Не удалось обновить изображение" });
    }
  };

  if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;

  if (loading) {
    return <p className="text-center mt-10 text-lg font-semibold">Загрузка...</p>;
  }

  if (!publisher) {
    return <p className="text-center mt-10 text-lg font-semibold text-red-500">Издатель не найден!</p>;
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {publisher.image && (
          <Image
            src={`${BASE_URL}${publisher.image}`}
            alt={publisher.name}
            width={600}
            height={300}
            objectFit="cover"
            className="w-300 h-88 mx-auto rounded-lg object-cover mb-4"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-800">{publisher.name}</h1>
        <p className="text-gray-600 mt-2">Основано в {publisher.foundation_year} году</p>
        <motion.p
          className="mt-4 text-gray-700 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {publisher.description}
        </motion.p>
      </motion.div>

      <div className="mt-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Редактировать издателя</h2>
        <div className="space-y-4">
          <div>
            <Input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Название"
              className="w-full"
            />
          </div>
          <div>
            <Input
              name="foundation_year"
              type="number"
              value={formData.foundation_year || ""}
              onChange={handleChange}
              placeholder="Год основания"
              className="w-full"
            />
          </div>
          <div>
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Описание"
              className="w-full"
            />
          </div>

          <Button
            onClick={handleUpdatePublisher}
            className="mt-4 w-full"
          >
            Сохранить изменения
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Обновить изображение</h2>
        <div>
          <Input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleImageUpload}
          className="mt-4 w-full"
        >
          Загрузить новое изображение
        </Button>
      </div>

      {success && <p className="text-green-500 text-center mt-4">Издатель обновлен!</p>}
    </motion.div>
  );
}
