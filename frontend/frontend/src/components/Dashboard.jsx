import { useEffect, useState } from "react";
import { getMonthlySummary } from "../services/expenseService";
import ExpensePieChart from "./ExpensePieChart";

function Dashboard() {
  const [summary, setSummary] = useState({});
  const [month, setMonth] = useState("2026-06");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getMonthlySummary(month)
      .then((data) => {
        console.log("Summary Data:", data);

        setSummary(data);

        const formatted = Object.entries(data).map(
          ([category, amount]) => ({
            category,
            amount,
          })
        );

        setChartData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching summary:", error);
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

      <h3>Category Totals</h3>

      {Object.keys(summary).length > 0 ? (
        <div>
          {Object.entries(summary).map(([category, amount]) => (
            <p key={category}>
              <strong>{category}</strong>: ₹{amount}
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