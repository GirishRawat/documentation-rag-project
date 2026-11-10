import { Agents, defineWebApp, route } from 'lua-cli';
import { z } from 'zod';

/**
 * comparison — a Lua web app.
 *
 * The /compare route calls Agents.invoke on this same agent (auth.agentId),
 * which runs the agent's normal chat pipeline: persona + the platform's RAG
 * retrieval over the uploaded Android Auto / CarPlay knowledge base. The page
 * then renders that answer (explanation + Markdown comparison table) as a
 * real webpage. No custom tool is involved — this route is the only code
 * path, composing with the agent via Agents.invoke rather than exposing a
 * tool the chat LLM would call.
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
      description: 'Ask a question; returns the agent\'s grounded answer with an Android Auto vs CarPlay comparison table',
      body: z.object({ question: z.string().min(1).max(2000) }),
      responses: { 200: z.object({ answer: z.string() }) },
      handler: async ({ body, auth }) => {
        const result = await Agents.invoke(auth.agentId, { prompt: body.question });
        return { answer: result.text };
      },
    }),
  },
});
