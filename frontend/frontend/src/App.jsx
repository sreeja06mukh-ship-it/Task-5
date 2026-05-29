import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [error, setError] = useState("");

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
        "http://api.sreeja.me/upload-receipt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setReceiptData(response.data);
    } catch (err) {
      console.log(err);

      setError(
        "Sorry, we are getting high requests or server error. Please try again."
      );
    }

    setLoading(false);
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
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>
          Upload Receipt
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
                  <td>Store Name</td>
                  <td>{receiptData.store_name}</td>
                </tr>

                <tr>
                  <td>Date</td>
                  <td>{receiptData.date}</td>
                </tr>

                <tr>
                  <td>Time</td>
                  <td>{receiptData.time}</td>
                </tr>

                <tr>
                  <td>Total Amount</td>
                  <td>{receiptData.total_amount}</td>
                </tr>

                <tr>
                  <td>Tax</td>
                  <td>{receiptData.tax}</td>
                </tr>

              </tbody>
            </table>

            <h3>Items Purchased</h3>

            <table>
              <thead>
                <tr>
                  <th>SL No.</th>
                  <th>Item</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>

                {receiptData.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;