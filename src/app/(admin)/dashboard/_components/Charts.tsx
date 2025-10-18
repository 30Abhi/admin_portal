"use client";

import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface TopSkinConcernsChartProps {
  data: number[];
}

export function TopSkinConcernsChart({ data }: TopSkinConcernsChartProps) {
  const chartData = {
    labels: ["Pigmentation", "Acne", "Wrinkles", "Dryness", "Sensitivity"],
    datasets: [
      {
        label: "Count",
        data: data,
        backgroundColor: ["#c9c5ff", "#a998ff", "#8e74ff", "#b7a6ff", "#e2ddff"],
        borderWidth: 0,
      },
    ],
  };
  const options = {
    cutout: "60%",
    plugins: { 
      legend: { 
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 8,
          font: {
            size: 11
          }
        }
      } 
    },
    maintainAspectRatio: false,
    responsive: true,
  };
  return (
    <div className="h-64 w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

interface SkinTypeDistributionChartProps {
  data: number[];
}

export function SkinTypeDistributionChart({ data }: SkinTypeDistributionChartProps) {
  const chartData = {
    labels: ["Combination", "Oily", "Dry", "Normal", "Sensitive"],
    datasets: [
      {
        label: "Users",
        data: data,
        backgroundColor: "#8e74ff",
        borderRadius: 6,
      },
    ],
  };
  const options = {
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { stepSize: 10 }, grid: { color: "#f2f2f2" } }, x: { grid: { display: false } } },
    maintainAspectRatio: false,
    responsive: true,
  };
  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}


