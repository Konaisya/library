"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { email, password } = formData;

//   const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
  
    console.log("Отправляемые данные:", Object.fromEntries(formData.entries()));
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login",
        formData, 
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
  
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem("authToken", token);
        console.log("Токен сохранён:", token);
        // router.push("/");
      }
    } catch (err: any) {
      console.error("Ошибка входа:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Ошибка входа.");
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Вход</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Войти
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Нет аккаунта?{" "}
          <Link href="/auth/signUp" className="text-indigo-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
