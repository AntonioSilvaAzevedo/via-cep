"use client";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface User {
  email: string;
  password: string;
}

export function useAccountDeletion(clearContacts: () => void) {
  const { data: session } = useSession();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const isGoogleAccount = session?.user?.email?.endsWith("@gmail.com");

      if (!isGoogleAccount) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: User) => u.email === session?.user?.email);

        if (!user || user.password !== password) {
          toast.error("Senha incorreta");
          return;
        }

        localStorage.setItem(
          "users",
          JSON.stringify(
            users.filter((u: User) => u.email !== session?.user?.email)
          )
        );
      }

      clearContacts();
      
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error("Erro ao excluir conta");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDeleteAccount,
    isLoading,
    password,
    setPassword,
  };
} 