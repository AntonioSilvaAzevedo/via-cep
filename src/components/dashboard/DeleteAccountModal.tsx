"use client";
import * as Dialog from "@radix-ui/react-dialog";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isGoogleAccount: boolean;
  password: string;
  onPasswordChange: (password: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteAccountModal({
  isOpen,
  onOpenChange,
  isGoogleAccount,
  password,
  onPasswordChange,
  onConfirm,
  isLoading,
}: DeleteAccountModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md overflow-y-auto rounded-lg bg-[#212936] p-6 shadow-xl transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-2xl font-semibold text-gray-100 mb-4 text-center">
            Excluir Conta
          </Dialog.Title>

          <p className="mb-6 text-md text-gray-100">
            {isGoogleAccount
              ? "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos."
              : "Para excluir sua conta, por favor confirme sua senha. Esta ação não pode ser desfeita e todos os seus dados serão perdidos."}
          </p>

          {!isGoogleAccount && (
            <div className="mb-6 text-black">
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-grey-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-400 border border-grey-500 rounded-md"
                onClick={() => onPasswordChange("")}
              >
                Cancelar
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              disabled={(!isGoogleAccount && !password) || isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Excluindo..." : "Confirmar Exclusão"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
