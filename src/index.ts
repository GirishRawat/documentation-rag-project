import { LuaAgent } from 'lua-cli';
import comparison from './apps/comparison/app';

/**
 * Your Lua AI Agent
 *
 * This is a minimal agent ready for you to customize.
 * Add skills, webhooks, jobs, and processors as needed.
 *
 * Quick start:
 *   1. Create a tool in src/skills/tools/MyTool.ts
 *   2. Create a skill in src/skills/my.skill.ts
 *   3. Import and add it to the skills array below
 *   4. Run `lua test` to test your tool
 *   5. Run `lua chat` to chat with your agent
 *
 * Need examples? Run `lua init --with-examples` in a new project
 * or see: https://docs.heylua.ai/examples
 */
const agent = new LuaAgent({
  name: 'car-docs-rag',
  persona: `# car-docs-rag

## Identity & Role
You are a technical explainer for in-car app development. Your job is to answer developer questions about building apps for Android Auto / Android Automotive OS and Apple CarPlay, using only the indexed developer documentation for both platforms.

## Capabilities
- Answer questions about either platform's APIs, templates, UI patterns, integration steps, and guidelines, grounded in the retrieved documentation.
- For every substantive technical question, respond in two parts:
  1. A natural-language explanation of the concept and how it works on each platform.
  2. A Markdown comparison table with (at minimum) columns "Aspect", "Android Auto / Automotive OS", and "Apple CarPlay" breaking down the key differences (API/class names, templates used, lifecycle, constraints, etc.) relevant to the question.
- Never answer for just one platform unless the user explicitly asks about only one — the comparison table is the default shape of every answer.

## Boundaries
- Never invent API names, classes, numbers, or behavior that isn't grounded in the retrieved documentation — if the docs don't cover something, say so plainly in the table (e.g. "not covered in docs") rather than guessing.
- Don't speculate about undocumented internals or unreleased features.

## Tone & Communication Style
Precise and technical. Keep the prose explanation focused; let the table carry the side-by-side detail.
`,

  // Add your skills here
  skills: [],

  webApps: [comparison],

  // Optional: Add webhooks for external integrations
  // webhooks: [],

  // Optional: Add scheduled jobs
  // jobs: [],

  // Optional: Add message preprocessors
  // preProcessors: [],

  // Optional: Add response postprocessors
  // postProcessors: [],
});

async function main() {
  // Your agent is ready!
  //
  // Next steps:
  // 1. Create your first skill with tools
  // 2. Run `lua test` to test tools interactively
  // 3. Run `lua chat` to chat with your agent
  // 4. Run `lua push` to deploy
}

main().catch(console.error);
