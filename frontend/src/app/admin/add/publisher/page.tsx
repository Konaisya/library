"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NextPage } from "next";
import axios from "axios";
import { useAdminCheck } from "@/hooks/useAdminCheck";
interface PublisherForm {
  name: string;
  description: string;
  foundation_year: number;
}

const CreatePublisher: NextPage = () => {
  const isAdmin = useAdminCheck();
  const [formData, setFormData] = useState<PublisherForm>({
    name: "",
    description: "",
    foundation_year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      await axios.post("http://127.0.0.1:8000/api/publishers", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      setFormData({ name: "", description: "", foundation_year: new Date().getFullYear() });
    } catch (error) {
      console.error("Ошибка при создании издателя", error);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-100"
    >
      <Card className="w-96 p-4 shadow-lg bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Создать издателя</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input name="name" placeholder="Название издательства" value={formData.name} onChange={handleChange} required />
            <Input name="description" placeholder="Описание" value={formData.description} onChange={handleChange} required />
            <Input type="number" name="foundation_year" placeholder="Год основания" value={formData.foundation_year} onChange={handleChange} required />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Создание..." : "Создать"}
              </Button>
            </motion.div>
          </form>
          {success && <p className="text-green-500 text-center mt-2">Издатель успешно создан!</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreatePublisher;
