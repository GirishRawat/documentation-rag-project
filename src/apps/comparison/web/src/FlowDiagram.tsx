export type FlowSpec = {
  title: string;
  steps: { label: string; side: 'android' | 'carplay' | 'both' }[];
};

const SIDE_COLOR: Record<FlowSpec['steps'][number]['side'], string> = {
  android: '#3ddc84',
  carplay: '#1a73e8',
  both: '#5f6368',
};

export function FlowDiagram({ spec }: { spec: FlowSpec }) {
  const boxH = 46;
  const gap = 28;
  const w = 560;
  const svgH = spec.steps.length * (boxH + gap) - gap;

  return (
    <div className="chart-card">
      <div className="chart-title">{spec.title}</div>
      <svg viewBox={`0 0 ${w} ${svgH}`} width="100%" height={svgH} role="img" aria-label={spec.title}>
        <defs>
          <marker id="flowah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill="#5f6368" />
          </marker>
        </defs>
        {spec.steps.map((step, i) => {
          const y = i * (boxH + gap);
          const color = SIDE_COLOR[step.side];
          return (
            <g key={i}>
              <rect x={0} y={y} width={w} height={boxH} rx="12" fill="#f8f9fa" stroke="#dadce0" />
              <rect x={0} y={y} width={5} height={boxH} rx="2" fill={color} />
              <text x={20} y={y + boxH / 2 + 5} fontSize="13" fill="#202124" fontFamily="Roboto, Arial, sans-serif">
                {i + 1}. {step.label}
              </text>
              {i < spec.steps.length - 1 && (
                <line x1={w / 2} y1={y + boxH} x2={w / 2} y2={y + boxH + gap} stroke="#5f6368" strokeWidth="1.3" markerEnd="url(#flowah)" />
              )}
            </g>
          );
        })}
      </svg>
      <div className="chart-legend">
        <span>
          <span className="sw" style={{ background: SIDE_COLOR.android }} />
          Android Auto
        </span>
        <span>
          <span className="sw" style={{ background: SIDE_COLOR.carplay }} />
          Apple CarPlay
        </span>
        <span>
          <span className="sw" style={{ background: SIDE_COLOR.both }} />
          Both
        </span>
      </div>
    </div>
  );
}
