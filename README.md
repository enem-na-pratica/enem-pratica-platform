# 🎯 Enem Na Prática Platform

> **Plataforma EdTech Full Stack** projetada para automatizar o acompanhamento acadêmico, geração de simulados, cronogramas de estudo e mentorias para estudantes pré-vestibulandos.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)

---

## 📌 Contexto do Projeto & Impacto Real

O **Enem Na Prática** nasceu para resolver uma dor real de gestão acadêmica de um cursinho preparatório para o ENEM.

Anteriormente, todo o acompanhamento individualizado dos alunos — incluindo diagnósticos por área do conhecimento (_Linguagens, Humanas, Natureza e Matemática_), controle de erros em questões, agendamento de mentorias e acompanhamento de metas — era feito manualmente via tabelas no Google Sheets.

Com o crescimento da base de alunos, a gestão via planilhas tornou-se insustentável. Esta plataforma foi desenvolvida para **substituir o fluxo manual por uma solução SaaS personalizada**, centralizando a jornada do estudante em uma interface moderna e automatizada.

---

## 🚀 Principais Funcionalidades

- 📊 **Análise de Desempenho por Área de Conhecimento:** Diagnósticos detalhados dos pontos fortes e fracos do aluno com base no histórico de simulados.
- 📅 **Cronograma de Estudos Dinâmico:** Organização personalizada de rotinas de estudo adaptadas à evolução individual.
- 📝 **Gestão de Simulados & Correções:** Registro e monitoramento de acertos/erros para identificação de lacunas de aprendizado.
- 🤝 **Agendamento de Mentorias:** Integração de fluxo para marcação de sessões individuais de acompanhamento pedagógico.
- 🔐 **Autenticação & Controle de Acesso:** Acesso seguro com perfis diferenciados para estudantes e equipe pedagógica.

---

## 🛠️ Arquitetura & Decisões Técnicas de Engenharia

O projeto foi construído priorizando **escalabilidade, manutenibilidade, tipagem estrita e qualidade de código**, aplicando padrões consolidados na indústria de software:

### 1. Domain-Driven Design (DDD) & Clean Architecture

- Separação clara entre as regras de negócio do domínio e os detalhes de infraestrutura/framework.
- Módulos desacoplados que facilitam a evolução de novas regras pedagógicas sem impactar o restante do sistema.

### 2. Gestão de Banco de Dados & Performance

- **PostgreSQL + Prisma ORM:** Modelagem relacional robusta cobrindo entidades complexas de alunos, simulados e desempenhos por área.
- **Prisma Singleton Pattern:** Implementação de padrão Singleton para reutilização eficiente de conexões com o banco, evitando gargalos no ecossistema serverless do Next.js.
- **Orquestração de Seeds:** Scripts customizados de povoamento de banco de dados para rápida inicialização em ambientes de dev e teste.

### 3. Estratégia de Testes Automatizados Isolados

- **Vitest:** Suíte completa de testes unitários e de integração.
- **Test Database Containerized:** Uso do `docker-compose.test.yml` para subir instâncias dedicadas de PostgreSQL para testes, garantindo que a suíte rode em um banco real sem contaminar dados de desenvolvimento ou produção.
- **Performance de Testes:** Otimizações como _hashing_ prévio de senhas e mocks estratégicos para garantir tempos de execução extremamente rápidos em rotinas de CI/CD.

### 4. Conteinerização & DevOps

- Padronização completa do ambiente de desenvolvimento via **Docker** e **Docker Compose**, permitindo que qualquer desenvolvedor suba a aplicação completa (_App + Banco de Dados_) em minutos com um único comando.

---

## 🧰 Tech Stack

| Camada               | Tecnologias Utilizadas                                                              |
| :------------------- | :---------------------------------------------------------------------------------- |
| **Frontend**         | React, Next.js (App Router), TypeScript, Tailwind CSS, PostCSS                      |
| **Backend**          | Node.js, Next.js API Routes / Server Actions, TypeScript, Validation Error Handling |
| **Banco de Dados**   | PostgreSQL, Prisma ORM                                                              |
| **Testes**           | Vitest, Dockerized PostgreSQL Test Environment                                      |
| **DevOps & Tooling** | Docker, Docker Compose, Git, ESLint, Prettier, Vercel                               |

---

## 📂 Arquitetura de Pastas (Simplificada)

```text
enem-pratica-platform/
├── prisma/                 # Schema relacional, migrations e seeds do banco
├── scripts/                # Scripts de orquestração de banco e utilitários
├── src/
│   ├── app/                # Next.js App Router (Páginas, layouts e rotas de API)
│   ├── web/                # Componentes de interface reutilizáveis e hooks
│   └── core/               # Camadas de domínio (DDD), casos de uso e repositórios
├── tests/                  # Testes de integração e unitários
├── docker-compose.yml      # Configuração do ambiente Docker principal
├── docker-compose.test.yml # Instância isolada para banco de testes
└── vitest.config.ts        # Configurações otimizadas do runner de testes
```

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (v22+ recomendado)
- Docker
- Docker Compose

### Passo a Passo

#### 1. Clonar o repositório

```bash
git clone https://github.com/enem-na-pratica/enem-pratica-platform.git
cd enem-pratica-platform
```

#### 2. Configurar as Variáveis de Ambiente

Duplique os arquivos de exemplo e preencha as variáveis conforme necessário:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

#### 3. Instalar as Dependências

```bash
npm install
```

#### 4. Subir os Containers (Banco de Dados)

```bash
docker compose up -d
```

#### 5. Executar as Migrations

```bash
npx prisma migrate dev
```

---
