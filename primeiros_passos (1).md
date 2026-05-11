# OpenSpec — Instalação e uso (Antigravity ou Cursor)

Tutorial baseado na documentação oficial do repositório [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec): [installation](https://github.com/Fission-AI/OpenSpec/blob/main/docs/installation.md), [getting-started](https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md), [workflows](https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md), [supported-tools](https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md) e [README](https://github.com/Fission-AI/OpenSpec/blob/main/README.md).

---

## Fluxo “core” do OpenSpec

No perfil padrão (**core**), comandos relevantes incluem **`propose`**, **`explore`**, **`apply`** e **`archive`**.

Caminho rápido típico:

```text
/opsx:propose → /opsx:apply → /opsx:archive
```

Para **esclarecer requisitos antes de propor** uma mudança:

1. **`/opsx:explore`** — investigação e alinhamento quando o escopo ainda não está claro.
2. **`/opsx:propose`** + nome da mudança (ex.: `add-dark-mode`) — gera a pasta da alteração com `proposal.md`, deltas em `specs/`, `design.md` e `tasks.md`.

---

## Pré-requisito (Windows e macOS)

- **Node.js 20.19.0 ou superior**

Verificar:

```bash
node --version
```

---

## Instalação no Windows

1. Instalar Node.js (20.19+) pelo [site oficial](https://nodejs.org) ou pelo gerenciador de pacotes que você usar (winget, Chocolatey, etc.).
2. Abrir **PowerShell** ou **Prompt de Comando**.
3. Instalar o CLI globalmente:

```bash
npm install -g @fission-ai/openspec@latest
```

(Alternativas na documentação: `pnpm`, `yarn` ou `bun`, com os comandos globais equivalentes.)

1. Confirmar:

```bash
openspec --version
```

---

## Instalação no macOS

1. Instalar Node.js 20.19+ (instalador oficial, Homebrew, nvm, etc.).
2. No **Terminal**:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

---

## Inicializar OpenSpec no projeto (escolha **uma** ferramenta)

No diretório do repositório:

### Só Antigravity

```bash
cd caminho/do/seu-projeto
openspec init --tools antigravity
```

Artefatos típicos: `.agent/skills/openspec-*/SKILL.md` e `.agent/workflows/opsx-*.md`.

### Só Cursor

```bash
cd caminho/do/seu-projeto
openspec init --tools cursor
```

Artefatos típicos: `.cursor/skills/openspec-*/` e `.cursor/commands/opsx-*.md`.

Não é necessário configurar as duas ferramentas no mesmo projeto; escolha a que você vai usar para trabalhar com `/opsx:*`.

---

## Ciclo básico: explorar → propor (gerar spec da mudança)

1. Abrir o projeto no **Antigravity** ou no **Cursor** (conforme você inicializou).
2. **`/opsx:explore`** — conversar até definir problema, escopo e opções (útil quando os requisitos ainda estão nebulosos).
3. **`/opsx:propose`** seguido de um **nome em kebab-case** (ex.: `add-dark-mode`) — cria `openspec/changes/<nome>/` com `proposal.md`, delta em `specs/`, `design.md` e `tasks.md`.
4. Para implementar: **`/opsx:apply`**.
5. Ao encerrar a mudança: **`/opsx:archive`** — merge dos deltas em `openspec/specs/` e pasta da mudança movida para arquivo.

### Comandos úteis no terminal

```bash
openspec list
openspec show <nome-da-mudanca>
openspec validate <nome-da-mudanca>
openspec view
```

---

## Antigravity vs Cursor

- A **instalação global** do OpenSpec (`npm install -g ...`) é a mesma em qualquer sistema.
- **Por projeto**, quem recebe skills/workflows é o `openspec init --tools` com **`antigravity`** ou **`cursor`** — escolha uma ferramenta por repositório.
- Os **slash commands** no estilo **`/opsx:explore`**, **`/opsx:propose`**, etc., são o mesmo fluxo conceitual; mudam os **diretórios** onde o projeto guarda skills e comandos (`.agent/...` ou `.cursor/...`).

---

## Atualizar OpenSpec e regenerar artefatos no projeto

```bash
npm install -g @fission-ai/openspec@latest
cd seu-projeto
openspec update
```

---

## Workflow expandido (opcional)

Comandos como `/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, etc. exigem alterar o perfil e aplicar atualização:

```bash
openspec config profile
openspec update
```

O perfil **core** padrão já cobre **explore**, **propose**, **apply** e **archive** para o fluxo básico descrito acima.

---

## Notas da documentação oficial

- Modelos com forte capacidade de raciocínio tendem a funcionar melhor; o README recomenda **higiene de contexto** (por exemplo, contexto limpo antes de implementar).
- Telemetria anônima pode ser desativada: `OPENSPEC_TELEMETRY=0` ou `DO_NOT_TRACK=1` (ver README do projeto).

---

## Links da documentação

- [Instalação](https://github.com/Fission-AI/OpenSpec/blob/main/docs/installation.md)
- [Primeiros passos](https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md)
- [Fluxos de trabalho](https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md)
- [Ferramentas suportadas](https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md)
- [README — Quick Start](https://github.com/Fission-AI/OpenSpec/blob/main/README.md)
