# Proposal: Spacefy

## What & Why
O projeto Spacefy é um Web Service focado em exibir cifras musicais sincronizadas com o tempo exato do áudio. O diferencial desta aplicação é a precisão temporal de alta performance e o atrelamento dos acordes às palavras da letra, aliado a fortes elementos de comunidade e gamificação. A aplicação funcionará como uma rede social focada na criação e consumo de cifras.

## Requirements
- **Stack:** React + Node.js (Fullstack Monolith).
- **Hospedagem/Infraestrutura:** O projeto será hospedado 100% no ecossistema da Cloudflare (Cloudflare Pages / Workers).
- **Banco de Dados:** Cloudflare D1 (SQL nativo serverless) para produção, com SQLite para testes locais, abstraído através de um ORM (Drizzle ORM ou Prisma).
- **Fontes de Áudio (Híbrido):** O sistema suportará ativamente uploads de arquivos de áudio locais (`.mp3` - salvos na pasta do projeto inicialmente) e integrações com fontes externas (como vídeos do YouTube).
- **Interface:** O frontend oficial utilizará componentes espelhados do diretório `Project_Frondend_v0dev`. O design terá **Dark Mode** como padrão nativo.
- **Dados Base:** Acordes atrelados com precisão a palavras inteiras da letra (via `wordIndex`). Suporte a métricas de avaliação (reviews), contagem de views e sistema de playlists.
- **Gamificação e Comunidade:** Sistema de login (inicialmente Email/Senha, futuramente Google/Spotify), perfis públicos (estilo Instagram), comentários, postagem de conteúdo próprio e ranking.

## Key Features
- **Sincronização de Alta Precisão:** Motor focado em zero delay entre o áudio e o acorde em tela.
- **Transposição de Tom (Auto-Transpose):** Funcionalidade para o usuário subir ou descer o tom da cifra (+1/-1).
- **Descoberta estilo TikTok:** Feed vertical infinito para descobrir novas cifras da comunidade.
- **Modo de Impressão / Exportação:** Geração de PDF limpo para músicos que tocam offline.
- **Configurações Personalizadas:** Aba de configurações com foco na experiência de leitura e audição (Tamanho de fonte, cores neon personalizadas, sistemas de nota, contagem regressiva, privacidade, etc).
