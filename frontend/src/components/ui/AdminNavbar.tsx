"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Book, User, Settings, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./AdminNavbar.module.css";

const adminActions = [
  { title: "Книги", path: "/admin/", icon: <Book size={24} /> },
  { title: "Авторы", path: "/admin/", icon: <User size={24} /> },
  { title: "Издатели", path: "/admin/", icon: <Settings size={24} /> },
  { title: "Заказы", path: "/admin/orders", icon: <ShoppingCart size={24} />, isOnlyView: true }, 
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

const submenuItems = [
  { action: "add", label: "Создать" },
  { action: "put", label: "Редактировать" },
  { action: "delete", label: "Удалить" },
];



export default function AdminNavbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const getEntityName = (title: string) => {
    switch (title) {
      case "Авторы":
        return "author";
      case "Книги":
        return "book";
      case "Издатели":
        return "publisher";
      case "Заказы":
        return "order";
      default:
        return "";
    }
  };

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
    const interval = setInterval(checkToken, 2000); 
    return () => clearInterval(interval);
  }, []);

  if (!isAdmin) {
    return null;
  }


  return (
    <motion.div
      className={`${styles.navbar} ${isHovered ? styles.navbarExpanded : styles.navbarCollapsed}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setOpenMenu(null);
      }}
    >
      <ul className="space-y-2 w-full">
        {adminActions.map((action) => (
          <li key={action.title} className="relative">
            <motion.div
              className={styles.menuItem}
              onClick={() => {
                if (!action.isOnlyView) {
                  setOpenMenu(openMenu === action.title ? null : action.title);
                } else {
                  router.push(action.path);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.iconWrapper}>{action.icon}</div>
              {isHovered && (
                <span className={styles.menuText}>
                  {action.title}
                  {!action.isOnlyView && (
                    <span className={styles.chevron}>
                      {openMenu === action.title ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  )}
                </span>
              )}
            </motion.div>
            {openMenu === action.title && isHovered && !action.isOnlyView && (
              <motion.ul
                className={styles.submenu}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {submenuItems.map((item) => (
                  <li
                    key={item.action}
                    className={styles.submenuItem}
                    onClick={() =>
                      router.push(`${action.path}/${item.action}/${getEntityName(action.title)}`)
                    }
                  >
                    {item.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
