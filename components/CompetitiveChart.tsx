'use client';

import {
  Chart as ChartJS,
  ScatterController,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartCanvas from '@/components/charts/ChartCanvas';
import { getChartColors } from '@/components/charts/chart-theme';

ChartJS.register(
  ScatterController,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function CompetitiveChart() {
  const c = getChartColors();
  // Brand (Kairoo) uses the teal series[0]; competitors use the remaining ramps.
  const data = {
    datasets: [
      {
        label: 'Coursera',
        data: [{ x: 8, y: 6 }],
        backgroundColor: c.seriesFill[1],
        borderColor: c.series[1],
      },
      {
        label: 'LinkedIn Learning',
        data: [{ x: 6, y: 7 }],
        backgroundColor: c.seriesFill[3],
        borderColor: c.series[3],
      },
      {
        label: 'Pluralsight',
        data: [{ x: 7, y: 5 }],
        backgroundColor: c.seriesFill[2],
        borderColor: c.series[2],
      },
      {
        label: 'Kairoo',
        data: [{ x: 9, y: 4 }],
        backgroundColor: c.seriesFill[0],
        borderColor: c.series[0],
        pointRadius: 8,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Feature Completeness →',
          color: c.text,
        },
        min: 0,
        max: 10,
        grid: { color: c.grid },
        ticks: { color: c.mutedText },
      },
      y: {
        title: {
          display: true,
          text: 'Price Level →',
          color: c.text,
        },
        min: 0,
        max: 10,
        grid: { color: c.grid },
        ticks: { color: c.mutedText },
      },
    },
    plugins: {
      legend: {
        labels: { color: c.text },
      },
      tooltip: {
        callbacks: {
          label: function (context: { dataset: { label?: string } }) {
            return (context.dataset.label ?? '') + ': High Features, Competitive Price';
          },
        },
      },
    },
  };

  return (
    <ChartCanvas
      type="scatter"
      data={data}
      options={options}
      ariaLabel="Competitive positioning: feature completeness versus price level across learning platforms"
    />
  );
}
