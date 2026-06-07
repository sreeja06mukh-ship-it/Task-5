import { useEffect, useState } from "react";
import { getMonthlySummary } from "../services/expenseService";
import ExpensePieChart from "./ExpensePieChart";

function Dashboard() {
  const [summary, setSummary] = useState(null);

  const [month, setMonth] = useState("2026-06");

  const [chartData, setChartData] = useState([]);

  useEffect(() => {

    getMonthlySummary(month)
      .then((data) => {

console.log("Summary Data:", data);

      const formatted = Object.entries(data).map(
        ([category, amount]) => ({
          category,
          amount,
        })
      );

      setChartData(formatted);


        setChartData(formatted);

      });

  }, [month]);

  return (
    <div>

      <h2>Expense Dashboard</h2>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <ExpensePieChart data={chartData} />

    </div>
  );
}

export default Dashboard;