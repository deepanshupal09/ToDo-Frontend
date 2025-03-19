// components/DonutCharts.tsx
"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from "chart.js";
import { TaskIcon } from "@/app/assets/icons";

interface DonutChartsProps {
  completedCount: number;
  pendingCount: number;
}

ChartJS.register(ArcElement, Tooltip, Legend);

// Global plugin for drawing center text on the donut charts.
const centerTextPlugin: Plugin = {
  id: "centerTextPlugin",
  beforeDraw(chart) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const centerText = (chart.options as any).centerText as string;
    if (centerText) {
      ctx.save();
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(centerText, width / 2, height / 2);
      ctx.restore();
    }
  },
};
ChartJS.register(centerTextPlugin);

const DonutCharts = ({ completedCount, pendingCount }: DonutChartsProps) => {
  const totalTasks = completedCount + pendingCount;
  const completedPercentage = totalTasks
    ? Math.round((completedCount / totalTasks) * 100)
    : 0;
  const pendingPercentage = totalTasks
    ? Math.round((pendingCount / totalTasks) * 100)
    : 0;

  const completedData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        label: "Completed",
        data: [completedCount, pendingCount],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  const pendingData = {
    labels: ["Pending", "Remaining"],
    datasets: [
      {
        label: "Pending",
        data: [pendingCount, completedCount],
        backgroundColor: ["#F44336", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions: ChartOptions<"doughnut"> & { centerText?: string } = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="my-8 p-4 border max-lg:w-full rounded-2xl shadow-md">
      <div className="inline-flex gap-x-3 text-red-500 font-medium mt-2">
        <TaskIcon /> Task Status
      </div>
      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="flex flex-col items-center">
          <div style={{ width: 160, height: 160 }}>
            <Doughnut
              data={completedData}
              options={{
                ...donutOptions,
                centerText: `${completedPercentage}%`,
              } as never}
            />
          </div>
          <div className="text-center mt-2">
            <span className="font-medium text-green-600">Completed</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div style={{ width: 160, height: 160 }}>
            <Doughnut
              data={pendingData}
              options={{
                ...donutOptions,
                centerText: `${pendingPercentage}%`,
              } as never}
            />
          </div>
          <div className="text-center mt-2">
            <span className="font-medium text-red-600">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutCharts;
