"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAdminCheck } from "@/hooks/useAdminCheck";
interface Order {
  id: number;
  user: {
    id: number;
    name: string;
    school_class: string | null;
    email: string;
  };
  book: {
    id: number;
    name: string;
    description: string;
    image: string;
    year: number;
    ISBN: string;
    count: number;
  };
  checkout_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  order_date: string;
}

const statusOptions = [
  { value: "PROCESSING", label: "🟡 В обработке" },
  { value: "READY_FOR_PICKUP", label: "📦 Готово к выдаче" },
  { value: "CHECKED_OUT", label: "📘 Выдано" },
  { value: "RETURNED", label: "✅ Возвращено" },
  { value: "CANCELLED", label: "❌ Отменено" },
  { value: "LOST", label: "⚠️ Потеряно" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = useAdminCheck();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios.get("http://127.0.0.1:8000/api/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem("authToken");

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      const response = await axios.get("http://127.0.0.1:8000/api/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
  
      setOrders(response.data);
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: orders.find(o => o.id === orderId)?.status || "PENDING" } : order
        )
      );
    }
  };
  if (isAdmin === null) return <p className="text-center text-lg font-semibold mt-10">Проверка прав доступа...</p>;
  if (loading) {
    return <p className="text-center text-lg font-semibold mt-10">Загрузка заказов...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">📚 Заказы</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <motion.div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={`http://127.0.0.1:8000/${order.book.image}`}
                  alt={order.book.name}
                  width={80}
                  height={120}
                  className="rounded-lg"
                />
                <div>
                  <h2 className="text-lg font-semibold">{order.book.name}</h2>
                  <p className="text-gray-600 text-sm">{order.book.year} г. • ISBN: {order.book.ISBN}</p>
                </div>
              </div>

              <div className="mt-4">
              <p className="text-sm text-gray-500">
                  <span className="font-semibold">📅 Дата заказа:</span> {order.order_date}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">📅 Дата выдачи:</span> {order.checkout_date}
                </p>
                <p className="text-sm text-gray-500">
                <span className="font-semibold">
                  {order.return_date ? "📅 Дата возврата:" : "⏳ Дата к которой книга должна быть возвращена:"}
                </span>{" "}
                {order.return_date ? order.return_date : order.due_date}
              </p>
                <label className="text-sm font-semibold block mt-2">✅ Статус:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="mt-1 w-full p-2 border rounded bg-gray-50"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 p-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold">👤 Пользователь:</p>
                <p className="text-gray-700">{order.user.name}</p>
                <p className="text-gray-500 text-xs">{order.user.email}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
