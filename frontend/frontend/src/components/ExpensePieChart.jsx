import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ExpensePieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          outerRadius={120}
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}