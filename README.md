# Documentation RAG Project

A hackathon project built on [Lua](https://heylua.ai) (Doa.ai's agent platform) — a RAG agent that answers developer questions by comparing **Android Auto** and **Apple CarPlay** documentation side by side.

## What it does

Ask a technical question about in-car app development (e.g. "How does each platform handle voice input?") and the agent:

1. Retrieves relevant chunks from the Android Auto developer docs and the Apple CarPlay developer docs (ingested once, no live re-crawling).
2. Synthesizes a technical answer that explains the underlying concepts.
3. Generates a standalone, styled HTML page with examples, workflow explanations, and an explicit **Android Auto vs. CarPlay** comparison.

## Why

Developer docs for the two platforms are written independently, in different styles, with no comparison view. This agent closes that gap: one question in, one comparison page out.

## Architecture

- **Ingestion (one-time, done outside the agent):** source doc pages are scraped and saved as clean Markdown/text files under `docs/android-auto/` and `docs/carplay/`, then uploaded to the agent's knowledge base via `lua resources`.
- **Retrieval:** Lua's built-in RAG feature (`lua features enable --feature-name rag`) — not a custom search tool.
- **Answer + page generation:** a single custom tool (`generate_comparison_page`) that retrieves from the knowledge base, calls the model to write the comparison, renders HTML, and returns a link to the generated page.
- No jobs, webhooks, or workflows — this is single-tool-call Q&A, intentionally kept minimal for the hackathon scope.

See the `lua-agent-builder` plugin skills (`.agents/skills/`, symlinked for Claude Code under `.claude/skills/`) for the build tooling this project uses: `lua-init`, `lua-new`, `lua-test`, `lua-push`, `lua-deploy`, etc.

## Status

- [x] Lua account authenticated, lua-cli installed
- [x] Agent-builder skills/plugin installed
- [x] Doc pages scraped (65 files: `docs/android-auto/`, `docs/carplay/`)
- [x] Agent project scaffolded (`lua-init` — agent `car-docs-rag`, org `lua-hackathon`)
- [ ] Doc pages uploaded as resources
- [ ] `generate_comparison_page` tool built and tested
- [ ] End-to-end sandbox demo

## Project layout

```
docs/
  android-auto/   # 39 scraped Android Auto / Automotive OS doc pages (Markdown)
  carplay/        # 26 scraped Apple CarPlay doc pages + Developer Guide PDF (Markdown)
src/
  index.ts        # the LuaAgent definition (persona, skills, model)
lua.skill.yaml    # CLI-managed state (agentId/orgId, versions) — do not hand-edit
```

## Getting started

```bash
# install the CLI (already done in this project)
npm install -g lua-cli@latest

# authenticate (interactive, run in your own terminal)
lua auth configure

# check status
lua status --json --ci
```

Local iteration loop once a tool exists:

```bash
lua compile
lua test skill --name generate_comparison_page --input '{"question":"..."}'
lua chat --ci -e sandbox -m "Compare how Android Auto and CarPlay handle navigation UI" -t demo-1
```

## Out of scope

- Keeping the documentation fresh / re-crawling on updates.
- Authentication, multi-user state, or production deployment (this is a sandbox demo for the hackathon).
