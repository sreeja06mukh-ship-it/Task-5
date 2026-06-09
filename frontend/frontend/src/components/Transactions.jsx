import { useEffect, useState } from "react";

function Transactions() {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date_desc");
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

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this expense?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await fetch(
      `https://api.sreeja.me/expenses/${id}`,
      {
        method: "DELETE",
      }
    );

    setExpenses(
      expenses.filter(
        (expense) => expense.id !== id
      )
    );
  } catch (error) {
    console.error(error);
    alert("Failed to delete expense.");
  }
};

  const handleFilter = () => {
    let url = "https://api.sreeja.me/expenses";

    if (fromDate || toDate) {
      url += `?from_date=${fromDate}&to_date=${toDate}`;
    }

    setCurrentPage(1);
    fetchExpenses(url);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      expense.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      expense.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  let sortedExpenses = [...filteredExpenses];

  switch (sortBy) {
    case "date_desc":
      sortedExpenses.sort(
        (a, b) =>
          new Date(b.expense_date) -
          new Date(a.expense_date)
      );
      break;

    case "date_asc":
      sortedExpenses.sort(
        (a, b) =>
          new Date(a.expense_date) -
          new Date(b.expense_date)
      );
      break;

    case "amount_desc":
      sortedExpenses.sort(
        (a, b) => b.amount - a.amount
      );
      break;

    case "amount_asc":
      sortedExpenses.sort(
        (a, b) => a.amount - b.amount
      );
      break;

    default:
      break;
  }

  const totalPages = Math.ceil(
    sortedExpenses.length / recordsPerPage
  );

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const currentExpenses = sortedExpenses.slice(
    firstIndex,
    lastIndex
  );

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Category",
      "Amount",
      "Description",
      "Source",
    ];

    const rows = sortedExpenses.map((expense) => [
      expense.expense_date,
      expense.category,
      expense.amount,
      expense.description,
      expense.source,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div>
      <h2>Transactions</h2>

      <button
        onClick={handleExportCSV}
        style={{
          marginBottom: "15px",
          padding: "8px 15px",
          cursor: "pointer",
        }}
      >
        Export CSV
      </button>


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

      <div style={{ marginBottom: "10px" }}>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Utilities">Utilities</option>
          <option value="Health">Health</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
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

      <div style={{ marginBottom: "20px" }}>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">
            Amount: High → Low
          </option>
          <option value="amount_asc">
            Amount: Low → High
          </option>
        </select>
      </div>

      <table border="1" cellPadding="10">
        <thead>

<tr>
  <th>Date</th>
  <th>Category</th>
  <th>Amount</th>
  <th>Description</th>
  <th>Source</th>
  <th>Action</th>
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

  <td>
    <button
      onClick={() =>
        handleDelete(expense.id)
      }
    >
      Delete
    </button>
  </td>
</tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span style={{ margin: "0 15px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Transactions;
