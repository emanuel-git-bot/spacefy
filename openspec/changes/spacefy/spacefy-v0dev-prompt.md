# Spacefy — Prompt Completo para v0.dev

> Cole este documento inteiro no chat do [v0.dev](https://v0.dev/) para gerar a interface completa do **Spacefy**.

---

## 🎯 Contexto do Projeto

Crie a interface completa em **React + Tailwind CSS + shadcn/ui** para um Web Service de música chamado **"Spacefy"** — uma **Rede Social de Cifras Sincronizadas**.

O diferencial do Spacefy é que os acordes aparecem **perfeitamente sincronizados** com o tempo do áudio, atrelados às palavras exatas da letra. É parte player musical, parte rede social estilo Instagram/TikTok.

---

## 🎨 Estética e Design (MUITO IMPORTANTE)

- **Tema:** Dark Mode forçado como padrão. O usuário pode trocar nas configurações.
- **Visual:** Estética moderna e "premium". Tons vibrantes (**neon roxo**, **azul espacial**, **rosa elétrico**) contrastando com fundos escuros (preto puro / `zinc-950` / `zinc-900`).
- **Efeitos obrigatórios:**
  - *Glassmorphism* nos painéis de controle (background translúcido com `backdrop-blur`)
  - Micro-animações suaves nos botões (hover com `scale` e `transition`)
  - Efeito de **neon glow** nos acordes ativos: `drop-shadow` ou `text-shadow` em roxo/azul brilhante
  - Transições fluidas entre estados
- **Fonte:** Use `Inter` ou `Outfit` do Google Fonts
- **Inspiração visual:** Instagram para as partes sociais, TikTok para o feed de descoberta, Spotify para o player

---

## 📐 Estrutura de Dados (TypeScript — use como Props dos componentes)

```typescript
type AudioSourceType = 'local_audio' | 'youtube';

type Track = {
  id: string;
  title: string;
  artist: string;
  cover_url: string;
  sourceType: AudioSourceType;
  audio_url: string; // URL do MP3 ou ID do vídeo do YouTube
  views: number;
  score: number; // Pontuação gamificada
};

type ChordSync = {
  time: number;      // Timestamp em segundos
  chord: string;     // Ex: "Am", "C#m", "G7"
  wordIndex: number; // Índice da palavra na linha
};

type LyricLine = {
  id: string;
  text: string;
  startTime: number;
  chords: ChordSync[];
};

type Comment = {
  id: string;
  userId: string;
  authorUsername: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
};

type Playlist = {
  id: string;
  name: string;
  isPublic: boolean;
};

type Chordsheet = {
  id: string;
  trackId: string;
  authorId: string;
  lines: LyricLine[];
};

type UserProfile = {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  followersCount: number;
  playlists: Playlist[];
  settings: UserSettings;
};

type UserSettings = {
  theme: 'dark' | 'light' | 'system';
  neonColor: string;       // Hex: cor do acorde ativo
  fontSize: 'small' | 'medium' | 'large';
  notationSystem: 'american' | 'latin'; // C,D,E vs Dó,Ré,Mi
  showChordDiagrams: boolean;
  countInSeconds: number;
  scrollSpeedMultiplier: number;
  isProfilePrivate: boolean;
};
```

---

## 📱 Navegação Global

Crie um sistema de navegação com **duas variantes**:

### Desktop — Sidebar Fixa (esquerda, 256px)
- Logo "Spacefy" no topo com ícone de música e gradiente roxo/azul
- Links: **Feed**, **Descobrir**, **Estúdio**, **Perfil**, **Ajustes**
- Rodapé da sidebar: Avatar + username do usuário logado + botão Logout (ícone)
- Quando não logado: botão "Entrar" em destaque

### Mobile — Bottom Navigation Bar (fixa na parte inferior)
- 5 ícones com label embaixo: Feed, Descobrir, Estúdio, Perfil, Ajustes
- Fundo `bg-zinc-950/90` com `backdrop-blur-md`
- Item ativo com cor `primary` (roxo) e efeito glow sutil

> ⚠️ **Exceção:** Na tela `/discover`, a sidebar desktop NÃO aparece (modo imersivo full-screen).

---

## 🖥️ Views (Telas) — Detalhe Completo

### 1. 🏠 HomeView — Feed Social

**Rota:** `/`

**Layout:**
- Header com título "Spacefy" em gradiente + subtítulo
- Lista vertical de cards de cifras

**Card de Cifra (cada item do feed):**
- Imagem de capa (240px wide, altura total do card) com hover overlay mostrando botão ▶ Play
- Badge "Em alta" 🔥 no primeiro card (gradiente laranja/vermelho)
- Título da música (grande, bold)
- Nome do artista (menor, muted)
- Badge de pontuação: `{score} pts` com cor primary e fundo primary/10
- Tags (ex: "Violão", "Intermediário") como Badges outline
- Footer do card: Avatar + @username clicável (link para `/profile/[username]`) + contadores de likes e comentários
- Ao clicar no card/play: navega para `/player/[id]`

---

### 2. 🎵 PlayerView — Reprodução Sincronizada

**Rota:** `/player/[id]`

**Layout geral:** Tela escura (preto/zinc-950), full-height, sem scroll externo.

**Cabeçalho:**
- Botão ← (voltar)
- Centro: título + artista
- Controles de transposição: `[-1] [+2] [+1]` com o valor atual no centro (em primary)
- Botão de configurações (ícone ⚙️)

**Área Principal — Letras com Acordes:**
- Linhas de letra em rolagem vertical suave (autoscroll)
- A linha atual: escala maior (`scale-110`), opacidade 100%
- Linhas inativas: escala menor (`scale-95`), opacidade 40%
- Sobre cada palavra com acorde: o acorde aparece **acima** em texto grande, fonte bold
- **Acorde ativo** (sendo tocado): cor primary (roxo/azul), `drop-shadow` neon pulsante
- **Acorde inativo**: cor zinc-500

**Sidebar Direita — Ações Sociais (flutuante):**
- ❤️ Like: botão com contador. Quando curtido, coração vermelho com glow
- 💬 Comentários: abre drawer/panel deslizante com lista + input
- 🔖 Salvar: abre popover de playlists com opção de criar nova
- 🔗 Compartilhar: mini-modal com "Copiar link" + share nativo
- 🖨️ Print: link para `/print/[id]`

**Dock Inferior — Controles de Mídia:**
- Botão ⏪ (-5s)
- Botão ▶/⏸ (grande, circular, fundo primary com glow)
- Botão ⏩ (+5s)
- Fundo: gradiente de baixo para cima (`from-black`)

---

### 3. 🎬 DiscoveryView — Feed TikTok

**Rota:** `/discover`

**Comportamento crítico:**
- **`position: fixed; inset: 0`** — ocupa 100vw × 100vh independente de qualquer layout pai
- Scroll vertical com `snap-y snap-mandatory` — cada card ocupa exatamente 100vh
- Sem scrollbar visível

**Cada "reel" (card full-screen):**
- Imagem de capa como fundo (`absolute inset-0`, `object-cover`, `opacity-60`)
- Overlay escuro nos cards não ativos
- **Centro da tela:** Acorde em fonte gigante (6xl, bold, cor primary, glow neon pulsante) + trecho da letra abaixo
- **Sidebar direita:** botões de Like (❤️ + contador), Comentários (💬), Compartilhar (🔗), e ícone de disco girando (animação 4s)
- **Rodapé esquerdo:** avatar + @username + botão "Play Full" (link para `/player/[id]`) + título + artista
- **Gradiente** de baixo para cima cobrindo o rodapé
- **Barra superior:** botão ← e título "Discovery" centralizados

> Na sidebar, os botões usam `bg-black/40 hover:bg-black/60 text-white rounded-full`

---

### 4. ✏️ EditorView — Estúdio de Criação

**Rota:** `/editor`

**Layout:** Duas colunas (sidebar esquerda fixa + área principal)

**Sidebar Esquerda (280px):**
- Título "Studio Editor" em primary
- Campos: Título da Música, Artista (Inputs)
- Campo: URL do Áudio (YouTube ou MP3)
- Textarea: Letra Original (grande, font-mono, resize-none)
- Botão "Salvar Projeto" (full-width, ícone 💾, destaque primary)

**Área Principal:**
- Letras renderizadas palavra por palavra
- Hover sobre a linha: aparecem botões `+` (ícone pequeno, opacidade 0 → 100 no hover)
- Ao clicar na palavra: Input inline aparece com autoFocus para digitar o acorde (ex: "Am")
- Enter ou onBlur confirma e salva o acorde sobre a palavra
- Acordo salvo: aparece em primary, clicável para editar
- **Timeline inferior (mini-player):** botão ▶/⏸ + barra de progresso visual

---

### 5. 👤 ProfileView — Perfil Estilo Instagram

**Rota:** `/profile/[username]`

**Header do Perfil:**
- Avatar grande (ring primary/20)
- Username (h1)
- Botões: **Editar Perfil** + ⚙️ (próprio) ou **Seguir/Seguindo** (outro usuário)
- Counters: publicações | seguidores | playlists
- Bio (texto livre)

**Tabs:**
- 📷 **CIFRAS**: grid `3 colunas` de capas (aspecto quadrado)
  - Hover: overlay escuro com ❤️ score + título + artista
  - Clique navega para `/player/[id]`
- 📋 **PLAYLISTS**: grid `2 colunas` de Cards com ícone ▶ + nome + visibilidade (Pública/Privada)

**Botão Follow:**
- Não seguindo: filled primary com ícone UserPlus
- Seguindo: outline com ícone UserCheck

---

### 6. ⚙️ SettingsView — Configurações

**Rota:** `/settings`

**Seções (use Cards separados com título):**

**🎨 Aparência**
- Switch: Tema Dark/Light/System (Select ou ToggleGroup)
- Color picker ou Swatches: Cor do Neon (roxo, azul, verde, rosa, branco)
- Select: Tamanho da fonte (Pequena / Média / Grande)

**🎵 Música**
- Select: Sistema de Notas (Americano C,D,E / Latino Dó,Ré,Mi)
- Switch: Mostrar Diagramas de Acordes
- Slider: Count-in (0s, 1s, 3s, 5s)
- Slider: Velocidade de Rolagem (0.5x → 2x)

**🔒 Privacidade e Conta**
- Switch: Perfil Privado
- Botão: Sair da conta (destructive/outline)

> Futuramente: Login com Google / Spotify (exibir como desabilitados com badge "Em breve")

---

### 7. 🖨️ PrintView — Exportação PDF

**Rota:** `/print/[id]`

**Comportamento:**
- Layout minimalista, fundo branco, texto preto
- `@media print`: remove todos elementos da UI dark (navbar, botões, dark mode)
- Exibe: Título + Artista + toda a letra com acordes acima das palavras
- Botão "Imprimir" visível apenas na tela (oculto no print)
- Fonte serifada para o conteúdo impresso

---

### 8. 🔐 LoginView / RegisterView

**Rota:** `/login` e `/register`

**Layout:** Centralizado, fundo bg-background

**Card de Login:**
- Logo + nome "Spacefy" no topo
- Campos: Email + Senha
- Botão "Entrar" (primary, full-width)
- Separador "Ou continue com"
- Botões Google e Spotify (desabilitados, badge "Em breve")
- Link para /register

**Card de Cadastro:**
- Campos: Username + Email + Senha
- Username: auto-lowercase, sem espaços
- Botão "Criar Conta" com loading state (Loader2 animado)

---

## 💬 Componentes Sociais Reutilizáveis

### CommentsDrawer
- Trigger: botão com ícone 💬 + contador
- Panel: bottom sheet (`fixed inset-0`, backdrop blur)
  - Header com título + botão X
  - Lista de comentários: Avatar + @username em primary + tempo relativo ("agora", "3m", "2h") + texto
  - Input + botão enviar (Send icon)
  - Se não logado: mensagem "Entre para comentar" com link

### LikeButton
- Coração com contador embaixo
- Estado ativo: `fill-red-500`, `text-red-500`, `drop-shadow` vermelho
- Animação de escala suave no toggle

### ShareButton
- Ícone de compartilhar + mini-modal ao clicar
- Opções: "Copiar link" (com feedback ✓ + "Link copiado!") + "Compartilhar..." (Web Share API)

### BookmarkButton
- Ícone 🔖 + popover com lista de playlists
- Cada playlist: nome + botão + (ícone ✓ ao adicionar)
- Input inline para criar nova playlist

---

## 🗂️ Estados Mock (para simular navegação e interação)

Use `useState` para simular tudo sem backend:

```typescript
// Dados de exemplo para o feed
const mockFeed = [
  {
    chordsheetId: 'cs1',
    trackTitle: 'Hotel California',
    artist: 'Eagles',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80',
    score: 150,
    views: 45000,
    author: 'classic_rocker',
    authorAvatar: 'https://i.pravatar.cc/150?u=rock',
  },
  {
    chordsheetId: 'cs2',
    trackTitle: 'Starboy (Acoustic)',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
    score: 95,
    views: 12050,
    author: 'gui_chords',
    authorAvatar: 'https://i.pravatar.cc/150?u=gui',
  },
];

// Cifra de exemplo para o Player
const mockChordsheet = {
  id: 'cs1',
  track: {
    title: 'Hotel California',
    artist: 'Eagles',
    sourceType: 'youtube',
    audioUrl: 'EqPtz5qN7HM',
  },
  chordsheet: {
    lines: [
      {
        id: 'l1',
        text: 'On a dark desert highway cool wind in my hair',
        startTime: 12,
        chords: [
          { time: 12, chord: 'Bm', wordIndex: 1 },
          { time: 14, chord: 'F#', wordIndex: 5 },
        ],
      },
      {
        id: 'l2',
        text: 'Warm smell of colitas rising up through the air',
        startTime: 16,
        chords: [
          { time: 16, chord: 'A', wordIndex: 0 },
          { time: 18, chord: 'E', wordIndex: 5 },
        ],
      },
    ],
  },
};

// Usuário logado
const mockUser = {
  id: 'u1',
  username: 'gui_chords',
  email: 'gui@spacefy.com',
  bio: 'Músico de fim de semana 🎸',
  avatarUrl: 'https://i.pravatar.cc/150?u=gui',
  followersCount: 1540,
};
```

---

## ✅ Requisitos Técnicos

- React com TypeScript
- Tailwind CSS v3+ para estilização
- shadcn/ui para componentes base (Button, Card, Input, Label, Avatar, Badge, Tabs, Switch, Select, Slider, ScrollArea)
- Lucide React para ícones
- `useState` e `useEffect` para simular estado e interações
- Navegação entre telas via estado interno (`currentView`) ou React Router
- Todos os componentes devem ser responsivos (mobile-first)
- Dark Mode forçado por padrão via `class="dark"` no `<html>`
