"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  checkout_date: string | null;
  due_date: string;
  order_date: string;
  return_date: string | null;
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const router = useRouter();

  const formatDate = (date: string | null) => {
    if (!date) return "Не указано";
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? "Некорректная дата" : parsedDate.toLocaleDateString();
  };

  const handleOpenDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrderId) return;
    const token = localStorage.getItem("authToken");

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${selectedOrderId}`,
        { status: "CANCELLED" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "CANCELLED" } : order
        )
      );

      toast.success("Заказ отменен");
    } catch (error) {
      toast.error("Ошибка при отмене заказа");
      console.error("Ошибка отмены заказа:", error);
    } finally {
      setOpenDialog(false);
      setSelectedOrderId(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get("http://127.0.0.1:8000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки пользователя:", error);
        router.push("/");
      });
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`http://127.0.0.1:8000/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки заказов:", error);
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
              const isCancellable = !["CANCELLED", "RETURNED", "LOST", "CHECKED_OUT"].includes(order.status);

              return (
                <motion.div
                  key={order.id}
                  className={`relative p-6 text-white rounded-lg shadow-md cursor-pointer ${status?.color} transition-bg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {isCancellable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(order.id);
                      }}
                      className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full shadow-md transition"


                      title="Отменить заказ"
                    >
                      <X className="w-5 h-5 stroke-red-500" />
                    </button>
                  )}
                  <h3 className="text-lg font-semibold">
                    <strong>Название книги:</strong> {order.book.name}
                  </h3>
                  <p className="text-sm">{status?.label}</p>
                  <p className="text-sm text-gray-200">Дата заказа: {formatDate(order.order_date)}</p>
                  <p className="text-sm text-gray-200">
                    Дата выдачи книги: {formatDate(order.checkout_date)}
                  </p>
                  <p className="text-sm text-gray-200">
                    Вернуть до: {formatDate(order.due_date)}
                  </p>
                  <p className="text-sm text-gray-200">
                    Дата возврата: {formatDate(order.return_date)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вы уверены, что хотите отменить заказ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">
            Это действие отменит заказ. Его нельзя будет восстановить.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmCancelOrder}>
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
