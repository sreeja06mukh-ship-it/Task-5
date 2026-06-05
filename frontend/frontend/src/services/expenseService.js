const API_URL = "https://api.sreeja.me";

export const getExpenses = async () => {
  const response = await fetch(`${API_URL}/expenses`);

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return response.json();
};

export const getMonthlySummary = async (month) => {
  const response = await fetch(
    `${API_URL}/expenses/summary?month=${month}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch monthly summary");
  }

  return response.json();
};