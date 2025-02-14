"use client";
import { ContactList } from "@/components/contacts/ContactList";
import { DeleteAccountModal } from "@/components/dashboard/DeleteAccountModal";
import { Header } from "@/components/dashboard/Header";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";
import { useContacts } from "@/hooks/useContacts";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const { contacts, addContact, deleteContact, clearContacts } = useContacts();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { handleDeleteAccount, isLoading, password, setPassword } =
    useAccountDeletion(clearContacts);

  const isGoogleAccount = session?.user?.email?.endsWith("@gmail.com") ?? false;

  console.log(
    "API Key disponível:",
    !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );

  return (
    <div className="min-h-screen bg-[#E5E6EB]">
      <Header
        userName={session?.user?.name ?? ""}
        onAddContact={addContact}
        onDeleteAccountClick={() => setIsDeleteModalOpen(true)}
      />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ContactList contacts={contacts} onDelete={deleteContact} />
        </div>
      </main>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        isGoogleAccount={isGoogleAccount}
        password={password}
        onPasswordChange={setPassword}
        onConfirm={handleDeleteAccount}
        isLoading={isLoading}
      />
    </div>
  );
}
