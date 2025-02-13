"use client";
import { useState } from "react";
import toast from "react-hot-toast";

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export function useCep() {
  const [isLoading, setIsLoading] = useState(false);

  const validateCep = async (cep: string): Promise<CepResponse | null> => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validateCep,
    isLoading,
  };
} 