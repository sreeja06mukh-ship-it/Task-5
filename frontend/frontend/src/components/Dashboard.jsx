import { useEffect, useState } from "react";
import { getMonthlySummary } from "../services/expenseService";
import ExpensePieChart from "./ExpensePieChart";

function Dashboard({ refreshDashboard }) {
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [month, setMonth] = useState("2026-06");
  const [totalExpense, setTotalExpense] = useState(0);

const [transactionCount, setTransactionCount] = useState(0);

const [topCategory, setTopCategory] = useState("-");

const [averageExpense, setAverageExpense] = useState(0);

  useEffect(() => {
    getMonthlySummary(month)
      .then((data) => {
        console.log("Summary Data:", data);

        setSummary(data);
        setChartData(data);
        const total = data.reduce(
  (sum, item) => sum + item.amount,
  0
);

setTotalExpense(total);

setTransactionCount(data.length);

if (data.length > 0) {
  const highest = data.reduce((a, b) =>
    a.amount > b.amount ? a : b
  );

  setTopCategory(highest.category);

  setAverageExpense(
    (total / data.length).toFixed(2)
  );
}
else {
  setTopCategory("-");
  setAverageExpense(0);
}
      })
      .catch((error) => {
        console.error("Error fetching summary:", error);
      });
}, [month, refreshDashboard]);

  return (
  <div className="section">
    <h2 className="section-title">
        Expense Dashboard
    </h2>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    margin: "25px 0",
  }}
>

  <div className="stat-card">
    <h4>💰 Total Expense</h4>
    <h2>₹{totalExpense}</h2>
  </div>

  <div className="stat-card">
    <h4>🧾 Transactions</h4>
    <h2>{transactionCount}</h2>
  </div>

  <div className="stat-card">
    <h4>🏆 Top Category</h4>
    <h2>{topCategory}</h2>
  </div>

  <div className="stat-card">
    <h4>📊 Average</h4>
    <h2>₹{averageExpense}</h2>
  </div>

</div>

<h3>Category Totals</h3>

{summary.length > 0 ? (
  <>
    {summary.map((item) => (
      <p key={item.category}>
        <strong>{item.category}</strong>: ₹{item.amount}
      </p>
    ))}

    <ExpensePieChart data={chartData} />
  </>
) : (
  <div className="empty-state">
    <h2>📊</h2>
    <h3>No expenses found</h3>
    <p>Upload a receipt or choose another month.</p>
  </div>
)}

</div>
);
}

export default Dashboard;