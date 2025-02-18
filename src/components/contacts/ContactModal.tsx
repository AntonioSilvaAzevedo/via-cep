"use client";
import { useContactForm } from "@/hooks/useContactForm";
import { Contact } from "@/hooks/useContacts";
import * as Dialog from "@radix-ui/react-dialog";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ContactForm } from "./ContactForm";

interface ContactModalProps {
  onSave: (contact: Omit<Contact, "id">) => Contact | null;
  editingContact?: Contact;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContactModal({
  onSave,
  editingContact,
  isOpen: controlledOpen,
  onOpenChange,
}: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const isOpen = controlledOpen ?? open;
  const handleOpenChange = onOpenChange ?? setOpen;
  const {
    formData,
    setFormData,
    resetForm,
    validateForm,
    handleCepChange,
    handleNumberChange,
    isLoadingCep,
  } = useContactForm();

  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        cpf: editingContact.cpf,
        phone: editingContact.phone,
        cep: editingContact.cep,
        street: editingContact.street,
        number: editingContact.number,
        complement: editingContact.complement,
        neighborhood: editingContact.neighborhood,
        city: editingContact.city,
        state: editingContact.state,
        latitude: editingContact.latitude,
        longitude: editingContact.longitude,
      });
    } else {
      resetForm();
    }
  }, [editingContact, setFormData, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm();

    if (isValid) {
      const result = onSave({
        ...formData,
        cpf: cpfValidator.strip(formData.cpf),
      });

      if (result) {
        handleOpenChange(false);
        resetForm();
        toast.success(
          `Contato ${editingContact ? "atualizado" : "salvo"} com sucesso!`
        );
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-2xl overflow-y-auto rounded-lg bg-[#212936] p-6 shadow-xl transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-2xl font-semibold text-gray-100 mb-6">
            {editingContact ? "Editar contato" : "Cadastrar novo contato"}
          </Dialog.Title>

          <ContactForm
            formData={formData}
            setFormData={setFormData}
            handleCepChange={handleCepChange}
            handleNumberChange={handleNumberChange}
            isLoadingCep={isLoadingCep}
            onSubmit={handleSubmit}
            onCancel={() => {
              handleOpenChange(false);
              resetForm();
            }}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
