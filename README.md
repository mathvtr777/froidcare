# FROID CARE — APLICATIVO WEB DE BEM-ESTAR EMOCIONAL

> Um espaço pessoal, discreto e confiável para compreender emoções, autorregular a ansiedade e encontrar ferramentas de apoio em momentos difíceis.

---

## 1. VISÃO GERAL DO PRODUTO

O **Froid Care** é uma aplicação web completa desenvolvida com foco em acessibilidade, estabilidade, privacidade e soberania de dados do usuário (LGPD). 

Diferente de painéis corporativos ou protótipos estáticos, a aplicação é um produto real e funcional que oferece:
- **Autenticação Segura e Isolamento por RLS**: Login, cadastro, recuperação de senha e proteção granular de registros com Row Level Security.
- **Check-in Emocional e Diário Completo**: Registro contextual com escala 0-10, categorização por emoções, identificação de gatilhos, qualidade de sono e anotações.
- **Modo de Acolhimento Guiado**: Cinco práticas validadas para descompressão e regulação:
  1. *Respiração Guiada* (ritmos ajustáveis 4-4-4 ou 4-6 suave, com redução de movimento opcional).
  2. *Aterramento Sensorial (5-4-3-2-1)* passo a passo.
  3. *Relaxamento Corporal* orientado sem esforço lesivo.
  4. *Organização de Pensamentos* (diferenciação de fatos, incertezas e passos possíveis).
  5. *Escrita Livre e Desabafo* com salvamento no diário ou descarte protegido.
- **Meu Progresso**: Visualização de tendências reais de intensidade e distribuição de sensações sem diagnósticos arbitrários ou causalidades fictícias. Inclui alternativa em tabela para leitores de tela.
- **Relatórios em PDF no Navegador**: Exportação com intervalos de datas personalizados, resumos descritivos, controle de inclusão de anotações e nota metodológica clínica.
- **Modo Local / Demonstração Resiliente**: Caso as credenciais do Supabase não estejam preenchidas, a aplicação opera com persistência local sem falhas, possibilitando teste e avaliação imediata de todos os fluxos.

---

## 2. ARQUITETURA E ESTRUTURA DE PASTAS

```
froid/
├── public/
│   └── favicon.svg                    # Identidade visual sutil
├── src/
│   ├── components/
│   │   ├── diary/                     # Check-in e Modal de Registro do Diário
│   │   ├── layout/                    # Layout geral, Sidebar, Header, BottomNav
│   │   ├── onboarding/                # Onboarding curto e opcional
│   │   ├── safety/                    # Modal de ajuda imediata (SAMU 192, CVV 188)
│   │   ├── ui/                        # Componentes de design system (Button, Input, Slider, Modal, etc.)
│   │   └── welcoming/                 # 5 Exercícios guiados de acolhimento
│   ├── constants/                     # Emoções, gatilhos, contatos de emergência
│   ├── contexts/                      # AuthContext e PreferencesContext
│   ├── lib/                           # Cliente Supabase e utilitários de data/fuso
│   ├── pages/
│   │   ├── auth/                      # Login, Cadastro, Recuperar Senha
│   │   ├── diary/                     # Tela do Diário e filtros avançados
│   │   ├── home/                      # Página Inicial com saudação contextual
│   │   ├── progress/                  # Gráficos reais e resumos cronológicos
│   │   ├── reports/                   # Configuração e exportação em PDF
│   │   └── settings/                  # Ajustes, LGPD, exportação JSON e encerramento
│   ├── routes/                        # Rotas públicas e protegidas
│   ├── services/                      # Camada de serviços (auth, records, preferences, reminders, pdf)
│   ├── test/                          # Testes unitários, de integração e de UI
│   ├── types/                         # Tipos estritos do domínio
│   ├── App.tsx                        # Árvore raiz
│   ├── index.css                      # Tailwind e variáveis do tema carvão
│   └── main.tsx                       # Ponto de entrada React 18
├── supabase/
│   └── migrations/
│       └── 00001_initial_schema.sql  # Migração SQL com RLS, tabelas, índices e triggers
├── .env.example                       # Exemplo de configuração pública
├── package.json
├── tsconfig.json                      # Configuração estrita do TypeScript
├── vite.config.ts                     # Configuração do Vite com divisão de chunks
└── vercel.json                        # Configuração de reescrita SPA para publicação
```

---

## 3. TECNOLOGIAS UTILIZADAS

- **React 18** com TypeScript em modo estrito (`strict: true`).
- **Vite 5** para inicialização rápida e empacotamento com chunks otimizados.
- **Tailwind CSS 3** com paleta customizada carvão e sálvia.
- **React Router DOM 6** para roteamento e controle de rotas autenticadas.
- **Supabase JS 2** para autenticação e banco PostgreSQL com RLS.
- **jsPDF** para compilação client-side de relatórios em PDF com paginação e suporte a caracteres em português.
- **Recharts** para visualização responsiva de séries temporais e barras.
- **Lucide React** para ícones funcionais.
- **Date-fns** para tratamento seguro de fusos e datas civis.
- **Vitest & React Testing Library** para testes unitários, de componentes e de integração.

---

## 4. COMO EXECUTAR LOCALMENTE

### Pré-requisitos
- Node.js 18+ (testado em v18.19.1)
- npm 9+

### Passo a passo
1. Clone o repositório ou navegue até o diretório:
   ```bash
   cd froid
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse a URL informada no terminal (geralmente `http://localhost:5173`).

---

## 5. COMANDOS DE TESTE E VALIDAÇÃO

- **Executar todos os testes automatizados**:
  ```bash
  npm test
  ```
- **Executar testes em modo contínuo (watch)**:
  ```bash
  npm run test:watch
  ```
- **Verificação de tipos TypeScript e build de produção**:
  ```bash
  npm run build
  ```
- **Pré-visualizar o build localmente**:
  ```bash
  npm run preview
  ```

---

## 6. CONFIGURAÇÃO DO SUPABASE E BANCO DE DADOS

O aplicativo está pronto para operar conectado a qualquer projeto Supabase:

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto.
2. No menu **SQL Editor**, copie e execute todo o conteúdo do arquivo:
   `supabase/migrations/00001_initial_schema.sql`
   - Isso criará as tabelas `profiles`, `user_preferences`, `emotional_records`, `favorite_activities` e `reminders`.
   - Ativará **Row Level Security (RLS)** em todas as tabelas com políticas que impedem qualquer usuário de ler ou alterar dados de outros usuários.
   - Criará triggers para geração automática de perfil no cadastro.
3. No painel do Supabase, vá em **Project Settings > API** e copie:
   - **Project URL**
   - **anon / public key**
4. No arquivo `.env` do projeto, preencha:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
5. No painel do Supabase em **Authentication > URL Configuration**, adicione a URL da sua aplicação (local ou Vercel) nas *Redirect URLs*.

---

## 7. PUBLICAÇÃO NA VERCEL

O projeto já contém o arquivo `vercel.json` configurado para SPA (Single Page Application).

1. Conecte seu repositório no dashboard da [Vercel](https://vercel.com).
2. Configure o framework como **Vite**.
3. Adicione as variáveis de ambiente em **Settings > Environment Variables**:
   - `VITE_SUPABASE_URL`: sua URL do Supabase.
   - `VITE_SUPABASE_ANON_KEY`: sua chave pública anônima.
4. Execute o Deploy. A Vercel executará `npm run build` e distribuirá os arquivos estáticos na CDN global.

---

## 8. SEGURANÇA, PRIVACIDADE E LGPD

- **Row Level Security (RLS)**: Cada tabela garante `auth.uid() = user_id`. Não confiamos apenas em filtros do front-end.
- **Exportação de Dados**: Na aba de Configurações, o usuário pode baixar todos os registros em JSON para portabilidade.
- **Direito ao Esquecimento**: O usuário pode apagar todos os registros com um clique e confirmação destrutiva, bem como solicitar exclusão integral da conta.
- **Sem Rastreamento Intrusivo**: Não há pixels de anúncios, ferramentas de biometria comportamental ou telemetria diagnóstica.
