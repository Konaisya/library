"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;
  book: {
    name: string;
  };
  status: string;
  created_at: string;
}

const statusOptions = [
  { value: "PENDING", label: "🟠 Ожидание обработки", color: "bg-orange-500" },
  { value: "PROCESSING", label: "🟡 В обработке", color: "bg-yellow-500" },
  { value: "READY_FOR_PICKUP", label: "📦 Готово к выдаче", color: "bg-blue-500" },
  { value: "CHECKED_OUT", label: "📘 Выдано", color: "bg-green-500" },
  { value: "RETURNED", label: "✅ Возвращено", color: "bg-gray-500" },
  { value: "CANCELLED", label: "❌ Отменено", color: "bg-red-500" },
  { value: "LOST", label: "⚠️ Потеряно", color: "bg-pink-500" },
];

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get("http://127.0.0.1:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.log("Ошибка загрузки пользователя:", error);
        router.push("/");
      });
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get(`http://127.0.0.1:8000/api/orders/`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log("Ошибка загрузки заказов:", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    router.push("/auth/signIn");
  };

  if (loading) {
    return <p className="text-center text-lg font-semibold mt-10">Загрузка...</p>;
  }

  if (!user) {
    return <p className="text-center text-lg font-semibold mt-10">Пользователь не найден</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="flex flex-col items-center p-6">
        <div className="flex justify-between items-center mb-6 w-full max-w-4xl">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Выйти
          </button>
        </div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 mb-6 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </motion.div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ваши заказы</h2>

        {orders.length === 0 ? (
          <p className="text-center text-lg font-semibold mt-10">У вас нет заказов.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {orders.map((order) => {
              const status = statusOptions.find((option) => option.value === order.status);
              return (
                <motion.div
                  key={order.id}
                  className={`p-6 text-white rounded-lg shadow-md cursor-pointer ${status?.color} transition-bg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-lg font-semibold">{order.book.name}</h3>
                  <p className="text-sm">{status?.label}</p>
                  <p className="text-sm text-gray-200">Дата заказа: {new Date(order.created_at).toLocaleDateString()}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
