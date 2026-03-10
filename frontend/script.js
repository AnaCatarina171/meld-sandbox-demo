const form = document.getElementById("quoteForm");
const resultDiv = document.getElementById("result");

// Fetch and populate fiat currencies in the dropdown

const popularFiats = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "CHF",
  "CNY",
  "INR",
  "BRL",
];

// Function to prioritize popular fiat currencies in the dropdown
function prioritizePopularFiats(allCurrencies, popularList) {
  const popular = [];
  const others = [];

  allCurrencies.forEach((curr) => {
    if (popularList.includes(curr.currencyCode)) {
      popular.push(curr);
    } else {
      others.push(curr);
    }
  });

  return [...popular, ...others];
}

async function loadFiatCurrencies() {
  try {
    const response = await fetch("http://localhost:3000/fiat-currencies");
    let currencies = await response.json();

    // Prioritize popular currencies
    currencies = prioritizePopularFiats(currencies, popularFiats);

    const fromCurrencySelect = document.getElementById("fromCurrency");

    // Clear any existing options
    fromCurrencySelect.innerHTML = "";

    currencies.forEach((curr) => {
      const opt = document.createElement("option");
      opt.value = curr.currencyCode;
      opt.textContent = `${curr.currencyCode} – ${curr.name}`; // e.g., "USD – US Dollar"
      fromCurrencySelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading fiat currencies:", err);
  }
}

// Call on page load
loadFiatCurrencies();

// Fetch and populate crypto currencies in the dropdown

// List of popular cryptocurrencies to prioritize in the dropdown
const popularCryptos = ["BTC", "ETH", "USDC", "USDT", "BNB", "ADA", "SOL"];

function prioritizePopularCryptos(allCryptos, popularList) {
  const popular = [];
  const others = [];

  allCryptos.forEach((crypto) => {
    if (popularList.includes(crypto.currencyCode)) {
      popular.push(crypto);
    } else {
      others.push(crypto);
    }
  });

  // Return popular first, then the rest
  return [...popular, ...others];
}

async function loadCryptoCurrencies() {
  try {
    const response = await fetch("http://localhost:3000/crypto-currencies");
    let data = await response.json();

    // Prioritize popular cryptos
    data = prioritizePopularCryptos(data, popularCryptos);

    const toCurrencySelect = document.getElementById("toCurrency");

    data.forEach((crypto) => {
      const option = document.createElement("option");
      option.value = crypto.currencyCode;
      option.textContent = `${crypto.currencyCode} – ${crypto.name}`; // e.g., "BTC – Bitcoin"
      toCurrencySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading crypto currencies:", err);
  }
}

// Call on page load
loadCryptoCurrencies();

// Handle form submission to get quotes
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;

  resultDiv.innerHTML = `
    <div class="loading">
    Fetching quotes from the API...
    </div>
    `;

  try {
    const response = await fetch("http://localhost:3000/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        fromCurrency,
        toCurrency,
      }),
    });

    const data = await response.json();

    data.quotes.sort(
      (a, b) => Number(b.destinationAmount) - Number(a.destinationAmount),
    );

    if (!data.quotes || data.quotes.length === 0) {
      resultDiv.innerHTML = "No quotes available";
      return;
    }

    let quotesHTML = "<h2>Quotes</h2>";

    data.quotes.forEach((quote, index) => {
      const label = index === 0 ? "Best Quote" : "Quote";
      const cardClass = index === 0 ? "quote-card best-quote" : "quote-card";

      quotesHTML += `
      <div class="${cardClass}">
      
      <h3>${label}</h3>

      <p><strong>Transaction Type:</strong> ${quote.transactionType}</p>

      <p><strong>Provider:</strong> ${quote.serviceProvider}</p>

      <p><strong>Source Amount:</strong> ${Number(quote.sourceAmount).toFixed(2)} ${quote.sourceCurrencyCode}</p>

      <p><strong>Source Amount Without Fees:</strong> ${Number(quote.sourceAmountWithoutFees).toFixed(2)} ${quote.sourceCurrencyCode}</p>

      <p><strong>Destination Amount:</strong> ${Number(quote.destinationAmount).toFixed(6)} ${quote.destinationCurrencyCode}</p>

      <p><strong>Network Fee:</strong> ${quote.networkFee || "N/A"}</p>

      <p class="total-fee"><strong>Total Fee:</strong> ${quote.totalFee || "N/A"}</p>

      <p><strong>Customer Score:</strong> ${quote.customerScore || "N/A"}</p>

      <p><strong>Payment Method:</strong> ${quote.paymentMethodType || "N/A"}</p>
      </div>
      `;
    });

    resultDiv.innerHTML = quotesHTML;
  } catch (error) {
    resultDiv.innerHTML = `
        <div class="error">
        Unable to retrieve quotes. Please try again.
        </div>
        `;
  }
});
