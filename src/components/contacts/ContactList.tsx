"use client";
import { Contact } from "@/hooks/useContacts";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpDown, MapPin, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ContactMap } from "./ContactMap";

interface ContactListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
}

type SortOrder = "asc" | "desc";
const ITEMS_PER_PAGE = 10;

export function ContactList({ contacts, onDelete }: ContactListProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filterBy, setFilterBy] = useState<"name" | "cpf">("name");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const listRef = useRef<HTMLDivElement>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const filteredAndSortedContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        const searchLower = searchTerm.toLowerCase();
        if (filterBy === "name") {
          return contact.name.toLowerCase().includes(searchLower);
        } else {
          return contact.cpf.includes(searchTerm);
        }
      })
      .sort((a, b) => {
        const compareValue =
          filterBy === "name"
            ? a.name.localeCompare(b.name)
            : a.cpf.localeCompare(b.cpf);
        return sortOrder === "asc" ? compareValue : -compareValue;
      });
  }, [contacts, searchTerm, sortOrder, filterBy]);

  const displayedContacts = useMemo(() => {
    return filteredAndSortedContacts.slice(0, visibleItems);
  }, [filteredAndSortedContacts, visibleItems]);

  const handleScroll = () => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const scrollPosition = scrollTop + clientHeight;

    if (scrollPosition >= scrollHeight * 0.8) {
      if (visibleItems < filteredAndSortedContacts.length) {
        setVisibleItems((prev) =>
          Math.min(prev + ITEMS_PER_PAGE, filteredAndSortedContacts.length)
        );
      }
    }
  };

  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchTerm, filterBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleOpenMap = (contact: Contact) => {
    console.log("Contato selecionado para mapa:", contact);
    console.log("Coordenadas:", {
      lat: contact.latitude,
      lng: contact.longitude,
    });
    setSelectedContact(contact);
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setSelectedContact(null);
    setIsMapOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mt-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Pesquisar por ${
              filterBy === "name" ? "nome" : "CPF"
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as "name" | "cpf")}
            className="px-4 py-2 border rounded-md bg-white text-black"
          >
            <option value="name">Nome</option>
            <option value="cpf">CPF</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="px-4 py-2 bg-[#6C727F] text-white rounded hover:bg-[#555F6D] transition-colors flex items-center gap-2"
          >
            <ArrowUpDown size={16} />
            {sortOrder === "asc" ? "Crescente" : "Decrescente"}
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-black">
        Contatos Salvos ({filteredAndSortedContacts.length})
      </h2>

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="grid gap-4 max-h-[600px] overflow-y-auto pr-2"
      >
        {displayedContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-black font-semibold"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{contact.name}</h3>
                <p className="font-medium text-gray-600">
                  {contact.street}, {contact.number}
                  {contact.complement && ` - ${contact.complement}`}
                </p>
                <p className="font-medium text-gray-600">
                  {contact.neighborhood}, {contact.city} - {contact.state}
                </p>
                <p className="font-medium text-gray-600">CEP: {contact.cep}</p>
                <p className="font-medium text-gray-600">
                  Telefone: {contact.phone}
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog.Root
                  open={isMapOpen && selectedContact?.id === contact.id}
                  onOpenChange={setIsMapOpen}
                >
                  <Dialog.Trigger asChild>
                    <button
                      onClick={() => handleOpenMap(contact)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MapPin size={20} />
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#212936] rounded-lg p-6 w-[90vw] max-w-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-bold ">
                          Localização de {contact.name}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={handleCloseMap}
                          >
                            <X size={20} />
                          </button>
                        </Dialog.Close>
                      </div>
                      {selectedContact && (
                        <ContactMap
                          latitude={selectedContact.latitude}
                          longitude={selectedContact.longitude}
                        />
                      )}
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
                <button
                  onClick={() => onDelete(contact.id)}
                  className="text-grey-200 hover:text-grey-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredAndSortedContacts.length === 0 && (
          <p className="text-center text-gray-500">
            {contacts.length === 0
              ? "Nenhum contato cadastrado ainda."
              : "Nenhum contato encontrado para a pesquisa."}
          </p>
        )}
        {visibleItems < filteredAndSortedContacts.length && (
          <div className="text-center py-4">
            <div className="animate-pulse text-gray-500">
              Carregando mais contatos...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
