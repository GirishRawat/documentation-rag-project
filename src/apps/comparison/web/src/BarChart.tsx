export type ChartSpec = {
  title: string;
  categories: string[];
  series: { name: string; values: number[] }[];
};

const COLORS = ['#3ddc84', '#1a73e8', '#fbbc05', '#ea4335'];

export function BarChart({ spec }: { spec: ChartSpec }) {
  const max = Math.max(1, ...spec.series.flatMap((s) => s.values));
  const rowH = 28;
  const gap = 6;
  const groupGap = 18;
  const barsPerCat = spec.series.length;
  const groupH = barsPerCat * (rowH + gap) + groupGap;
  const chartW = 520;
  const labelW = 170;
  const barAreaW = chartW - labelW;
  const svgH = spec.categories.length * groupH;

  return (
    <div className="chart-card">
      <div className="chart-title">{spec.title}</div>
      <div className="chart-legend">
        {spec.series.map((s, i) => (
          <span key={s.name}>
            <span className="sw" style={{ background: COLORS[i % COLORS.length] }} />
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${chartW} ${svgH}`} width="100%" height={svgH} role="img" aria-label={spec.title}>
        {spec.categories.map((cat, ci) => {
          const groupY = ci * groupH;
          return (
            <g key={cat}>
              {spec.series.map((s, si) => {
                const value = s.values[ci] ?? 0;
                const barW = (value / max) * (barAreaW - 40);
                const y = groupY + si * (rowH + gap);
                return (
                  <g key={s.name}>
                    <rect x={labelW} y={y} width={Math.max(2, barW)} height={rowH - 4} rx="4" fill={COLORS[si % COLORS.length]} />
                    <text x={labelW + Math.max(2, barW) + 8} y={y + rowH / 2 + 4} fontSize="12" fill="#202124" fontFamily="Roboto, Arial, sans-serif">
                      {value}
                    </text>
                  </g>
                );
              })}
              <text x={0} y={groupY + (groupH - groupGap) / 2 + 4} fontSize="12.5" fill="#202124" fontWeight="500" fontFamily="Roboto, Arial, sans-serif">
                {cat}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
