import { AI, Agents, defineWebApp, route } from 'lua-cli';
import { z } from 'zod';

const chartSchema = z.object({
  hasChart: z.boolean(),
  title: z.string().optional(),
  categories: z.array(z.string()).optional(),
  series: z
    .array(
      z.object({
        name: z.string(),
        values: z.array(z.number()),
      }),
    )
    .optional(),
});

// AI.generate's structuredOutput.schema is a raw JSON Schema object (not a Zod
// schema) — this mirrors chartSchema above; the parsed result is still run
// through chartSchema.safeParse below since the runtime never validates it.
const chartJsonSchema = {
  type: 'object',
  properties: {
    hasChart: { type: 'boolean' },
    title: { type: 'string' },
    categories: { type: 'array', items: { type: 'string' } },
    series: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          values: { type: 'array', items: { type: 'number' } },
        },
        required: ['name', 'values'],
      },
    },
  },
  required: ['hasChart'],
} as const;

/**
 * comparison — a Lua web app.
 *
 * The /compare route calls Agents.invoke on this same agent (auth.agentId),
 * which runs the agent's normal chat pipeline: persona + the platform's RAG
 * retrieval over the uploaded Android Auto / CarPlay knowledge base. It then
 * makes a second, separate AI.generate call to deterministically extract an
 * optional chart (a real numeric comparison already present in the answer,
 * never invented) as structured JSON, rather than asking the chat persona to
 * remember a secondary output format on every turn. The page renders both as
 * a real webpage. No custom tool is involved — Agents.invoke and AI.generate
 * are composition primitives, not a LuaTool the chat LLM would call.
 *
 *   lua apps dev comparison        pages with hot reload, routes run locally as you
 *   lua test webapp --name comparison --route 'POST /compare' --input '{"body":{"question":"How does each platform handle voice input?"}}'
 *   lua push webapp --name comparison
 */
export default defineWebApp({
  name: 'comparison',
  description: 'Android Auto vs CarPlay comparison pages',
  pages: {
    root: './web',
    nav: [{ path: '/', label: 'Compare' }],
  },
  routes: {
    'POST /compare': route({
      description: "Ask a question; returns the agent's grounded answer, an optional chart, and an Android Auto vs CarPlay comparison table",
      body: z.object({ question: z.string().min(1).max(2000) }),
      responses: {
        200: z.object({
          answer: z.string(),
          chart: z
            .object({
              title: z.string(),
              categories: z.array(z.string()),
              series: z.array(z.object({ name: z.string(), values: z.array(z.number()) })),
            })
            .nullable(),
        }),
      },
      handler: async ({ body, auth }) => {
        const result = await Agents.invoke(auth.agentId, { prompt: body.question });
        const answer = result.text;

        let chart: { title: string; categories: string[]; series: { name: string; values: number[] }[] } | null = null;
        try {
          // Fast, cheap, token-capped, and time-boxed: this is a secondary
          // enhancement — it must never hold up returning the main answer.
          const extraction = AI.generate({
            model: 'alibaba/qwen3.8-flash',
            maxOutputTokens: 300,
            system:
              'You extract chartable data from a technical comparison answer. A category is only includable if BOTH "Android Auto" and "Apple CarPlay" have an explicit, literal number stated for that EXACT same metric in the text (e.g. both state a max depth, or both state an item count for the same kind of list). Never include a category where only one platform has a stated number — do not fill in 0 or any other placeholder for the missing side; just leave that category out entirely. Zero may only appear if the text literally states the number zero for that platform. Prefer returning at most 1-2 clean categories, or none, over guessing. If no category has a literal number for both platforms, set hasChart to false and omit the other fields.',
            prompt: answer,
            structuredOutput: { schema: chartJsonSchema },
          });
          const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
          const extracted = await Promise.race([extraction, timeout]);
          const parsed = extracted ? chartSchema.safeParse(extracted.output) : undefined;
          if (parsed?.success && parsed.data.hasChart && parsed.data.categories?.length && parsed.data.series?.length) {
            const { categories, series } = parsed.data;
            const lengthsMatch = series.every((s) => s.values.length === categories.length);
            if (lengthsMatch) {
              // Defense in depth against the model filling in a placeholder 0
              // for a platform with no stated number: drop any category where
              // one series is 0 but the others at that index aren't — a real
              // documented zero would be 0 across the board, not mixed.
              const keep = categories.map((_, i) => {
                const vals = series.map((s) => s.values[i]);
                const mixedZero = vals.some((v) => v === 0) && !vals.every((v) => v === 0);
                return !mixedZero;
              });
              const filteredCategories = categories.filter((_, i) => keep[i]);
              if (filteredCategories.length > 0) {
                chart = {
                  title: parsed.data.title ?? 'Comparison',
                  categories: filteredCategories,
                  series: series.map((s) => ({ name: s.name, values: s.values.filter((_, i) => keep[i]) })),
                };
              }
            }
          }
        } catch {
          chart = null;
        }

        return { answer, chart };
      },
    }),
  },
});
