# Spacefy - Especificação de Frontend para v0.dev

Este documento contém todas as instruções e especificações necessárias para gerar a interface do **Spacefy** utilizando o [v0.dev](https://v0.dev/). 

Copie as instruções abaixo e cole no prompt do v0 para gerar os componentes iniciais em React + TailwindCSS + shadcn/ui.

---

## Prompt Base para o v0.dev

**Contexto do Projeto:**
Crie uma interface em React para um Web Service de música chamado "Spacefy". O projeto é uma "Rede Social de Cifras Sincronizadas", onde os acordes aparecem perfeitamente sincronizados com o tempo do áudio, atrelados às palavras exatas da letra.

**Estética e Design:**
- **Tema:** Dark mode por padrão.
- **Visual:** Estética moderna, "premium", usando tons vibrantes (ex: neon roxo, azul espacial) contrastando com fundos escuros (preto/cinza escuro).
- **Efeitos:** Utilize *glassmorphism* (fundos translúcidos com blur) nos painéis de controle, micro-interações suaves nos botões e transições fluidas. Estilo visual limpo inspirado no Instagram para as áreas sociais.

**Estrutura de Dados (Mock) para referência dos componentes:**
Considere as seguintes interfaces TypeScript para os props:

```typescript
type AudioSourceType = 'local_audio' | 'youtube';

type Track = {
  id: string;
  title: string;
  artist: string;
  cover_url: string;
  sourceType: AudioSourceType;
  audio_url: string; // URL do MP3 ou ID do vídeo do Youtube
  views: number;
  score: number;
};

type ChordSync = { time: number; chord: string; wordIndex: number; };

type LyricLine = { id: string; text: string; startTime: number; chords: ChordSync[]; };

type Review = { userId: string; rating: number; };
type Comment = { userId: string; text: string; timestamp: string; };
type Playlist = { id: string; name: string; isPublic: boolean; trackIds: string[]; };

type Chordsheet = {
  trackId: string;
  authorId: string;
  lines: LyricLine[];
  reviews: Review[];
  comments: Comment[];
};

type UserProfile = {
  username: string;
  bio: string;
  followersCount: number;
  playlists: Playlist[];
};
```

**Visões (Views) Necessárias:**
O projeto possui 4 telas principais que você deve criar:

### 1. HomeView (Central de Descoberta)
- **Feed Social:** Cards verticais mostrando as cifras criadas pela comunidade.
- **Informações do Card:** Nome da música, artista, pontuação (Score), visualizações (Views) e criador da cifra. Design muito atrativo.

### 2. PlayerView (Modo de Reprodução)
- **Cabeçalho/Fundo:** Arte de capa com blur ao fundo.
- **Painel de Letras:** O foco principal. Deve mostrar as linhas da letra fluindo verticalmente. A linha atual deve ficar em destaque.
- **Cifras Neon:** Em cima da palavra correspondente (`wordIndex`), mostre o acorde com efeito brilhante/neon.
- **Fonte de Áudio Híbrida:** Deixe um espaço que possa abrigar tanto uma barra de áudio padrão quanto um player embutido do YouTube escondido/minimizado.
- **Interação Social:** Botões para dar Like/Score, favoritar (Playlist) e abrir comentários.
- **Controles de Mídia:** Dock fixo com Play/Pause e barra de progresso.

### 3. EditorView (Modo de Criação/Sincronização)
- **Área de Texto (Letra):** Letra completa da música dividida por palavras clicáveis. Ao clicar na palavra, um popover abre para digitar o acorde (ex: "Am") atrelando-o àquele exato momento do player.
- **Timeline Lateral:** Lista vertical dos acordes já tageados.
- **Player Reduzido:** Um controle de áudio para dar play/pause rapidamente durante a edição.

### 4. ProfileView (Estilo Instagram)
- **Cabeçalho do Perfil:** Foto, username, bio e contagem de seguidores.
- **Abas de Navegação:** Alternar entre "Cifras Postadas" e "Playlists Salvas".
- **Grid Visual:** Exibição das cifras e playlists em formato grid moderno.

**Requisitos Técnicos:**
- Crie estados falsos (`useState`) para simular navegação entre as telas e interação básica nos players.
