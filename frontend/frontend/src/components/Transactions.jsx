import { useEffect, useState } from "react";

function Transactions() {
  const [expenses, setExpenses] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses("https://api.sreeja.me/expenses");
  }, []);

  const handleFilter = () => {
    let url = "https://api.sreeja.me/expenses";

    if (fromDate || toDate) {
      url += `?from_date=${fromDate}&to_date=${toDate}`;
    }

    fetchExpenses(url);
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div>
      <h2>Transactions</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={handleFilter}
          style={{ marginLeft: "10px" }}
        >
          Filter
        </button>
      </div>

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