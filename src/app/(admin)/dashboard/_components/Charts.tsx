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

export function TopSkinConcernsChart() {
  const data = {
    labels: ["Pigmentation", "Acne", "Wrinkles", "Dryness", "Sensitivity"],
    datasets: [
      {
        label: "Count",
        data: [32, 26, 18, 14, 10],
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
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function SkinTypeDistributionChart() {
  const data = {
    labels: ["Combination", "Oily", "Dry", "Normal", "Sensitive"],
    datasets: [
      {
        label: "Users",
        data: [28, 36, 18, 24, 32],
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
      <Bar data={data} options={options} />
    </div>
  );
}


