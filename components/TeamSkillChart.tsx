'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartCanvas from '@/components/charts/ChartCanvas';
import { getChartColors } from '@/components/charts/chart-theme';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function TeamSkillChart() {
  const c = getChartColors();
  // series[0]=teal (Team Average), series[1]=navy (Industry Benchmark).
  const data = {
    labels: ['AI/ML', 'Leadership', 'Technical Skills', 'Communication', 'Strategy', 'Innovation'],
    datasets: [
      {
        label: 'Team Average',
        data: [85, 75, 90, 80, 70, 85],
        fill: true,
        backgroundColor: c.seriesFill[0],
        borderColor: c.series[0],
        pointBackgroundColor: c.series[0],
      },
      {
        label: 'Industry Benchmark',
        data: [70, 80, 85, 75, 75, 70],
        fill: true,
        backgroundColor: c.seriesFill[1],
        borderColor: c.series[1],
        pointBackgroundColor: c.series[1],
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: c.grid },
        grid: { color: c.grid },
        pointLabels: { color: c.text, font: { size: 12 } },
        ticks: {
          color: c.mutedText,
          // No solid backdrop behind the radial tick numbers (reads on any surface).
          showLabelBackdrop: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: c.text },
      },
    },
  };

  return (
    <ChartCanvas
      type="radar"
      data={data}
      options={options}
      ariaLabel="Team skills radar comparing team average against the industry benchmark across AI/ML, leadership, technical skills, communication, strategy, and innovation"
    />
  );
}
