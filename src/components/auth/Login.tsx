"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  password: string;
}

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

        if (users.some((user) => user.email === email)) {
          toast.error("Email já cadastrado");
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          email,
          password,
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        toast.success("Cadastro realizado com sucesso!");
        setIsRegister(false);
      } else {
        const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          toast.error("Email ou senha inválidos");
          return;
        }

        const result = await signIn("credentials", {
          email,
          password,
          userData: JSON.stringify(user),
          redirect: false,
        });

        if (result?.error) {
          toast.error("Erro ao fazer login");
          return;
        }

        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">
        {isRegister ? "Criar conta" : "Acessar conta"}
      </h1>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#6C727F] text-white  hover:bg-[#555F6D] rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? "Carregando..." : isRegister ? "Cadastrar" : "Entrar"}
        </button>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-sm text-blue-600 hover:underline"
        >
          {isRegister
            ? "Já tem uma conta? Entre"
            : "Não tem uma conta? Cadastre-se"}
        </button>
      </form>

      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
        </svg>
        <span>Continuar com Google</span>
      </button>
    </div>
  );
}
