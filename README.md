Controle de Inventário NFC (CtrlStock)

Trabalho de Conclusão de Curso apresentado à FATEC de Praia Grande como exigência para obtenção do título de Tecnólogo em Desenvolvimento de Software Multiplataforma.

Sobre o Projeto

O CtrlStock é um protótipo de Sistema de Controle de Estoque por Aproximação. Ele utiliza a tecnologia NFC (Near Field Communication) para monitorar e registrar a movimentação de produtos em tempo real. O objetivo é demonstrar uma solução de baixo custo para pequenos almoxarifados e comércios, substituindo o controle manual propenso a erros por uma gestão automatizada e eficiente.

O sistema integra um módulo de hardware (IoT) para leitura das etiquetas com uma plataforma web/mobile para gestão e visualização dos dados.

Funcionalidades Principais

Identificação por Aproximação: Reconhecimento imediato do produto ao aproximar a etiqueta do leitor.

Gestão de Inventário (CRUD): Cadastro, edição e remoção de produtos e associação de novas etiquetas (tags) via software.

Histórico de Movimentações: Registro cronológico de todas as entradas e saídas (leituras).

Dashboard em Tempo Real: Visualização do último item escaneado, total de itens em estoque e movimentações do dia.

Autenticação: Sistema de login seguro para acesso às funcionalidades administrativas.

Exportação de Dados: Capacidade de gerar relatórios (CSV) do histórico de movimentações.

Arquitetura e Tecnologias

O projeto utiliza uma arquitetura baseada em microsserviços e comunicação cliente-servidor, estruturada em um monorepo.

Hardware (IoT)

ESP32: Microcontrolador com conectividade Wi-Fi.

MFRC522: Módulo leitor de etiquetas RFID/NFC.

Comunicação: Envio de UIDs via requisições HTTP para a API.

Backend (API)

Node.js & Express: Servidor responsável pela lógica de negócios e endpoints REST.

PostgreSQL: Banco de dados relacional para persistência de produtos, usuários e histórico.

JWT & Bcrypt: Segurança e autenticação.

Frontend (Mobile & Web)

React Native (Expo): Aplicação móvel para gestão na palma da mão.

React.js: Interface web responsiva para administração em desktop.

Axios: Cliente HTTP para comunicação com o Backend.

Estrutura do Repositório

Este projeto segue a estrutura de monorepo:

/backend - Código fonte da API e regras de negócio.

/mobile - Código fonte do aplicativo Android/iOS.

/web - Código fonte da aplicação Web (Dashboard).

Pré-requisitos

Node.js (versão 18 ou superior)

PostgreSQL

Expo Go (para testar a versão mobile)

Como Rodar o Projeto

1. Configuração do Banco de Dados

Certifique-se de ter o PostgreSQL rodando e crie um banco de dados. Configure as variáveis de ambiente no arquivo .env dentro da pasta backend com a string de conexão (DATABASE_URL).

2. Executando o Backend

cd backend
npm install
npm start


O servidor iniciará na porta definida (padrão: 3000).

3. Executando a Aplicação Mobile

cd mobile
npm install
npx expo start


Utilize o aplicativo Expo Go no seu celular para escanear o QR Code gerado.

4. Executando a Aplicação Web

cd web
npm install
npm run dev


Acesse a aplicação através do navegador no endereço indicado (geralmente http://localhost:5173).

Equipe de Desenvolvimento

Jefferson Cabral Kotoski

Murilo Nunes Pimentel
