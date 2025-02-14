"use client";
import { signOut } from "next-auth/react";
import { Contact } from "../../hooks/useContacts";
import { ContactModal } from "../contacts/ContactModal";

interface HeaderProps {
  userName: string;
  onAddContact: (contact: Omit<Contact, "id">) => Contact | null;
  onDeleteAccountClick: () => void;
}

export function Header({
  userName,
  onAddContact,
  onDeleteAccountClick,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#161B24] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          Olá, {userName ?? "Usuário"}!
        </h1>
        <div className="flex items-center gap-4">
          <ContactModal onSave={onAddContact} />
          <button
            onClick={onDeleteAccountClick}
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
  );
}
