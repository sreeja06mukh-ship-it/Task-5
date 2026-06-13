import { useEffect, useState } from "react";
import { getMonthlySummary } from "../services/expenseService";
import ExpensePieChart from "./ExpensePieChart";

function Dashboard({ refreshDashboard }) {
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [month, setMonth] = useState("2026-06");

  useEffect(() => {
    getMonthlySummary(month)
      .then((data) => {
        console.log("Summary Data:", data);

        setSummary(data);
        setChartData(data);
      })
      .catch((error) => {
        console.error("Error fetching summary:", error);
      });
}, [month, refreshDashboard]);

  return (
    <div>
      <h2>Expense Dashboard</h2>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <h3>Category Totals</h3>

      {summary.length > 0 ? (
        <div>
          {summary.map((item) => (
            <p key={item.category}>
              <strong>{item.category}</strong>: ₹{item.amount}
            </p>
          ))}
        </div>
      ) : (
        <p>No expenses found for this month.</p>
      )}

      <ExpensePieChart data={chartData} />
    </div>
  );
}

export default Dashboard;