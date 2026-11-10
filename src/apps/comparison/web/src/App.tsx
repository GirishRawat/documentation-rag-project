import { useState } from 'react';
import { lua } from '@lua-ai-global/app-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BarChart, type ChartSpec } from './BarChart';

function headerLooksLike(text: string, needle: string) {
  return text.toLowerCase().includes(needle);
}

type CompareResponse = { answer: string; chart: ChartSpec | null };

export function App() {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState<string>();
  const [chartSpec, setChartSpec] = useState<ChartSpec | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const ask = () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(undefined);
    setAsked(question);
    lua
      .api<CompareResponse>('POST', '/compare', { question })
      .then((r) => {
        setAnswer(r.answer);
        setChartSpec(r.chart);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="gpage">
      <header className="appbar">
        <div className="appbar-inner">
          <div className="dots" aria-hidden="true">
            <span className="b" />
            <span className="r" />
            <span className="y" />
            <span className="g" />
          </div>
          <div className="appbar-title">
            Android Auto<span className="sep">vs</span>
            <span className="sub">Apple CarPlay</span>
          </div>
        </div>
      </header>

      <main>
        <h1 className="gtitle">{asked || 'Ask a developer question'}</h1>
        <p className="lede">
          Grounded in the official Android Auto / Android Automotive OS and Apple CarPlay developer documentation —
          every answer compares both platforms side by side.
        </p>
        <div className="meta-chips">
          <span className="chip android">
            <span className="dot" />
            Android Auto
          </span>
          <span className="chip apple">
            <span className="dot" />
            Apple CarPlay
          </span>
        </div>

        <div className="askcard">
          <textarea
            className="gask"
            rows={3}
            placeholder="e.g. How does each platform let a user search for a point of interest while driving?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) ask();
            }}
          />
          <button className="gask-btn" onClick={ask} disabled={loading || !question.trim()}>
            {loading ? 'Asking…' : 'Ask'}
          </button>
        </div>

        {error && (
          <div className="error-card">
            <p>{error}</p>
          </div>
        )}

        {chartSpec && <BarChart spec={chartSpec} />}

        {answer && !error && (
          <div className="answer">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                th({ children, ...props }) {
                  const text = String(children);
                  const cls = headerLooksLike(text, 'android') || headerLooksLike(text, 'automotive')
                    ? 'col-g'
                    : headerLooksLike(text, 'carplay') || headerLooksLike(text, 'apple')
                      ? 'col-a'
                      : undefined;
                  return (
                    <th className={cls} {...props}>
                      {children}
                    </th>
                  );
                },
              }}
            >
              {answer}
            </ReactMarkdown>
          </div>
        )}
      </main>
    </div>
  );
}
