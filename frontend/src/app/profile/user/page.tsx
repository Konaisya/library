"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      router.push("/"); 
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Добро пожаловать в профиль</h1>
    </div>
  );
}