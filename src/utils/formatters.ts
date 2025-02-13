export const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.slice(0, 8).replace(/(\d{5})(\d{3})/, "$1-$2");
}; 