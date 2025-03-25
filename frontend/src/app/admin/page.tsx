"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Admin {
  id: number;
  name: string;
  email: string;
}

function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return null;
  }
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [selectedAction, setSelectedAction] = useState<{ title: string; id: string } | null>(null);
  const router = useRouter();

  const adminActions = [
    { title: "Книга", id: "book" },
    { title: "Автор", id: "author" },
    { title: "Издатель", id: "publisher" },
    { title: "Просмотр заказов", path: "/admin/orders" },
  ];

  const actionTasks = [
    { title: "Добавить", action: "add" },
    { title: "Редактировать", action: "put" },
    { title: "Удалить", action: "delete" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = token ? getRoleFromToken(token) : null;

    if (role !== "ADMIN") {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Токен отсутствует, перенаправление на главную");
      router.push("/");
      return;
    }
  
    axios.get("http://127.0.0.1:8000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then(response => {
        setAdmin(response.data);
      })
      .catch(error => {
        console.error("Ошибка загрузки данных админа:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken"); 
          router.push("/"); 
        }
      });
  }, []);

  if (isLoading || !admin) return <p className="text-center text-lg font-semibold mt-10">Загрузка...</p>;

  const handleActionClick = (action: { title: string; id: string } | { title: string; path: string }) => {
    if ("path" in action) {
      router.push(action.path);
    } else {
      setSelectedAction(action);
    }
  };

  const handleTaskClick = (taskAction: string, entityId: string) => {
    const path = `/admin/${taskAction}/${entityId}`;
    router.push(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center mb-6 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800">Админ Панель</h1>
          <Link href="/" className="text-indigo-600 hover:underline">
            Выйти
          </Link>
        </div>
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 mb-6 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{admin.name}</h3>
            <p className="text-gray-600">{admin.email}</p>
          </div>
        </motion.div>
        <AnimatePresence>
          {selectedAction === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {adminActions.map((action, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-indigo-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-indigo-600 transition-bg flex items-center justify-center"
                  onClick={() => handleActionClick(action)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-xl font-semibold">{action.title}</h3>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {actionTasks.map((task, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-green-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-600 transition-bg flex items-center justify-center"
                  onClick={() => handleTaskClick(task.action, selectedAction.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                </motion.div>
              ))}
              <motion.div
                className="p-6 bg-red-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-red-600 transition-all flex items-center justify-center"
                onClick={() => setSelectedAction(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="text-xl font-semibold">Назад</h3>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
