import { useState } from "react";
import axios from "axios";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [error, setError] = useState("");
  const [refreshDashboard, setRefreshDashboard] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a receipt image");
      return;
    }

    setLoading(true);
    setError("");
    setReceiptData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://api.sreeja.me/upload-receipt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      setReceiptData(response.data.expense);
      alert("Receipt uploaded successfully!");

    } catch (err) {
      console.error(err);

      setError(
        "Sorry, we are getting high requests or server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (

<div className="container">
  <div className="card">

    <h1>AI Receipt Scanner</h1>

    <p className="subtitle">
      Upload receipt images and extract structured data instantly
    </p>

    <input
      type="file"
      accept="image/*"
      onChange={(e) => setFile(e.target.files[0])}
    />

    <button
      onClick={handleUpload}
      disabled={loading}
    >
      {loading ? "Uploading..." : "Upload Receipt"}
    </button>

    {loading && (
      <div className="loader-section">
        <div className="loader"></div>
        <p>Analyzing receipt using AI...</p>
      </div>
    )}

    {error && (
      <div className="error-box">
        {error}
      </div>
    )}

    {receiptData && (
      <div className="result-section">

        <h2>Receipt Details</h2>

        <table>
          <tbody>

            <tr>
              <td>Amount</td>
              <td>{receiptData.amount}</td>
            </tr>

            <tr>
              <td>Category</td>
              <td>{receiptData.category}</td>
            </tr>

            <tr>
              <td>Date</td>
              <td>{receiptData.date}</td>
            </tr>

            <tr>
              <td>Description</td>
              <td>{receiptData.description}</td>
            </tr>

          </tbody>
        </table>

      </div>
    )}

<Dashboard refreshDashboard={refreshDashboard} />

<Transactions
  refreshDashboard={refreshDashboard}
  setRefreshDashboard={setRefreshDashboard}
/>

  </div>
</div>
  );
}   

export default App;