'use client';

import {
  Chart as ChartJS,
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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GrowthChartProps {
  labels: string[];
  totalUsers: number[];
  paidUsers: number[];
}

export default function GrowthChart({ labels, totalUsers, paidUsers }: GrowthChartProps) {
  const c = getChartColors();
  // series[0]=teal (Total Users), series[1]=navy (Paid Users).
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Users',
        data: totalUsers,
        borderColor: c.series[0],
        backgroundColor: c.seriesFill[0],
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Paid Users',
        data: paidUsers,
        borderColor: c.series[1],
        backgroundColor: c.seriesFill[1],
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: { color: c.grid },
        ticks: { color: c.mutedText },
      },
      y: {
        grid: { color: c.grid },
        ticks: { color: c.mutedText },
      },
    },
    plugins: {
      legend: {
        labels: { color: c.text },
      },
    },
  };

  return (
    <ChartCanvas
      type="line"
      data={data}
      options={options}
      ariaLabel="User growth over time comparing total users and paid users"
    />
  );
}
