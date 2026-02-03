# 🦷 App de Orçamentos – Clínica Dentária

Este documento descreve os requisitos e a estrutura técnica para o desenvolvimento de um aplicativo web focado na gestão de orçamentos para uma clínica dentária.

## 📌 Objetivo do Projeto

Desenvolver um aplicativo web robusto e intuitivo que permita a uma **funcionária autorizada** da clínica dentária gerenciar o processo de orçamentação de forma eficiente. O sistema deve otimizar a criação, negociação e acompanhamento de orçamentos odontológicos, visando aumentar a taxa de conversão de pacientes.

## ✨ Funcionalidades Principais

A funcionária autorizada deverá ser capaz de:

*   **Autenticação Segura**: Realizar login utilizando usuário e senha.
*   **Gestão de Pacientes**: Cadastrar e manter um registro completo de pacientes (futuros clientes).
*   **Criação e Edição de Orçamentos**: Gerar novos orçamentos odontológicos com múltiplos itens e editá-los conforme a necessidade.
*   **Negociação de Orçamentos**: Acompanhar e registrar o processo de negociação de cada orçamento.
*   **Status de Negociação**: Atualizar o status dos orçamentos (ex: em aberto, aceito, recusado).
*   **Observações Detalhadas**: Adicionar observações relevantes durante o processo de negociação.
*   **Histórico por Paciente**: Manter um histórico completo de todos os orçamentos associados a cada paciente.
*   **Geração de Relatórios**: Exportar dados de orçamentos e pacientes em formatos padronizados, incluindo planilhas Excel estilizadas.

## 🧱 Stack Tecnológica

### Frontend

*   **Framework**: Svelte
*   **Estilização**: Tailwind CSS
*   **Gerenciamento de Estado**: Stores do Svelte
*   **Consumo de API**: Fetch API
*   **Validação de Formulários**: Lógica nativa com foco em boas práticas de UX.

### Backend

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Autenticação**: JWT (JSON Web Token)
*   **Criptografia**: bcrypt para senhas.
*   **Arquitetura**: MVC (Model-View-Controller) com camada de Services.
*   **Validação**: Middleware utilizando `express-validator`.
*   **Geração de Excel**: Considerar bibliotecas como `exceljs` ou `node-xlsx` para a criação de planilhas estilizadas.

### Banco de Dados

*   **Sistema**: MySQL
*   **ORM Recomendado**: Prisma ou Sequelize

## 🔐 Requisitos de Autenticação

Para garantir a segurança do sistema, os seguintes requisitos de autenticação devem ser implementados:

*   Login baseado em **email e senha**.
*   Armazenamento de senhas criptografadas utilizando **bcrypt**.
*   Utilização de **JWT (JSON Web Token)** para controle de sessão, com expiração definida.
*   Implementação de **middleware de proteção de rotas** para acesso restrito.
*   **Controle de acesso baseado em perfil** (ex: `funcionária`, `admin`).

## 🗂️ Estrutura de Pastas

A organização dos arquivos e diretórios seguirá a seguinte estrutura:

```txt
backend/
│── src/
│   ├── controllers/    # Lógica de controle das requisições
│   ├── services/       # Regras de negócio e lógica de serviço
│   ├── models/         # Definição dos modelos de dados e interação com o DB
│   ├── routes/         # Definição das rotas da API
│   ├── middlewares/    # Funções middleware para processamento de requisições
│   ├── validators/     # Lógica de validação de dados de entrada
│   ├── config/         # Configurações da aplicação
│   └── app.js          # Configuração principal do Express
│── server.js           # Ponto de entrada do servidor
│── .env                # Variáveis de ambiente

frontend/
│── src/
│   ├── components/     # Componentes reutilizáveis do Svelte
│   ├── pages/          # Páginas da aplicação
│   ├── stores/         # Gerenciamento de estado global do Svelte
│   ├── services/       # Funções para consumo da API
│   ├── routes/         # Definição das rotas do frontend
│   └── app.css         # Estilos globais da aplicação
│── tailwind.config.js  # Configuração do Tailwind CSS
```

## 🗄️ Esquema do Banco de Dados

As tabelas do banco de dados serão estruturadas da seguinte forma:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM(\'admin\', \'funcionaria\') DEFAULT \'funcionaria\',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    user_id INT NOT NULL,
    total_value DECIMAL(10,2) NOT NULL,
    status ENUM(\'em_negociacao\', \'aceito\', \'recusado\') DEFAULT \'em_negociacao\',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE budget_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budgets(id)
);
```

## 🔄 Fluxo do Sistema

O fluxo de interação principal com o sistema será:

1.  **Funcionária faz login** no sistema.
2.  **Cadastra ou seleciona paciente** existente.
3.  **Cria orçamento** detalhado com múltiplos itens.
4.  **Registra observações** pertinentes à negociação.
5.  **Atualiza o status** do orçamento conforme o andamento da negociação.
6.  **Histórico** de todos os orçamentos é mantido e acessível no sistema.

## 📊 Relatórios e Exportação de Dados

O sistema deverá permitir a geração de relatórios detalhados com a capacidade de exportação para planilhas Excel, seguindo os seguintes requisitos:

*   **Dados Exportáveis**: Orçamentos (com seus itens), informações de pacientes e status de negociação.
*   **Formato**: As exportações devem ser realizadas no formato `.xlsx`.
*   **Estilização Profissional**: As planilhas Excel devem apresentar:
    *   **Cabeçalhos Claros**: Títulos de colunas formatados (negrito, cor de fundo).
    *   **Cores e Fontes**: Utilização de uma paleta de cores consistente e fontes legíveis para melhorar a apresentação.
    *   **Bordas e Alinhamento**: Aplicação de bordas para delimitar células e alinhamento adequado do texto.
    *   **Formatação Condicional**: Opcional, para destacar status de orçamentos (ex: aceito em verde, recusado em vermelho).
*   **Organização de Dados**: As planilhas devem ser organizadas de forma intuitiva, podendo incluir:
    *   **Múltiplas Abas**: Separar dados por tipo (ex: uma aba para 
pacientes, outra para orçamentos).
    *   **Agrupamento de Dados**: Agrupar orçamentos por paciente ou por status.
*   **Filtros e Ordenação**: As planilhas devem ser geradas de forma que permitam fácil aplicação de filtros e ordenação no Excel.

## 🎨 Boas Práticas de UI/UX

Para garantir uma experiência de usuário agradável e eficiente:

*   **Layout Responsivo**: Design **mobile-first** para adaptabilidade em diferentes dispositivos.
*   **Feedback Visual**: Indicadores claros de carregamento, sucesso e erro.
*   **Modais Intuitivos**: Utilização de modais para criação e edição de dados, otimizando o fluxo.
*   **Tabelas Claras**: Apresentação de dados em tabelas com funcionalidades de filtragem e ordenação.
*   **Estilo Profissional**: Cores neutras e design limpo, adequado ao ambiente de uma clínica.

## 🛡️ Boas Práticas de Desenvolvimento

*   **Separação de Responsabilidades**: Código modular e organizado.
*   **Variáveis de Ambiente**: Gerenciamento de informações sensíveis através de arquivos `.env`.
*   **Tratamento Global de Erros**: Mecanismos robustos para lidar com exceções e erros.
*   **Código Limpo e Documentado**: Manutenção de um código legível e com comentários quando necessário.
*   **Componentes Reutilizáveis**: Desenvolvimento de componentes Svelte que possam ser facilmente reusados.

## 🚀 Funcionalidades Futuras (Opcional)

*   Envio de orçamentos por WhatsApp ou Email.
*   Exportação de orçamentos em formato PDF.
*   Dashboard com métricas e relatórios de desempenho.
*   Notificações automáticas para status de orçamentos.
*   Integração com sistemas financeiros externos.

## ✅ Resultado Esperado

Um sistema seguro, organizado e escalável, focado na otimização da negociação de orçamentos odontológicos. O objetivo é facilitar o trabalho da funcionária, reduzir a carga administrativa e, consequentemente, aumentar a taxa de conversão de pacientes para a clínica dentária.
