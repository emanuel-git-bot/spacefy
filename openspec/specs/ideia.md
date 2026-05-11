Conceito: Web Service de música com exibição sincronizada de cifras. O foco do desenvolvimento inicial está na estrutura dos dados e na precisão da sincronia temporal (timestamps), utilizando sucessos reais como base de teste.
1. Definição do Recurso Track
O contrato deve prever metadados básicos para renderizar a interface de "player":
id: Identificador único (ex: uuid).
title: Nome da música (ex: "Wonderwall").
artist: Nome da banda/artista (ex: "Oasis").
cover_url: Link para imagem da capa (mockup).
audio_url: Link para o arquivo de áudio (pode ser um arquivo local ou .mp3 público).
2. Definição do Recurso Chordsheet (O Diferencial)
Este é o objeto que o Agente SDD deve detalhar. Ele mapeia o tempo exato da música para o acorde correspondente:
Esquema do Objeto de Sincronia:
time: Float (segundos exatos, ex: 12.45).
chord: String (notação de cifra, ex: Gmaj7).
label: String opcional (ex: "Intro", "Refrão").
3. Endpoints Estruturados para Mock
Para o SDD, o agente deve gerar as especificações para:
GET /songs: Retorna a lista de músicas fakes disponíveis.
GET /songs/{id}/notation: Retorna o array de timestamps e acordes sincronizados.
🎸 Exemplos para Inserir no Mock (Dataset de Teste)
Ao configurar o seu servidor de Mock (como o Prism ou Mockoon), utilize estes dados:

Música
Timestamps (Exemplo)
Dificuldade
Knockin' on Heaven's Door
0.0s: G, 2.5s: D, 5.0s: Am
Iniciante
Wonderwall
0.0s: Em7, 4.1s: G, 8.2s: D4
Intermediário
Hallelujah
0.0s: C, 3.0s: Am, 6.0s: C
Iniciante