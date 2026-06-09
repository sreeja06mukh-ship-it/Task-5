import { useEffect, useState } from "react";

function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

const recordsPerPage = 10;

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

    setCurrentPage(1);
    fetchExpenses(url);
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }
  
const filteredExpenses = expenses.filter((expense) => {
  const search = searchTerm.toLowerCase();

  return (
    expense.category.toLowerCase().includes(search) ||
    expense.description.toLowerCase().includes(search)
  );
});

const lastIndex = currentPage * recordsPerPage;

const firstIndex = lastIndex - recordsPerPage;

const currentExpenses = filteredExpenses.slice(
  firstIndex,
  lastIndex
);

const totalPages = Math.ceil(
  filteredExpenses.length / recordsPerPage
);

  return (
    <div>
      <h2>Transactions</h2>
      <div style={{ marginBottom: "15px" }}>
  <input
    type="text"
    placeholder="Search by category or description..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
    style={{
      width: "300px",
      padding: "8px",
    }}
  />
</div>

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
          {currentExpenses.map((expense) => (
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
      <div style={{ marginTop: "20px" }}>
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span style={{ margin: "0 15px" }}>
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>
    </div>
  );
}

export default Transactions;