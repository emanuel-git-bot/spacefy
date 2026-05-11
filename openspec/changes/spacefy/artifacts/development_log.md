# Development Log: Spacefy

Registro passo-a-passo das ações tomadas durante o desenvolvimento.

## Ações Realizadas
- **Ação 1**: Verificado ambiente e Node.js instalado com sucesso.
- **Ação 2**: Inicializado o monólito Next.js/React no diretório `spacefy` (Task 1 concluída).
- **Ação 3**: Copiados os arquivos e dependências visuais do `Project_Frondend_v0dev` para dentro do projeto `spacefy`.
- **Ação 4**: Instaladas as novas dependências (Radix UI, shadcn, etc) e configurado o `ThemeProvider` no `layout.tsx` para forçar o **Dark Mode** como padrão nativo (Task 2 concluída).
- **Ação 5**: Configurado o Drizzle ORM com SQLite, criados os schemas (Track, User, Chordsheet, etc) com base no design document, e gerada a primeira migração (Task 3 concluída).
- **Ação 6**: Desenvolvido o hook `useAudioSync` utilizando `requestAnimationFrame` para permitir o polling do tempo exato sem depender da lentidão dos eventos nativos (Task 4 concluída).
- **Ação 7**: Desenvolvido o `AudioPlayer` no `components/AudioPlayer.tsx`, que funciona como uma abstração híbrida para tocar MP3 local via `<audio>` do HTML5 e vídeos do YouTube via `react-youtube`, expondo uma API unificada via `forwardRef` (Task 5 concluída).
- **Ação 8**: Desenvolvido o `HomeView` em `app/page.tsx` construindo um feed social com cards imersivos (shadcn/Radix UI) ordenados automaticamente por Score (Task 6 concluída).
- **Ação 9**: Desenvolvido o `DiscoveryView` em `app/discover/page.tsx`, simulando a UX vertical do TikTok, com snap scrolling e ícones de interação flutuantes (Task 7 concluída).
- **Ação 10**: Desenvolvido o motor de Transposição de Acordes em `lib/chords.ts` capaz de recalcular tons com precisão (+1, -1) nos sistemas americano e latino.
- **Ação 11**: Desenvolvido o `PlayerView` em `app/player/[id]/page.tsx` integrando o `AudioPlayer`, `useAudioSync` e a lógica de transposição em uma interface com Autoscroll e iluminação exata das palavras ao cantar (Task 8 concluída).
- **Ação 12**: Desenvolvido o `EditorView` em `app/editor/page.tsx` permitindo colar letras originais e atrelar acordes a palavras específicas através de cliques e inputs dinâmicos na tela, com suporte a timeline inferior (Task 9 concluída).
- **Ação 13**: Desenvolvido o `SettingsView` em `app/settings/page.tsx` utilizando componentes Shadcn (Switch, Select, Slider) para gerenciar preferências de Tema, Sistema de Notas, Layout e Privacidade (Task 10 concluída).
- **Ação 14**: Desenvolvida a rota de impressão `app/print/[id]/page.tsx` com estilos otimizados para PDF/Papel (`@media print` nativo via Tailwind `print:` classes), removendo dark mode e exibindo layout minimalista (Task 11 concluída).
- **Ação 15**: Desenvolvido o `ProfileView` em `app/profile/[username]/page.tsx` imitando a arquitetura visual do Instagram (Grid de cifras, followers/following, tabs de navegação entre posts e playlists) (Task 12 concluída).
- **Ação 16**: Desenvolvido o `LoginView` em `app/login/page.tsx` com os fluxos visuais completos de autenticação base (Email/Senha) e mapeamento desabilitado das futuras integrações (Google/Spotify) visando gamificação futura (Task 13 concluída).

## Correções de Bugs (Bugfixes)
- **Erro `Module not found: Can't resolve '@/components/...'`**: Ao tentar rodar o servidor, o Next.js não encontrou os componentes. Isso ocorreu porque o projeto Next.js foi inicializado com a flag `--src-dir` (configurando o `tsconfig.json` para apontar `@/*` para `src/*`), mas na etapa de mesclagem (Ação 3) movemos as pastas para a raiz do projeto e não atualizamos o `tsconfig.json`.
- **Solução (Ação 17)**: O arquivo `spacefy/tsconfig.json` foi editado, alterando a propriedade `"paths": { "@/*": ["./src/*"] }` para `"paths": { "@/*": ["./*"] }`, corrigindo a importação global de todos os módulos.

---

## Fase 2 – Backend, Navegação e Integração

### Ações Realizadas (Fase 2)
- **Ação 18**: Criado o componente `components/Navigation.tsx` com Sidebar para Desktop e Bottom Navigation Bar para Mobile. Integrado no `app/layout.tsx` para que o menu seja global em todas as rotas do App.
- **Ação 19**: Criado o arquivo `app/actions/chords.ts` com **Server Actions** do Next.js para leitura real do banco SQLite (Drizzle ORM), substituindo todos os mocks estáticos das rotas principais. Criada a função `seedDatabase()` que auto-popula o banco com 3 músicas e cifras de exemplo na primeira execução.
- **Ação 20**: Refatorado o `app/page.tsx` (HomeView) para ser um Server Component assíncrono que busca o feed diretamente do SQLite, ordenado por Score, com links clicáveis para o perfil do criador (`/profile/[username]`).
- **Ação 21**: Refatorado o `app/discover/page.tsx` (DiscoveryView) para buscar o feed real via `useEffect` e substituir os dados mockados.
- **Ação 22**: Refatorado o `app/player/[id]/page.tsx` (PlayerView) para buscar a cifra completa pelo `id` da URL via `getChordsheet()`, exibindo título, artista, fontes de áudio e linhas de letra/acordes reais do banco.
- **Ação 23**: Criada rota de API `app/api/upload/route.ts` para receber uploads de arquivos `.mp3` via `multipart/form-data` e salvá-los em `public/uploads/`.
- **Ação 24**: Atualizado o `app/editor/page.tsx` com campos reais de Título e Artista, salvamento real via `saveChordsheet()` que persiste Track e Chordsheet no SQLite. O botão "Salvar Projeto" agora redireciona para o Feed após salvar.
- **Ação 25**: Criado `app/actions/auth.ts` com funções de Login, Logout e `getSession()` usando Cookies HTTP seguros. A ação de login auto-registra usuários novos no banco de dados (sem senha por ora – autenticação simplificada para prototipagem).
- **Ação 26**: Integrado o Login real no `app/login/page.tsx`, que agora chama a Server Action de login e redireciona para o Feed em caso de sucesso.

---

## Fase 3 – Funcionalidades Sociais (Comentários, Likes, Bookmarks, Compartilhamento, Perfis)

### Ações Realizadas (Fase 3)
- **Ação 27**: Expandido o `lib/db/schema.ts` com **4 novas tabelas**: `comments` (comentários por cifra), `likes` (likes por usuário/cifra com impacto no Score), `playlists` + `playlist_items` (sistema de Bookmark/Favoritos) e `follows` (seguir/deixar de seguir usuários).
- **Ação 28**: Expandido `app/actions/chords.ts` com todas as Server Actions para as novas tabelas: `getComments()`, `addComment()`, `getLikeCount()`, `toggleLike()`, `isLikedByUser()`, `getUserPlaylists()`, `addToPlaylist()`, `createPlaylist()`, `getUserProfile()`, `getUserChordsheets()`, `toggleFollow()`, `isFollowing()`.
- **Ação 29**: Criado componente `components/CommentsDrawer.tsx` – painel de comentários deslizante (bottom sheet) com listagem em tempo real, tempo relativo ("agora", "3m", "2h"), campo de texto e botão de envio. Mostra "Entre para comentar" se não logado.
- **Ação 30**: Criado componente `components/LikeButton.tsx` – botão de like com animação de coração vermelho e glow neon quando ativo. Chama `toggleLike()` que também incrementa o Score da música no banco.
- **Ação 31**: Criado componente `components/ShareButton.tsx` – botão de compartilhamento com mini-modal flutuante. Suporta "Copiar link" (clipboard) e a Web Share API nativa do dispositivo (mobile-first).
- **Ação 32**: Criado componente `components/BookmarkButton.tsx` – botão para salvar cifra em playlist existente ou criar uma nova playlist inline, com confirmação visual ✓.
- **Ação 33**: Integrados os novos componentes sociais (`LikeButton`, `CommentsDrawer`, `ShareButton`, `BookmarkButton`) no `PlayerView` como painel lateral direito flutuante. Adicionado botão de Print direto no player.
- **Ação 34**: Integrados `LikeButton`, `CommentsDrawer` e `ShareButton` no `DiscoveryView`, substituindo os botões estáticos anteriores.
- **Ação 35**: Reescrito o `ProfileView` (`app/profile/[username]/page.tsx`) para carregar dados reais do banco via `getUserProfile()` e `getUserChordsheets()`. Implementado botão Follow/Unfollow funcional com toggle em tempo real. Cards de cifras agora são clicáveis e navegam para o `PlayerView`. Adicionado estado de carregamento e tela de "usuário não encontrado".
- **Ação 36**: Adicionado link clicável no avatar/nome dos autores no `HomeView`, navegando para `/profile/[username]`.

### Status Atual
- **Funcionalidades Sociais**: Comentários ✅ | Likes (+Score) ✅ | Bookmarks/Playlists ✅ | Compartilhar ✅ | Perfil de outros usuários ✅ | Follow/Unfollow ✅
- **Próximos Passos**: Sessão de usuário real (cookies) ligada ao UI para personalizar likes/follows por sessão; Migração Cloudflare D1 para produção.

---

## Fase 3 – Correções e Melhorias de UX

### Correções de Bugs (Fase 3)
- **SqliteError: no such column "avatar_url"** (Ação 37): O arquivo `sqlite.db` continha o schema antigo (sem as colunas `avatar_url`, `following_count` e as novas tabelas `comments`, `likes`, `playlists`, `playlist_items`, `follows`). Drizzle não migra automaticamente. Solução: atualizado `lib/db/index.ts` com `CREATE TABLE IF NOT EXISTS` para todas as tabelas e `ALTER TABLE ... ADD COLUMN` seguro (ignora erro se coluna já existir). O `sqlite.db` foi deletado e recriado limpo.
- **404 em /register** (Ação 38): Rota de cadastro não existia. Criada a página `app/register/page.tsx` com campos de Username, Email e Senha, conectada ao Server Action `login()` que auto-registra o usuário no banco na primeira entrada.
- **FOREIGN KEY constraint failed no Editor** (Ação 39): O `saveChordsheet()` usava `authorId: 'e2b2605f-...'`, um UUID hardcoded de sessão anterior inexistente no banco atual. Corrigido importando `useSession` no `EditorView` e usando `sessionUser.id` real. Se o usuário não estiver logado, redireciona para `/login`.
- **Perfil /profile/me sem usuário** (Ação 40): `/profile/me` buscava literalmente um usuário com username `"me"` no banco. Corrigido no `ProfileView` com tratamento especial: quando `username === 'me'`, chama `getSession()` para resolver o usuário da sessão atual. Criado `hooks/useSession.ts` para reutilizar a sessão em Client Components.

### Melhorias de UX
- **Navigation com Sessão** (Ação 41): O componente `Navigation.tsx` agora exibe o avatar e username do usuário logado no rodapé da sidebar, com botão de Logout. Quando não logado, mostra botão "Entrar". O link "Perfil" aponta para `/profile/[username]` real (não mais o alias `/profile/me`).
- **Botões sociais com sessão real** (Ação 42): `PlayerView` integrado com `useSession` — `LikeButton`, `CommentsDrawer` e `BookmarkButton` recebem o `sessionUser.id` real, habilitando ações sociais autenticadas.

---

## Fase 4 – DiscoveryView Full-Screen Desktop (TikTok Style)

### Ações Realizadas (Fase 4)
- **Ação 43 – Sidebar oculta em /discover**: Atualizado `components/Navigation.tsx` para detectar a rota `/discover` via `usePathname()`. Quando ativa, o `<aside>` do desktop é ocultado (não renderizado), enquanto a barra de navegação inferior do mobile é preservada intacta (usuário pediu que não alterasse o mobile).
- **Ação 44 – Discover full-screen via `fixed inset-0`**: O container principal do `app/discover/page.tsx` foi alterado de `h-screen w-full relative` para `fixed inset-0`, garantindo que a página ocupe exatamente `100vw × 100vh` independentemente do layout do pai (flex com sidebar). Isso assegura a experiência TikTok idêntica em desktop e mobile — rolagem vertical por snap, card por card, sem nenhum elemento da sidebar "vazando" para dentro da tela imersiva.
