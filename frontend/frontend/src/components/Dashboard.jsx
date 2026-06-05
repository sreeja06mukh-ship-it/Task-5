import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";
import ExpensePieChart from "./ExpensePieChart";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses().then(setExpenses);
  }, []);

  const summary = {};

  expenses.forEach((expense) => {
    if (!summary[expense.category]) {
      summary[expense.category] = 0;
    }

    summary[expense.category] += expense.amount;
  });

  const chartData = Object.entries(summary).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  const totalSpend = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div>
      <h2>Expense Dashboard</h2>

      <h3>Total Spend: ₹{totalSpend}</h3>

      <ExpensePieChart data={chartData} />
    </div>
  );
}

export default Dashboard;