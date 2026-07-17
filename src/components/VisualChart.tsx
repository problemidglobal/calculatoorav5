import React from 'react';

interface ChartItem {
  name: string;
  value: number;
  color?: string;
}

interface VisualChartProps {
  data: ChartItem[];
  title?: string;
}

export default function VisualChart({ data, title = 'Visual Breakdown' }: VisualChartProps) {
  // Gracefully handle both array data format and legacy object data format
  let chartItems: ChartItem[] = [];
  if (Array.isArray(data)) {
    chartItems = data;
  } else if (data && typeof data === 'object') {
    const rawObj = data as any;
    if (Array.isArray(rawObj.labels) && Array.isArray(rawObj.values)) {
      chartItems = rawObj.labels.map((label: string, index: number) => ({
        name: label,
        value: Number(rawObj.values[index]) || 0,
        color: Array.isArray(rawObj.colors) ? rawObj.colors[index] : undefined
      }));
    }
  }

  if (chartItems.length === 0) return null;

  const total = chartItems.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;

  // Let's compute stroke details for a circular donut chart
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  // Transform legacy brand green into our premium neon blue/cyan themes
  const getMappedColor = (color: string | undefined, idx: number): string => {
    if (!color) {
      const defaultColors = ['#00f0ff', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
      return defaultColors[idx % defaultColors.length];
    }
    const c = color.toLowerCase().trim();
    if (
      c === '#39ff14' || 
      c === '#57ff38' || 
      c === '#10b981' || 
      c === '#2cde15' || 
      c === '#1bba07' || 
      c === '#22c55e' || 
      c === '#65a30d' ||
      c === '#84cc16'
    ) {
      return '#00f0ff'; // Premium Electric Cyan
    }
    if (c === '#3b82f6' || c === '#1d4ed8') {
      return '#3b82f6'; // Bright Electric Royal Blue
    }
    return color;
  };

  return (
    <div className="p-6 rounded-[32px] border border-white/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-md shadow-2xl transition-all duration-300">
      <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
        {title}
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        {/* SVG Donut Visualizer */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="fill-none stroke-neutral-100 dark:stroke-neutral-800"
              strokeWidth="14"
            />
            {chartItems.map((item, idx) => {
              const val = item.value || 0;
              const percent = val / total;
              const strokeLength = percent * circumference;
              const strokeOffset = circumference - (accumulatedPercent * circumference);
              accumulatedPercent += percent;

              const mappedColor = getMappedColor(item.color, idx);

              return (
                <circle
                  key={idx}
                  cx="60"
                  cy="60"
                  r={radius}
                  className="fill-none transition-all duration-1000 ease-out"
                  stroke={mappedColor}
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          {/* Inner stats readout */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase">
              Sum Totals
            </span>
            <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100 tracking-tight">
              {total >= 1000000 
                ? `$${(total / 1000000).toFixed(1)}M` 
                : total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend Stack list */}
        <div className="flex-1 w-full space-y-3.5">
          {chartItems.map((item, idx) => {
            const val = item.value || 0;
            const pct = ((val / total) * 100).toFixed(1);
            const mappedColor = getMappedColor(item.color, idx);

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                      style={{ backgroundColor: mappedColor }}
                    />
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-neutral-500 dark:text-neutral-400">
                    {val.toLocaleString()} ({pct}%)
                  </span>
                </div>
                {/* Horizontal progress bar mapping */}
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800/85 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${pct}%`, 
                      backgroundColor: mappedColor,
                      boxShadow: `0 0 10px ${mappedColor}50`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

