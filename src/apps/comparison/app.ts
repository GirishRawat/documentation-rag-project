import { AI, Agents, defineWebApp, route } from 'lua-cli';
import { z } from 'zod';

const extractionSchema = z.object({
  hasChart: z.boolean(),
  chartTitle: z.string().optional(),
  chartCategories: z.array(z.string()).optional(),
  chartSeries: z.array(z.object({ name: z.string(), values: z.array(z.number()) })).optional(),
  hasFlow: z.boolean(),
  flowTitle: z.string().optional(),
  flowSteps: z
    .array(
      z.object({
        label: z.string(),
        side: z.enum(['android', 'carplay', 'both']),
      }),
    )
    .optional(),
});

// AI.generate's structuredOutput.schema is a raw JSON Schema object (not a
// Zod schema) — this mirrors extractionSchema above; the parsed result is
// still run through extractionSchema.safeParse below since the runtime never
// validates it.
const extractionJsonSchema = {
  type: 'object',
  properties: {
    hasChart: { type: 'boolean' },
    chartTitle: { type: 'string' },
    chartCategories: { type: 'array', items: { type: 'string' } },
    chartSeries: {
      type: 'array',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, values: { type: 'array', items: { type: 'number' } } },
        required: ['name', 'values'],
      },
    },
    hasFlow: { type: 'boolean' },
    flowTitle: { type: 'string' },
    flowSteps: {
      type: 'array',
      items: {
        type: 'object',
        properties: { label: { type: 'string' }, side: { type: 'string', enum: ['android', 'carplay', 'both'] } },
        required: ['label', 'side'],
      },
    },
  },
  required: ['hasChart', 'hasFlow'],
} as const;

type Chart = { title: string; categories: string[]; series: { name: string; values: number[] }[] };
type Flow = { title: string; steps: { label: string; side: 'android' | 'carplay' | 'both' }[] };

/**
 * comparison — a Lua web app.
 *
 * The /compare route calls Agents.invoke on this same agent (auth.agentId),
 * which runs the agent's normal chat pipeline: persona + the platform's RAG
 * retrieval over the uploaded Android Auto / CarPlay knowledge base (which
 * includes real cited image URLs and source links). It then makes one more
 * AI.generate call to deterministically extract an optional chart and an
 * optional flow diagram — both restating numbers/steps already present in
 * the answer, never inventing new ones — rather than asking the chat persona
 * to remember secondary output formats on every turn. The page renders all
 * of it as a real webpage. No custom tool is involved — Agents.invoke and
 * AI.generate are composition primitives, not a LuaTool the chat LLM calls.
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
    // The knowledge base cites real screenshot URLs from these two docs
    // domains (Android Auto / Design for Driving) — CSP otherwise blocks
    // any image not from the app's own origin or the Lua CDN.
    csp: { imgSrc: ['https://developer.android.com', 'https://developers.google.com'] },
  },
  routes: {
    'POST /compare': route({
      description: "Ask a question; returns the agent's grounded answer (with inline images/sources), an optional chart, an optional flow diagram, and a comparison table",
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
          flow: z
            .object({
              title: z.string(),
              steps: z.array(z.object({ label: z.string(), side: z.enum(['android', 'carplay', 'both']) })),
            })
            .nullable(),
        }),
      },
      handler: async ({ body, auth }) => {
        const result = await Agents.invoke(auth.agentId, { prompt: body.question });
        const answer = result.text;

        let chart: Chart | null = null;
        let flow: Flow | null = null;
        try {
          // Fast, cheap, token-capped, and time-boxed: this is a secondary
          // enhancement — it must never hold up returning the main answer.
          const extraction = AI.generate({
            model: 'alibaba/qwen3.8-flash',
            maxOutputTokens: 500,
            system: [
              'You extract two OPTIONAL visualizations from a technical comparison answer. Never invent data not present in the text.',
              '',
              'CHART: only includable if BOTH "Android Auto" and "Apple CarPlay" have an explicit, literal number stated for that EXACT same metric (e.g. both state a max depth, or both state an item count for the same kind of list). Never include a category where only one platform has a stated number — do not fill in 0 or any placeholder for the missing side; leave that category out. Zero may only appear if the text literally states zero. Prefer 1-2 clean categories, or none, over guessing. If nothing qualifies, set hasChart to false.',
              '',
              'FLOW: only includable if the text describes an ordered sequence of steps (a numbered list, or a clear "first/then/finally" process) for how something works on at least one platform. Restate each step as a short label (a few words) with which platform it belongs to (android, carplay, or both if shared). Keep the original order. Use at most 8 steps. If the text has no clear ordered process, set hasFlow to false.',
            ].join('\n'),
            prompt: answer,
            structuredOutput: { schema: extractionJsonSchema },
          });
          const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
          const extracted = await Promise.race([extraction, timeout]);
          const parsed = extracted ? extractionSchema.safeParse(extracted.output) : undefined;

          if (parsed?.success) {
            const { hasChart, chartCategories, chartSeries, hasFlow, flowSteps } = parsed.data;

            if (hasChart && chartCategories?.length && chartSeries?.length) {
              const lengthsMatch = chartSeries.every((s) => s.values.length === chartCategories.length);
              if (lengthsMatch) {
                // Defense in depth against the model filling in a placeholder
                // 0 for a platform with no stated number: drop any category
                // where one series is 0 but the others at that index aren't.
                const keep = chartCategories.map((_, i) => {
                  const vals = chartSeries.map((s) => s.values[i]);
                  const mixedZero = vals.some((v) => v === 0) && !vals.every((v) => v === 0);
                  return !mixedZero;
                });
                const filteredCategories = chartCategories.filter((_, i) => keep[i]);
                if (filteredCategories.length > 0) {
                  chart = {
                    title: parsed.data.chartTitle ?? 'Comparison',
                    categories: filteredCategories,
                    series: chartSeries.map((s) => ({ name: s.name, values: s.values.filter((_, i) => keep[i]) })),
                  };
                }
              }
            }

            if (hasFlow && flowSteps?.length) {
              flow = { title: parsed.data.flowTitle ?? 'How it works', steps: flowSteps };
            }
          }
        } catch {
          chart = null;
          flow = null;
        }

        return { answer, chart, flow };
      },
    }),
  },
});
