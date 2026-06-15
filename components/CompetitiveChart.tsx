'use client';

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function CompetitiveChart() {
  const data = {
    datasets: [
      {
        label: 'Coursera',
        data: [{ x: 8, y: 6 }],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
      },
      {
        label: 'LinkedIn Learning',
        data: [{ x: 6, y: 7 }],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Pluralsight',
        data: [{ x: 7, y: 5 }],
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
        borderColor: 'rgb(251, 146, 60)',
      },
      {
        label: (process.env.APP_NAME || "Kairoo"),
        data: [{ x: 9, y: 4 }],
        backgroundColor: 'rgba(13, 148, 136, 0.2)',
        borderColor: 'rgb(13, 148, 136)',
        pointRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Feature Completeness →',
          color: '#fff',
        },
        min: 0,
        max: 10,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#fff' },
      },
      y: {
        title: {
          display: true,
          text: 'Price Level →',
          color: '#fff',
        },
        min: 0,
        max: 10,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#fff' },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#fff' },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': High Features, Competitive Price';
          },
        },
      },
    },
  };

  return (
    <div className="relative h-80 w-full">
      <Scatter data={data} options={options} />
    </div>
  );
}

