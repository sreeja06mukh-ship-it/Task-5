import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses().then(setExpenses);
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {expenses.map((expense) => (
        <div key={expense.id}>
          {expense.category} - ₹{expense.amount}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;