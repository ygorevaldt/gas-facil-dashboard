# 🚀 Gas Fácil – Dashboard do Vendedor

Este é o Painel Administrativo do **Gas Fácil**, uma aplicação web onde vendedores podem **gerenciar seu catálogo de produtos**, **atualizar informações pessoais**, **configurar endereço de entrega** e **alterar sua senha de acesso**.

O dashboard foi desenvolvido com **React + Vite + TypeScript** e utiliza **Clean Architecture**, componentes do **shadcn/ui**, autenticação com **JWT** e integração direta com a API oficial do sistema Gas Fácil.

---

## 🖥️ Demonstração

### 🔐 Login

O usuário acessa com **e-mail e senha** cadastrados na plataforma.

### 🛒 Gerenciamento de Produtos

- **Criar** novos produtos
- **Editar** informações
- **Excluir** itens do catálogo
- Visualização **clara, organizada e responsiva**

### 👤 Área do Vendedor

- **Atualização de dados pessoais**
- Gerenciamento completo de **endereço** (rua, cidade, bairro, etc.)
- Opção para **alterar senha**

---

## 🧱 Tecnologias Utilizadas

### Frontend

| Categoria        | Tecnologia                                   |
| :--------------- | :------------------------------------------- |
| **Build Tool**   | ⚡ **Vite**                                  |
| **Biblioteca**   | ⚛️ **React**                                 |
| **Linguagem**    | 🧩 **TypeScript**                            |
| **Estilização**  | 🎨 **TailwindCSS**                           |
| **Componentes**  | 🧱 **shadcn/ui**                             |
| **Autenticação** | 🔐 **Context API** (Auth + Protected Routes) |
| **HTTP Client**  | 🔄 **Axios**                                 |
| **Rotas**        | 📦 **React Router DOM**                      |
| **Notificações** | 🔔 **Toast Notifications**                   |

### Arquitetura

**Clean Architecture** com:

- Camada de **contexts** (Context API)
- **Hooks** reutilizáveis
- **Componentização** organizada
- **Serviços** isolados para consumo da API

---

## 📚 Funcionalidades Detalhadas

### 🔐 Autenticação

- **Login com JWT** (JSON Web Tokens)
- Manutenção de sessão com `localStorage`
- **Rotas protegidas** (`ProtectedRoute`)

### 👤 Perfil do Vendedor

- Atualização de nome
- Atualização de telefone
- Visualização de e-mail
- Edição completa de endereço
- Ação de **Sair** (`logout`)
- Redirecionamento automático sem sessão

### 🛒 Gerenciamento de Produtos

- Listagem dos produtos cadastrados
- Criação de novos produtos
- Edição individual
- Exclusão com confirmação
- Interface amigável e responsiva

### 🛠️ Configurações

- **Alterar senha** diretamente pelo perfil
- Requisição segura via API

### 🔒 Segurança

- Tokens nunca são expostos diretamente no UI.
- Sessão é encerrada automaticamente se expirar.
- Axios configurado com interceptor de autenticação para gerenciar tokens.
- Rotas internas são protegidas (Protected Routes).

## 🧑‍💻 Autor

Desenvolvido por Ygor Evaldt

🔗 LinkedIn: https://www.linkedin.com/in/ygorevaldt/

🐙 GitHub: https://github.com/ygorevaldt

## � Instalação e Execução

Siga os passos abaixo para rodar o projeto localmente:

```bash
# Clone o repositório
git clone https://github.com/ygorevaldt/gas-facil-dashboard.git

# Acesse a pasta do projeto
cd gas-facil-dashboard

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

## �📜 Licença

Este projeto está sob a Licença MIT.
