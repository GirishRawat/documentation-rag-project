import { useState } from 'react';
import { Button } from '@lua-ai-global/ui/button';
import { Card } from '@lua-ai-global/ui/card';
import { lua } from '@lua-ai-global/app-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const ask = () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(undefined);
    lua
      .api<{ answer: string }>('POST', '/compare', { question })
      .then((r) => setAnswer(r.answer))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="space-y-4 p-6">
          <h1 className="text-xl font-semibold">Android Auto vs CarPlay</h1>
          <p className="text-muted-foreground">
            Ask a developer question about building apps for Android Auto / Android Automotive OS or Apple CarPlay.
            The agent answers grounded in its indexed documentation, with a side-by-side comparison table.
          </p>
          <textarea
            className="w-full rounded-md border border-border bg-card p-3 text-sm text-foreground"
            rows={3}
            placeholder="e.g. How does each platform let a user search for a point of interest while driving?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) ask();
            }}
          />
          <Button onClick={ask} disabled={loading || !question.trim()}>
            {loading ? 'Asking…' : 'Ask'}
          </Button>
        </Card>

        {error && (
          <Card className="p-6 text-destructive">
            <p>{error}</p>
          </Card>
        )}

        {answer && !error && (
          <Card className="markdown-answer p-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
          </Card>
        )}
      </div>
    </main>
  );
}
