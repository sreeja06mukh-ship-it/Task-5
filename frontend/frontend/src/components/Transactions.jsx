import { useEffect, useState } from "react";

function Transactions() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("https://api.sreeja.me/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Transactions</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Source</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.expense_date}</td>
              <td>{expense.category}</td>
              <td>₹{expense.amount}</td>
              <td>{expense.description}</td>
               <td>{expense.source}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;