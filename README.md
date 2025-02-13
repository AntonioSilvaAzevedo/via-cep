# VIA CEP - Gerenciador de Contatos

Uma aplicação web para gerenciar contatos com integração ao serviço ViaCEP e Google Maps.

## Funcionalidades

- 🔐 Autenticação de usuários (local e Google)
- 📝 Cadastro e gerenciamento de contatos
- 🗺️ Visualização de endereços no mapa
- 🔍 Busca e filtragem de contatos
- 📱 Interface responsiva
- 🏷️ Ordenação por nome ou CPF

## Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/) 
- [TypeScript](https://www.typescriptlang.org/) 
- [Tailwind CSS](https://tailwindcss.com/) 
- [NextAuth.js](https://next-auth.js.org/) 
- [Google Maps API](https://developers.google.com/maps) 
- [ViaCEP API](https://viacep.com.br/) 
- [Radix UI](https://www.radix-ui.com/) 
- [React Hot Toast](https://react-hot-toast.com/) 

## Configuração

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/via-cep.git
cd via-cep
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente (.env.local)
```plaintext
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
NEXTAUTH_SECRET=sua_chave_secreta
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Funcionalidades Principais

- **Autenticação**: Login com email/senha ou conta Google
- **Gerenciamento de Contatos**: Adicione, edite e remova contatos
- **Busca de CEP**: Preenchimento automático de endereço
- **Visualização no Mapa**: Veja a localização dos contatos no Google Maps
- **Filtragem**: Busque contatos por nome ou CPF
- **Ordenação**: Organize os contatos em ordem crescente ou decrescente


## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
