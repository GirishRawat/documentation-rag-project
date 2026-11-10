import { useState } from 'react';
import { lua } from '@lua-ai-global/app-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BarChart, type ChartSpec } from './BarChart';
import { FlowDiagram, type FlowSpec } from './FlowDiagram';
import { GeneratingScreen } from './GeneratingScreen';
import { DEMO_HTML, DEMO_QUESTION } from './demoContent';
import './demoContent.css';

const DEMO_GENERATE_MS = 6800;

function headerLooksLike(text: string, needle: string) {
  return text.toLowerCase().includes(needle);
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[?.!]+$/, '');
}

type CompareResponse = { answer: string; chart: ChartSpec | null; flow: FlowSpec | null };

export function App() {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState<string>();
  const [chartSpec, setChartSpec] = useState<ChartSpec | null>(null);
  const [flowSpec, setFlowSpec] = useState<FlowSpec | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [demoGenerating, setDemoGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const ask = () => {
    if (!question.trim()) return;
    setAsked(question);
    setError(undefined);

    // Known showcase question: fake a short "generating" sequence, then
    // reveal the curated reference page — no model call, so this is fully
    // deterministic and immune to live-demo flakiness. The delay is purely
    // theatrical (the page is already built locally).
    if (normalize(question) === DEMO_QUESTION) {
      setIsDemo(false);
      setDemoGenerating(true);
      setAnswer(undefined);
      setChartSpec(null);
      setFlowSpec(null);
      window.setTimeout(() => {
        setDemoGenerating(false);
        setIsDemo(true);
      }, DEMO_GENERATE_MS);
      return;
    }

    setIsDemo(false);
    setDemoGenerating(false);
    setLoading(true);
    lua
      .api<CompareResponse>('POST', '/compare', { question })
      .then((r) => {
        setAnswer(r.answer);
        setChartSpec(r.chart);
        setFlowSpec(r.flow);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="gpage" id="top">
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
        {!isDemo && (
          <>
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
          </>
        )}

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
          <button className="gask-btn" onClick={ask} disabled={loading || demoGenerating || !question.trim()}>
            {loading || demoGenerating ? 'Asking…' : 'Ask'}
          </button>
        </div>

        {error && (
          <div className="error-card">
            <p>{error}</p>
          </div>
        )}

        {demoGenerating && <GeneratingScreen durationMs={DEMO_GENERATE_MS} />}

        {isDemo && <div className="demo-embed" dangerouslySetInnerHTML={{ __html: DEMO_HTML }} />}

        {!isDemo && flowSpec && <FlowDiagram spec={flowSpec} />}
        {!isDemo && chartSpec && <BarChart spec={chartSpec} />}

        {!isDemo && answer && !error && (
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
                img({ alt, src }) {
                  return (
                    <figure className="docimg">
                      <img src={src} alt={alt ?? ''} loading="lazy" />
                      {alt && <figcaption>{alt}</figcaption>}
                    </figure>
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
