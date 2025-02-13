"use client";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactModal } from "@/components/contacts/ContactModal";
import { useContacts } from "@/hooks/useContacts";
import * as Dialog from "@radix-ui/react-dialog";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface User {
  email: string;
  password: string;
}

export default function DashboardPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const { contacts, addContact, deleteContact, clearContacts } = useContacts();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log(
    "API Key disponível:",
    !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Verifica se é uma conta do Google
      const isGoogleAccount = session?.user?.email?.endsWith("@gmail.com");

      if (!isGoogleAccount) {
        // Lógica existente para contas locais
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

      // Limpa os dados independente do tipo de conta
      clearContacts();

      // Faz logout e redireciona
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

  return (
    <div className="min-h-screen bg-[#E5E6EB]">
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#161B24] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Olá, {session?.user?.name ?? "Usuário"}!
          </h1>
          <div className="flex items-center gap-4">
            <ContactModal onSave={addContact} />
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Excluir Conta
            </button>
            <button
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: "/login",
                })
              }
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ContactList contacts={contacts} onDelete={deleteContact} />
        </div>
      </main>

      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md overflow-y-auto rounded-lg bg-[#212936] p-6 shadow-xl transform -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-2xl font-semibold text-gray-100 mb-4 text-center">
              Excluir Conta
            </Dialog.Title>

            <p className="mb-6 text-md text-gray-100">
              {session?.user?.email?.endsWith("@gmail.com")
                ? "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos."
                : "Para excluir sua conta, por favor confirme sua senha. Esta ação não pode ser desfeita e todos os seus dados serão perdidos."}
            </p>

            {!session?.user?.email?.endsWith("@gmail.com") && (
              <div className="mb-6 text-black">
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-grey-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-400 border border-grey-500 rounded-md"
                  onClick={() => setPassword("")}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                onClick={handleDeleteAccount}
                disabled={
                  (!session?.user?.email?.endsWith("@gmail.com") &&
                    !password) ||
                  isLoading
                }
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Excluindo..." : "Confirmar Exclusão"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
