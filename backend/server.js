require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.MELD_API_KEY;

// Endpoint to fetch fiat currencies
app.get("/fiat-currencies", async (req, res) => {
  const response = await axios.get(
    `https://api-sb.meld.io/service-providers/properties/fiat-currencies?countries=US&accountFilter=true`,
    { headers: { Authorization: API_KEY } },
  );
  return res.json(response.data);
});

// Endpoint to fetch crypto currencies
app.get("/crypto-currencies", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api-sb.meld.io/service-providers/properties/crypto-currencies?countries=US&accountFilter=true`,
      {
        headers: { Authorization: API_KEY },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Crypto currencies fetch error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to fetch crypto currencies" });
  }
});

// Endpoint to get quotes
app.post("/quote", async (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  if (!amount || !fromCurrency || !toCurrency) {
    return res.status(400).json({
      error: "Missing required parameters",
    });
  }

  const payload = {
    sourceAmount: amount,
    sourceCurrencyCode: fromCurrency,
    destinationCurrencyCode: toCurrency,
    countryCode: "US",
  };

  console.log("Request payload:", payload);

  try {
    const response = await axios.post(
      "https://api-sb.meld.io/payments/crypto/quote",
      payload,
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Meld response:", response.data);

    res.json(response.data);
  } catch (error) {
    console.log("API error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Quote request failed",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
