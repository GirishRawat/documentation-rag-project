import { useEffect, useState } from 'react';

const STAGES = [
  'Retrieving Android Auto documentation…',
  'Retrieving Apple CarPlay documentation…',
  'Comparing platform APIs and templates…',
  'Pulling reference screenshots…',
  'Building comparison table…',
  'Rendering page…',
];

export function GeneratingScreen({ durationMs = 6500 }: { durationMs?: number }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageMs = durationMs / STAGES.length;
    const stageTimer = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, stageMs);

    const start = Date.now();
    const progressTimer = setInterval(() => {
      setProgress(Math.min(100, ((Date.now() - start) / durationMs) * 100));
    }, 80);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, [durationMs]);

  return (
    <div className="generating-card">
      <div className="generating-spinner" aria-hidden="true" />
      <div className="generating-stage">{STAGES[stageIndex]}</div>
      <div className="generating-bar">
        <div className="generating-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
