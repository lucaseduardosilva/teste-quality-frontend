# 📋 Cadastro de Clientes – Frontend (React.js)

Este projeto é a interface web para um sistema de cadastro de clientes, desenvolvido em **React.js**. A aplicação realiza operações CRUD e utiliza a **API ViaCEP** para preenchimento automático de endereço com base no CEP informado.

---

## 🚀 Tecnologias utilizadas

- [React.js 19](https://react.dev/)
- [Axios](https://axios-http.com/)

---

## 📦 Funcionalidades

- ✅ Listagem de clientes
- 🔍 Filtro por: `Código`, `Nome`, `Cidade`, `CEP`
- ➕ Inclusão de cliente
- 📝 Edição de cliente
- ❌ Exclusão de cliente
- 📬 Consulta ViaCEP automática ao digitar CEP

---

## 🧾 Campos do cliente

| Campo            | Tipo         |
| ---------------- | ------------ |
| ID               | bigint       |
| idUsuario        | bigint       |
| DataHoraCadastro | datetime     |
| Codigo           | varchar(15)  |
| Nome             | varchar(150) |
| CPF_CNPJ         | varchar(20)  |
| CEP              | integer      |
| Logradouro       | varchar(100) |
| Endereco         | varchar(120) |
| Numero           | varchar(20)  |
| Bairro           | varchar(50)  |
| Cidade           | varchar(60)  |
| UF               | varchar(2)   |
| Complemento      | varchar(150) |
| Fone             | varchar(15)  |
| LimiteCredito    | float        |
| Validade         | date         |

---

## 🌐 Integração com ViaCEP

Ao preencher o campo **CEP**, os seguintes dados são buscados na API pública:

- Logradouro
- Complemento
- Bairro
- Cidade (`localidade`)
- UF

---

## ▶️ Como executar o projeto

### 📥 1. Clone o repositório

```bash
git clone https://github.com/lucaseduardosilva/teste-quality-frontend
cd teste-quality-frontend
```

### 📦 2. Instale as dependências

```bash
npm install
```

### 🚀 3. Inicie o projeto

```bash
npm start
```

A API será iniciada em: http://localhost:3000
