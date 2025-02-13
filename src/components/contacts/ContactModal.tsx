"use client";
import { useContactForm } from "@/hooks/useContactForm";
import { Contact } from "@/hooks/useContacts";
import * as Dialog from "@radix-ui/react-dialog";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useState } from "react";
import toast from "react-hot-toast";
import { ContactForm } from "./ContactForm";

interface ContactModalProps {
  onSave: (contact: Omit<Contact, "id">) => Contact | null;
}

export function ContactModal({ onSave }: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const {
    formData,
    setFormData,
    resetForm,
    validateForm,
    handleCepChange,
    handleNumberChange,
    isLoadingCep,
  } = useContactForm();

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    setOpen(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm();

    if (isValid) {
      const result = onSave({
        ...formData,
        cpf: cpfValidator.strip(formData.cpf),
      });

      if (result) {
        setOpen(false);
        resetForm();
        toast.success("Contato salvo com sucesso!");
      }
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-[#6C727F] text-white rounded hover:bg-[#555F6D] transition-colors font-bold">
          Novo Contato
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-2xl overflow-y-auto rounded-lg bg-[#212936] p-6 shadow-xl transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-2xl font-semibold text-gray-100 mb-6">
            Cadastrar novo contato
          </Dialog.Title>

          <ContactForm
            formData={formData}
            setFormData={setFormData}
            handleCepChange={handleCepChange}
            handleNumberChange={handleNumberChange}
            isLoadingCep={isLoadingCep}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
