import { ContactFormData } from "@/hooks/useContactForm";
import { formatCPF } from "@/utils/formatters";
import * as Dialog from "@radix-ui/react-dialog";

interface ContactFormProps {
  formData: ContactFormData;
  setFormData: (data: ContactFormData) => void;
  handleCepChange: (cep: string) => void;
  handleNumberChange: (number: string) => void;
  isLoadingCep: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ContactForm({
  formData,
  setFormData,
  handleCepChange,
  handleNumberChange,
  isLoadingCep,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formattedCPF });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nome"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="CPF (000.000.000-00)"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.cpf}
          onChange={handleCPFChange}
          maxLength={14}
        />
        <input
          type="text"
          placeholder="Telefone"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="CEP (00000-000)"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black disabled:opacity-50"
          value={formData.cep}
          onChange={(e) => handleCepChange(e.target.value)}
          maxLength={9}
          disabled={isLoadingCep}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Rua"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          readOnly={isLoadingCep}
        />
        <input
          type="text"
          placeholder="Número"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.number}
          onChange={(e) => {
            if (handleNumberChange) {
              handleNumberChange(e.target.value);
            } else {
              setFormData({ ...formData, number: e.target.value });
            }
          }}
        />
        <input
          type="text"
          placeholder="Complemento"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.complement}
          onChange={(e) =>
            setFormData({ ...formData, complement: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Bairro"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.neighborhood}
          onChange={(e) =>
            setFormData({ ...formData, neighborhood: e.target.value })
          }
          readOnly={isLoadingCep}
        />
        <input
          type="text"
          placeholder="Cidade"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          readOnly={isLoadingCep}
        />
        <input
          type="text"
          placeholder="Estado"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-[#2B9EF1] bg-[#F4F4F6] text-black"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          readOnly={isLoadingCep}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Dialog.Close asChild>
          <button
            type="button"
            className="px-5 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </Dialog.Close>
        <button
          type="submit"
          className="px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
