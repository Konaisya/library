"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import styles from "./404.module.css";

const PageNotFound = () => {
  const router = useRouter();

  return (
    <motion.div
      className={styles.pageNotFound}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>404 - Страница не найдена</h1>
        <p className={styles.message}>Упс! Похоже, что страница, которую вы ищете, не существует.</p>
        <button className={styles.goHomeButton} onClick={() => router.push("/")}>
          <Home size={24} />
          Вернуться на главную
        </button>
      </div>
    </motion.div>
  );
};

export default PageNotFound;
