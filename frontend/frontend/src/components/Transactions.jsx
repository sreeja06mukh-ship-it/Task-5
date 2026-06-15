import { useEffect, useState } from "react";

function Transactions({
  refreshDashboard,
  setRefreshDashboard,
}) {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpense, setEditingExpense] = useState(null);

const [editAmount, setEditAmount] = useState("");

const [editCategory, setEditCategory] = useState("");

const [editDescription, setEditDescription] = useState("");

const [editDate, setEditDate] = useState("");

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

const handleUpdate = async () => {
  try {
    const response = await fetch(
      `https://api.sreeja.me/expenses/${editingExpense.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(editAmount),
          category: editCategory,
          description: editDescription,
          expense_date: editDate,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Update failed");
    }

    alert("Expense updated successfully!");
    setRefreshDashboard((prev) => prev + 1);

    setEditingExpense(null);

    fetchExpenses("https://api.sreeja.me/expenses");
  } catch (error) {
    console.error(error);
    alert("Failed to update expense.");
  }
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
    <div className="section">
    <h2 className="section-title">
        Transaction History
    </h2>

      {editingExpense && (
  <div
    style={{
      border: "1px solid #ccc",
      padding: "15px",
      marginBottom: "20px",
      borderRadius: "8px",
    }}
  >
    <h3>Edit Expense</h3>

    <div style={{ marginBottom: "10px" }}>
      <label>Amount: </label>
      <div className="controls">
      <input
        type="number"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
      />
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>Category: </label>
      <select
        value={editCategory}
        onChange={(e) => setEditCategory(e.target.value)}
      >
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Utilities">Utilities</option>
        <option value="Health">Health</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Other</option>
      </select>
      </div>
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>Description: </label>
      <input
        type="text"
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
      />
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>Date: </label>
      <input
        type="date"
        value={editDate}
        onChange={(e) => setEditDate(e.target.value)}
      />
    </div>

    <button
  onClick={handleUpdate}
>
  Update Expense
</button>

    <button
      style={{ marginLeft: "10px" }}
      onClick={() => setEditingExpense(null)}
    >
      Cancel
    </button>
  </div>
)}

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
  <label
    style={{
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
    }}
  >
    Search Transactions
  </label>

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

<div style={{ marginBottom: "15px" }}>
  <label
    style={{
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
    }}
  >
    Filter by Category
  </label>

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

  <label
    style={{
      display: "block",
      fontWeight: "bold",
      marginBottom: "8px",
    }}
  >
    Choose Date Range
  </label>

  <span>From:</span>

<input
  type="date"
  value={fromDate}
  onChange={(e) => {
    setFromDate(e.target.value);

    let url = "https://api.sreeja.me/expenses";

    const newFrom = e.target.value;

    if (newFrom || toDate) {
      url += `?from_date=${newFrom}&to_date=${toDate}`;
    }

    setCurrentPage(1);
    fetchExpenses(url);
  }}
/>

  <span style={{ marginLeft: "20px" }}>
    To:
  </span>

<div className="filter-row">

  <input
  type="date"
  value={toDate}
  onChange={(e) => {
    setToDate(e.target.value);

    let url = "https://api.sreeja.me/expenses";

    const newTo = e.target.value;

    if (fromDate || newTo) {
      url += `?from_date=${fromDate}&to_date=${newTo}`;
    }

    setCurrentPage(1);
    fetchExpenses(url);
  }}
/>

<div
  className="sort-container"
  style={{
    textAlign: "center",
    margin: "25px 0",
  }}
>
  <label
    style={{
      fontWeight: "bold",
      display: "block",
      marginBottom: "8px",
    }}
  >
    Sort Transactions
    </label>

<select
  value={sortBy}
  onChange={(e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }}
  style={{
    width: "260px",
    padding: "10px",
    fontSize: "16px",
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
<div className="table-container">
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

{currentExpenses.length > 0 ? (

currentExpenses.map((expense) => (

<tr key={expense.id}>

<td>{expense.expense_date}</td>
<td>{expense.category}</td>
<td>₹{expense.amount}</td>
<td>{expense.description}</td>
<td>{expense.source}</td>

<td>
  <div className="action-buttons">

    <button
      onClick={() => {
        setEditingExpense(expense);

        setEditAmount(expense.amount);
        setEditCategory(expense.category);
        setEditDescription(expense.description);
        setEditDate(expense.expense_date);
      }}
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(expense.id)}
    >
      Delete
    </button>

  </div>
</td>

</tr>

))

) : (

<tr>

<td
colSpan="6"
style={{
textAlign: "center",
padding: "40px"
}}
>

<h2>📭</h2>

<h3>No transactions found</h3>

<p>
Try changing your filters or upload a receipt.
</p>

</td>

</tr>

)}

</tbody>
      </table>
      </div>

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
    </div>
    </div>
  );
}
  

export default Transactions;

