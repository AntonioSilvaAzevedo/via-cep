"use client";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatCEP } from "../utils/formatters";
import { useCep } from "./useCep";

export interface ContactFormData {
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

const initialFormData: ContactFormData = {
  name: "",
  cpf: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  latitude: 0,
  longitude: 0,
};

async function getGeocoding(address: string) {
  try {
    // Chave da API do Google Maps
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      throw new Error('Chave da API do Google Maps não encontrada');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    console.log('Fazendo requisição para:', url.replace(apiKey, '***')); // Log seguro

    const response = await fetch(url);
    const data = await response.json();

    console.log('Status da resposta:', data.status);

    if (data.status === "OK" && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      console.log('Coordenadas obtidas:', { lat, lng });
      return { latitude: lat, longitude: lng };
    }

    // Se não encontrar o endereço específico, tenta buscar pelo CEP
    const cepOnly = address.match(/\d{5}-?\d{3}/)?.[0];
    if (cepOnly && data.status !== "OK") {
      const cepUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cepOnly}&key=${apiKey}`;
      const cepResponse = await fetch(cepUrl);
      const cepData = await cepResponse.json();

      if (cepData.status === "OK" && cepData.results[0]) {
        const { lat, lng } = cepData.results[0].geometry.location;
        console.log('Coordenadas obtidas pelo CEP:', { lat, lng });
        return { latitude: lat, longitude: lng };
      }
    }

    console.error('Erro na geocodificação:', data.status, data.error_message);
    return null;
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
}

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const { validateCep, isLoading: isLoadingCep } = useCep();

  const resetForm = () => setFormData(initialFormData);

  const validateForm = async (): Promise<boolean> => {
    const errors: string[] = [];
    const requiredFields: (keyof ContactFormData)[] = [
      "name", "cpf", "phone", "cep", "street",
      "number", "neighborhood", "city", "state",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors.push(`O campo ${field} é obrigatório`);
      }
    });

    if (formData.cpf && !cpfValidator.isValid(formData.cpf)) {
      errors.push("CPF inválido");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return false;
    }
    return true;
  };

  const updateCoordinates = async (address: string) => {
    console.log('Buscando coordenadas para:', address);
    const coordinates = await getGeocoding(address);
    console.log('Coordenadas encontradas:', coordinates);
    
    if (coordinates) {
      setFormData(prev => ({
        ...prev,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }));
    } else {
      // Coordenadas padrão para o centro de Curitiba como fallback
      setFormData(prev => ({
        ...prev,
        latitude: -25.4284,
        longitude: -49.2733,
      }));
      console.log('Usando coordenadas padrão de fallback');
    }
  };

  const handleCepChange = async (cep: string) => {
    const value = cep.replace(/\D/g, "");
    const formattedCEP = value.length <= 8 
      ? formatCEP(value) 
      : formData.cep;

    setFormData((prev) => ({ ...prev, cep: formattedCEP }));

    if (value.length === 8) {
      const cepData = await validateCep(value);
      if (cepData) {
        const newData = {
          ...formData,
          street: cepData.logradouro || formData.street,
          neighborhood: cepData.bairro || formData.neighborhood,
          city: cepData.localidade || formData.city,
          state: cepData.uf || formData.state,
        };
        setFormData(newData);

        const fullAddress = `${cepData.logradouro}, ${formData.number || 'S/N'}, ${cepData.bairro}, ${cepData.localidade}, ${cepData.uf}, ${value}`;
        await updateCoordinates(fullAddress);
      }
    }
  };

  const handleNumberChange = async (number: string) => {
    setFormData(prev => ({ ...prev, number }));

    if (number && formData.street && formData.city) {
      const fullAddress = `${formData.street}, ${number}, ${formData.neighborhood}, ${formData.city}, ${formData.state}, ${formData.cep}`;
      await updateCoordinates(fullAddress);
    }
  };

  return {
    formData,
    setFormData,
    resetForm,
    validateForm,
    handleCepChange,
    handleNumberChange,
    isLoadingCep,
  };
} 