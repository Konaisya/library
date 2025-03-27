"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NextPage } from "next";
import axios from "axios";
import { API_URL } from "@/links/APIURL"; 
import { useAdminCheck } from "@/hooks/useAdminCheck"; 

interface AuthorForm {
  name: string;
  birth_date: string;
  death_date: string | null;
  bio: string;
}

const CreateAuthor: NextPage = () => {
  const isAdmin = useAdminCheck();
  const [formData, setFormData] = useState<AuthorForm>({
    name: "",
    birth_date: "",
    death_date: null,
    bio: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === "death_date" && value === "" ? null : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post(`${API_URL}authors/`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      setFormData({ name: "", birth_date: "", death_date: null, bio: "" });
    } catch (error) {
      console.error("Ошибка при создании автора", error);
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
          <CardTitle className="text-center text-xl font-semibold">Создать автора</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name">Имя автора</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="birth_date">Дата рождения</Label>
              <Input id="birth_date" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="death_date">Дата смерти (если есть)</Label>
              <Input id="death_date" type="date" name="death_date" value={formData.death_date || ""} onChange={handleChange} />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="bio">Биография</Label>
              <Input id="bio" name="bio" value={formData.bio} onChange={handleChange} required />
            </div>
            
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
