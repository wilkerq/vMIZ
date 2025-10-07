# Painel de Controle vMix (Arquitetura Cliente-Servidor)

Esta aplicação foi reestruturada para uma arquitetura cliente-servidor padrão, com um frontend e um backend separados.

- **Backend:** Um servidor Node.js usando Express que gerencia todos os dados e a comunicação com as instâncias do vMix.
- **Frontend:** Uma aplicação React que fornece a interface do usuário.

Essa arquitetura permite o gerenciamento centralizado de dados, acesso multiusuário e é adequada para implantação em um servidor local (como um Servidor Ubuntu).

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.x ou mais recente recomendada)
- `npm` (geralmente incluído com o Node.js)

---

## Como Executar

Você precisa executar dois processos separados em dois terminais diferentes: um para o backend e outro para o frontend.

### 1. Execute o Servidor Backend

O servidor backend deve estar em execução para que o frontend funcione corretamente.

```bash
# Navegue até o diretório do backend
cd backend

# Instale as dependências (só precisa ser feito uma vez)
npm install

# Inicie o servidor backend em modo de desenvolvimento
# Ele irá monitorar as alterações nos arquivos e reiniciar automaticamente
npm run dev
```

O servidor backend será iniciado, normalmente em `http://localhost:3001`. Ele gerenciará todos os dados e conexões com o vMix.

### 2. Execute a Aplicação Frontend

```bash
# A partir da raiz do projeto, navegue até o diretório do frontend
cd frontend

# Instale as dependências (só precisa ser feito uma vez)
npm install

# Inicie o servidor de desenvolvimento do frontend
npm run dev
```

O servidor de desenvolvimento do frontend será iniciado, normalmente em `http://localhost:5173`, e abrirá automaticamente no seu navegador. O frontend fará chamadas de API para o servidor backend que está rodando na porta 3001.

---

## Estrutura do Projeto

- **/backend**: Contém o servidor Node.js Express.
  - `server.ts`: O ponto de entrada principal do servidor.
  - `api.ts`: Define todas as rotas da API (`/api/espelhos`, `/api/laudas`, etc.).
  - `db.ts`: Lida com a persistência dos dados usando um arquivo local `db.json`.
  - `package.json`: Dependências do backend.
- **/frontend**: Contém a interface do usuário em React.
  - Todos os componentes, páginas, contextos e serviços do React.
  - `services/`: Este diretório foi reescrito para fazer chamadas `fetch` para a API do backend em vez de usar `localStorage`.
- `README.md`: Este arquivo.
