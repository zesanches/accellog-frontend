# accellog-frontend

Aplicação web de gerenciamento de checklists construída com Next.js e TypeScript.

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun

### Instalação

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build de produção

```bash
npm run build
npm start
```

### Testes

```bash
npm test
# ou
npm run test:watch   # modo interativo (watch)
# ou
npm run test:coverage  # com relatório de cobertura
```

### Lint

```bash
npm run lint
```

---

## Escolhas técnicas

### Tailwind CSS + Shadcn/UI + Radix UI

Tailwind CSS foi escolhido por ser a biblioteca de estilos recomendada no desafio. Ele adota uma abordagem **mobile-first**: os estilos base são aplicados para telas menores e os breakpoints (`sm:`, `md:`, `lg:`...) sobrescrevem para telas maiores, reduzindo o trabalho necessário para implementar responsividade.

O **Shadcn/UI** não é uma biblioteca de componentes instalada como dependência tradicional — ao adicionar um componente, ele é copiado diretamente para o projeto. Internamente, o Shadcn/UI utiliza o **Radix UI** como base: os primitivos do Radix (Dialog, AlertDialog, Progress, Slot, etc.) são instalados automaticamente como dependências, e o Shadcn apenas adiciona estilização com Tailwind por cima, expondo o componente como código editável no próprio projeto.

Essa combinação entrega:

- **Mobile-first por padrão**: responsividade implementada de forma progressiva com breakpoints do Tailwind, sem media queries manuais.
- **Acessibilidade nativa**: Radix UI fornece comportamento de teclado, foco e ARIA attributes prontos, sem necessidade de implementação manual.
- **Composição flexível**: os componentes do Shadcn/UI seguem o padrão de compound components e são facilmente customizáveis via `className`, mantendo total controle sobre o visual.
- **Sem lock-in de UI**: diferente de bibliotecas como Material UI ou Ant Design, o código dos componentes fica no próprio projeto, facilitando manutenção e personalização.

Também é usado o **Sonner** para exibição de toasts, integrado ao layout raiz.

### Zustand

Zustand foi escolhido para gerenciamento de estado por ser leve, simples e alinhado ao modelo mental do React:

- **API mínima**: sem boilerplate de actions, reducers ou providers — o store é uma função que expõe estado e ações diretamente.
- **Performance**: componentes subscrevem apenas ao slice de estado que utilizam, evitando re-renders desnecessários.
- **TypeScript nativo**: tipagem simples e sem configuração adicional.
- **Persistência fácil**: middleware `persist` disponível nativamente, caso necessário.

O store centraliza todos os checklists e suas ações (criar, excluir, adicionar/remover itens, marcar como concluído), além de controlar o estado de carregamento e inicialização dos dados vindos da API pública.
