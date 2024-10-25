import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useSIMStore from "../models/simulation/simulationStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SimulationChart() {
  // Process data for the line chart
  const simulationData = useSIMStore((state) => state.simulationTable);

  const lineChartData = {
    labels: simulationData.slice(1).map((row) => `Client ${row[0].v}`),
    datasets: [
      {
        label: "Arrival Time",
        data: simulationData.slice(1).map((row) => Number(row[2]?.v || 0)),
        borderColor: "#3b82f6", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.9)", // blue-500 with opacity
      },
      {
        label: "Service Begin Time",
        data: simulationData.slice(1).map((row) => Number(row[5]?.v || 0)),
        borderColor: "#10b981", // emerald-500
        backgroundColor: "rgba(16, 185, 129, 0.9)", // emerald-500 with opacity
      },
      {
        label: "Service End Time",
        data: simulationData.slice(1).map((row) => Number(row[7]?.v || 0)),
        borderColor: "#f59e0b", // amber-500
        backgroundColor: "rgba(245, 158, 11, 0.9)", // amber-500 with opacity
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Time-based Data Visualization",
        color: "#374151", // gray-700
      },
    },
    scales: {
      x: {
        type: "category" as const,
        grid: {
          color: "#e5e7eb", // gray-200
        },
        ticks: {
          color: "#4b5563", // gray-600
        },
      },
      y: {
        grid: {
          color: "#e5e7eb", // gray-200
        },
        ticks: {
          color: "#4b5563", // gray-600
        },
      },
    },
  };

  return (
    <div className="w-[89%] mx-auto my-10 flex flex-col gap-3">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Time-based Data
        </h2>
        <Line options={lineChartOptions} data={lineChartData} />
      </div>
    </div>
  );
}
