import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return null;
  }
}

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = token ? getRoleFromToken(token) : null;

    if (role !== "ADMIN") {
      router.push("/404");
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  return isAdmin;
}
