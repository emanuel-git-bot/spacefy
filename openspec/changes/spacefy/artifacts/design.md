# Design: Spacefy

## Architecture (React + Node.js)
A aplicação será um monólito Fullstack em Node.js desenhado para deploy na **Cloudflare (Pages / Workers)**. O frontend será adaptado a partir do `Project_Frondend_v0dev`.

### Core Engines
- **High-Precision Sync Engine (`useAudioSync`)**: Motor de sincronização que utiliza `requestAnimationFrame` para fazer polling de alta frequência (60 FPS) do `currentTime` do player. Isso garante que o acorde neon acenda no milissegundo exato, contornando a latência natural dos eventos de áudio HTML5.
- **Audio Source Manager**: Camada de abstração que unifica o comportamento para diferentes fontes: lida tanto com `<audio>` HTML5 nativo (para `.mp3` mockados/arquivos locais na pasta do projeto) quanto com a API de players embutidos (como YouTube).
- **Chord Engine**: Motor responsável pela transposição de acordes (Auto-Transpose) para cálculos de +1 ou -1 tom em tempo real, além de converter cifras entre o padrão Americano (C, D, E) e o Latino (Dó, Ré, Mi).

### Views Principais
- **HomeView**: Central de descoberta com feed social e cards ordenados por "Score".
- **DiscoveryView (TikTok Style)**: Feed vertical infinito e imersivo (Mobile-first) focado na descoberta rápida de novos trechos de cifras da comunidade.
- **PlayerView**: Arte borrada ao fundo. Auto-scroll das letras com ajuste de velocidade. Acendendo o acorde sobre a palavra exata (`wordIndex`). Possibilidade de exibir Diagrama dos Acordes ao passar o mouse.
- **EditorView**: O usuário clica na palavra (inteira) para atrelar o acorde e capturar timestamp. Timeline lateral.
- **ProfileView**: Perfil estilo Instagram, grid de cifras criadas e playlists. Configuração de Perfil Público vs Privado.
- **SettingsView**: Aba completa de configurações (Tema Claro/Escuro/Auto, Cor do Neon, Tamanho da Fonte, Sistema de Notas, Mostrar Diagramas de Acordes, Count-in antes de tocar, Configurações de Privacidade e Segurança).
- **Export/Print**: Interface simplificada para gerar o PDF ou impressão limpa da cifra.

## Data Models
O banco de dados utilizará **SQLite** localmente durante o desenvolvimento e será migrado para **Cloudflare D1** na produção, abstraído através de um ORM (como **Prisma** ou **Drizzle**).

```typescript
type AudioSourceType = 'local_audio' | 'youtube';

type Track = {
  id: string;
  title: string;
  artist: string;
  cover_url: string;
  sourceType: AudioSourceType;
  audio_url: string; // URL do arquivo ou ID do vídeo do Youtube
  views: number;
  score: number;
};

type ChordSync = {
  time: number;
  chord: string;
  wordIndex: number; // Atrelamento exato por palavra (nível de precisão escolhido)
};

type LyricLine = {
  id: string;
  text: string;
  startTime: number;
  chords: ChordSync[];
};

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

type UserSettings = {
  theme: 'dark' | 'light' | 'system';
  neonColor: string; // Hex color for the active chord
  fontSize: 'small' | 'medium' | 'large';
  notationSystem: 'american' | 'latin';
  showChordDiagrams: boolean;
  countInSeconds: number; // 0, 3, etc.
  scrollSpeedMultiplier: number;
  isProfilePrivate: boolean;
};

type UserProfile = {
  id: string;
  username: string;
  email: string;
  bio: string;
  followersCount: number;
  playlists: Playlist[];
  postedChordsheets: string[];
  settings: UserSettings;
};
```
