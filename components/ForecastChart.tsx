'use client';

import {
  Chart as ChartJS,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import ChartCanvas from '@/components/charts/ChartCanvas';
import { getChartColors } from '@/components/charts/chart-theme';

ChartJS.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ForecastChart() {
  const c = getChartColors();
  // series[0]=teal (Total Users), series[1]=navy (Paid Users), series[2]=amber (MRR).
  const amber = c.series[2];

  const data = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 6', 'Month 9', 'Month 12'],
    datasets: [
      {
        label: 'Total Users',
        data: [1250, 2800, 8250, 25000, 62000, 125000],
        borderColor: c.series[0],
        backgroundColor: c.seriesFill[0],
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Paid Users',
        data: [125, 336, 1049, 3247, 7891, 15234],
        borderColor: c.series[1],
        backgroundColor: c.seriesFill[1],
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'MRR ($K)',
        data: [3.6, 9.7, 30.4, 94.2, 228.8, 441.8],
        borderColor: amber,
        backgroundColor: c.seriesFill[2],
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: { color: c.grid },
        ticks: { color: c.mutedText },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: { color: c.grid },
        ticks: { color: c.mutedText },
        title: {
          display: true,
          text: 'Users',
          color: c.text,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: { color: amber },
        title: {
          display: true,
          text: 'MRR ($K)',
          color: amber,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: { color: c.text },
      },
      tooltip: {
        backgroundColor: c.tooltipBg,
        titleColor: c.tooltipText,
        bodyColor: c.tooltipText,
      },
    },
  };

  return (
    <ChartCanvas
      type="line"
      data={data}
      options={options}
      ariaLabel="Growth forecast over twelve months: total users, paid users, and monthly recurring revenue"
    />
  );
}
