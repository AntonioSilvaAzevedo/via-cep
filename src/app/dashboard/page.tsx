"use client";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactModal } from "@/components/contacts/ContactModal";
import { DeleteAccountModal } from "@/components/dashboard/DeleteAccountModal";
import { Header } from "@/components/dashboard/Header";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";
import { Contact, useContacts } from "@/hooks/useContacts";
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

  const { contacts, addContact, deleteContact, clearContacts, updateContact } =
    useContacts();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { handleDeleteAccount, isLoading, password, setPassword } =
    useAccountDeletion(clearContacts);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(
    undefined
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const isGoogleAccount = session?.user?.email?.endsWith("@gmail.com") ?? false;

  console.log(
    "API Key disponível:",
    !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleSave = (contactData: Omit<Contact, "id">) => {
    if (editingContact) {
      const updatedContact = { ...contactData, id: editingContact.id };
      const result = updateContact(updatedContact);
      if (result) {
        setEditingContact(undefined);
      }
      return result;
    }
    return addContact(contactData);
  };

  return (
    <div className="min-h-screen bg-[#E5E6EB]">
      <Header
        userName={session?.user?.name ?? ""}
        onAddContact={handleSave}
        onDeleteAccountClick={() => setIsDeleteModalOpen(true)}
        onNewContact={() => setIsContactModalOpen(true)}
      />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ContactList
            contacts={contacts}
            onDelete={deleteContact}
            onEdit={handleEdit}
          />
        </div>
      </main>

      <ContactModal
        onSave={handleSave}
        editingContact={editingContact}
        isOpen={isContactModalOpen || !!editingContact}
        onOpenChange={(open) => {
          setIsContactModalOpen(open);
          if (!open) setEditingContact(undefined);
        }}
      />

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
