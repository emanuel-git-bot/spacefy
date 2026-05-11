# Spacefy 🎸

**Spacefy** é uma "Rede Social de Cifras Sincronizadas" onde os acordes aparecem perfeitamente sincronizados com o tempo do áudio, atrelados às palavras exatas da letra. Este projeto foi desenvolvido como exemplo de aplicação prática da metodologia **SDD (Spec Driven Development)** e outras práticas estudadas ao longo do curso.

## 🚀 Tecnologias e Dependências

O projeto utiliza as seguintes tecnologias principais:
- **[Next.js](https://nextjs.org/)**: Framework React para o Frontend e rotas da API.
- **[React](https://react.dev/)**: Biblioteca para construção de interfaces de usuário.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utilitário para estilização rápida e responsiva.
- **[shadcn/ui](https://ui.shadcn.com/)** (via Radix UI): Componentes de interface acessíveis e customizáveis.
- **[Drizzle ORM](https://orm.drizzle.team/) & SQLite (`better-sqlite3`)**: Para gerenciamento de banco de dados local.
- **[Lucide React](https://lucide.dev/)**: Ícones elegantes e consistentes.

## ⚙️ Como Configurar e Rodar o Projeto

Siga os passos abaixo para executar o projeto localmente na sua máquina.

### Pré-requisitos
- Node.js (versão 18+ recomendada)
- npm, yarn, pnpm ou bun instalados.

### Passo 1: Instalação das Dependências

Clone o repositório ou baixe o código-fonte. No terminal, navegue até a pasta raiz do projeto (`spacefy`) e rode o comando:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### Passo 2: Configuração e Banco de Dados

O projeto já inclui as tipagens e mocks iniciais. Caso seja necessário iniciar o banco de dados via Drizzle, você pode rodar as migrações (se configuradas no `package.json`). Caso contrário, os dados estáticos/mockados já permitirão a visualização das telas construídas por meio de especificações.

### Passo 3: Rodar o Servidor de Desenvolvimento

Após a instalação das dependências, inicie a aplicação com o comando:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O servidor será iniciado. Abra o seu navegador e acesse [http://localhost:3000](http://localhost:3000) para ver o resultado.

## 📖 Exemplos de Uso

1. **Central de Descoberta (Home):** Ao acessar a página inicial, você verá um feed social com cifras criadas pela comunidade (dados de teste gerados via Spec).
2. **Player de Música:** Interaja com as músicas para ver a sincronização das letras (mock) que foram idealizadas nas especificações do *PlayerView*.
3. **Editor e Perfil:** Explore as visões e a navegação da aplicação para compreender como as diferentes entidades (Playlists, Chordsheets) se conectam na interface.

---
*Desenvolvido como projeto educacional aplicando práticas modernas de desenvolvimento guiado por especificações (Specs).*
