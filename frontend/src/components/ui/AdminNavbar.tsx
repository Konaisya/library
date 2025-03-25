"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Book, User, Settings, ShoppingCart } from "lucide-react"; 
import { useRouter } from "next/navigation";
import styles from "./AdminNavbar.module.css";

const adminActions = [
  { title: "Добавить книгу", path: "/admin/add-book", icon: <Book size={24} /> },
  { title: "Добавить автора", path: "/admin/add-author", icon: <User size={24} /> },
  { title: "Добавить издателя", path: "/admin/add-publisher", icon: <Settings size={24} /> },
  { title: "Просмотр заказов", path: "/admin/orders", icon: <ShoppingCart size={24} /> },
];

function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); 
    return payload.role || null; 
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return null;
  }
}

export default function AdminNavbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const role = getRoleFromToken(token);
        if (role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 4000); 
    return () => clearInterval(interval);
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <motion.div
      className={`${styles.navbar} ${isHovered ? styles.navbarExpanded : styles.navbarCollapsed}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ul className="space-y-4 w-full">
        {adminActions.map((action, index) => (
          <motion.li
            key={index}
            onClick={() => router.push(action.path)}
            className={styles.menuItem}
            whileHover={{ scale: 1.2 }} 
            whileTap={{ scale: 0.95 }} 
          >
            <div className={styles.iconWrapper}>
              {action.icon}
            </div>
            {isHovered && (
              <span className={styles.menuText}>
                {action.title}
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}