"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NextPage } from "next";
import axios from "axios";

interface AuthorForm {
  name: string;
  birth_date: string;
  death_date: string;
  bio: string;
}

const CreateAuthor: NextPage = () => {
  const [formData, setFormData] = useState<AuthorForm>({
    name: "",
    birth_date: "",
    death_date: "",
    bio: "",
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
      await axios.post("http://127.0.0.1:8000/api/authors", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      setFormData({ name: "", birth_date: "", death_date: "", bio: "" });
    } catch (error) {
      console.error("Ошибка при создании автора", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-100"
    >
      <Card className="w-96 p-4 shadow-lg bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Создать автора</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input name="name" placeholder="Имя автора" value={formData.name} onChange={handleChange} required />
            <Input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
            <Input type="date" name="death_date" value={formData.death_date} onChange={handleChange} />
            <Input name="bio" placeholder="Биография" value={formData.bio} onChange={handleChange} required />
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Создание..." : "Создать"}
              </Button>
            </motion.div>
          </form>
          {success && <p className="text-green-500 text-center mt-2">Автор успешно создан!</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreateAuthor;
