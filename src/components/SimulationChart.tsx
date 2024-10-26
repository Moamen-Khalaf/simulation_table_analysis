import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useSIMStore from "../models/simulation/simulationStore";
import type { cellType } from "../models/simulation/types";

function transformData(data: cellType[][]) {
  const chartData = data.slice(1).map((row, index) => {
    return {
      clientId: index + 1,
      customerArrivalTime: +row[2].v,
      customerServiceStartsTime: +row[5].v,
      customerWaitTime: isNaN(+row[8].v) ? 0 : +row[8].v,
      serverFreeTime: isNaN(+row[9].v) ? 0 : +row[9].v,
    };
  });
  return chartData;
}

const SimulationChart = () => {
  const rawData = useSIMStore((state) => state.simulationTable);
  const chartData = transformData(rawData);
  return rawData.length === 0 ? null : (
    <div className="px-4 my-10 mx-auto md:w-[80%]">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="clientId"
            label={{
              value: "Client ID",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            label={{ value: "Time (mins)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />

          {/* Line for customer arrival times */}
          <Line
            type="monotone"
            dataKey="customerArrivalTime"
            stroke="#1f77b4"
          />

          {/* Line for customer service start times */}
          <Line
            type="monotone"
            dataKey="customerServiceStartsTime"
            stroke="#ff7f0e"
          />

          {/* Line for customer wait times */}
          <Line
            type="monotone"
            dataKey="customerWaitTime"
            stroke="#2ca02c"
            activeDot={{ r: 8 }}
          />

          {/* Line for server free times */}
          <Line type="monotone" dataKey="serverFreeTime" stroke="#d62728" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimulationChart;
