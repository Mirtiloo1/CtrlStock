Controle de Inventário NFC (CtrlStock)

Sobre o Projeto

O CtrlStock é um protótipo de sistema de controle de estoque por
aproximação utilizando NFC (Near Field Communication) para monitorar a
movimentação de produtos em tempo real.

A proposta é oferecer uma solução de baixo custo para pequenos
almoxarifados e comércios, substituindo o controle manual por uma gestão
automatizada e eficiente.

O sistema integra um módulo IoT para leitura das etiquetas e uma
plataforma web/mobile para gerenciamento.

Funcionalidades Principais

-   Identificação por Aproximação: leitura instantânea do produto ao
    encostar a tag NFC no leitor.
-   Gestão de Inventário (CRUD): cadastro, edição, remoção e associação
    de etiquetas.
-   Histórico de Movimentações: registro cronológico de entradas e
    saídas.
-   Dashboard em Tempo Real: últimos itens lidos, total em estoque e
    movimentações do dia.
-   Autenticação: acesso seguro via login (JWT).
-   Exportação de Dados: geração de relatórios em CSV.

Arquitetura e Tecnologias

Hardware (IoT)

-   ESP32 – microcontrolador com Wi-Fi.
-   MFRC522 – leitor RFID/NFC.
-   Comunicação: envio dos UIDs via HTTP para a API.

Backend (API)

-   Node.js & Express
-   PostgreSQL
-   JWT & Bcrypt para autenticação e segurança.

Frontend (Mobile & Web)

-   React Native (Expo)
-   React.js
-   Axios para integração com a API.

Estrutura do Repositório

    /backend   → API e regras de negócio
    /mobile    → Aplicativo Android/iOS
    /web       → Dashboard Web

Pré-requisitos

-   Node.js 18+
-   PostgreSQL
-   Expo Go

## Como Rodar o Projeto

### 1. Configurar o Banco

Configure o PostgreSQL e crie o banco.  
Defina as variáveis de ambiente no arquivo `.env` dentro de `/backend`, incluindo `DATABASE_URL`.

### 2. Iniciar o Backend

```bash
cd backend
npm install
npm start
```

### 3. Iniciar o Mobile

```bash
cd mobile
npm install
npx expo start
```

### 4. Iniciar o Web

```bash
cd web
npm install
npm run dev
```


Equipe de Desenvolvimento

-   Jefferson Cabral Kotoski
-   Murilo Nunes Pimentel
