"use client";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface Contact {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export function useContacts() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);

  
  const storageKey = session?.user?.email 
    ? `contacts_${session.user.email}` 
    : null;

  useEffect(() => {
    if (storageKey) {
      const storedContacts = localStorage.getItem(storageKey);
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    }
  }, [storageKey]);

  const addContact = (contact: Omit<Contact, "id">) => {
    if (!storageKey) return null;

    // Formatar CPF para comparação
    const formattedCpf = cpfValidator.strip(contact.cpf);
    
    // Verificar se já existe um contato com este CPF
    const cpfExists = contacts.some(
      existingContact => cpfValidator.strip(existingContact.cpf) === formattedCpf
    );

    if (cpfExists) {
      toast.error("Já existe um contato com este CPF");
      return null;
    }

    const newContact = {
      ...contact,
      id: crypto.randomUUID(),
      cpf: formattedCpf, // Salvar CPF sem formatação
    };
    
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    localStorage.setItem(storageKey, JSON.stringify(updatedContacts));
    return newContact;
  };

  const deleteContact = (id: string) => {
    if (!storageKey) return;

    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem(storageKey, JSON.stringify(updatedContacts));
  };

  const clearContacts = () => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
      setContacts([]);
    }
  };

  return {
    contacts,
    addContact,
    deleteContact,
    clearContacts,
  };
} 