# Meld Sandbox Integration Demo

This project demonstrates a basic integration with the Meld White-Label sandbox API to retrieve fiat-to-crypto purchase quotes from multiple providers.

Flow:

1. User submits a request for a crypto purchase quote (fiat → crypto).
2. The frontend sends the request to a Node.js backend.
3. The backend authenticates with the Meld sandbox API.
4. The API returns available provider quotes.
5. Quotes are sorted and displayed in the frontend, highlighting the best quote.

User Browser
↓
Frontend (HTML / JS)
↓
Node.js Backend (Express)
↓
Meld Sandbox API
↓
Quote Response
↓
Frontend displays provider quotes

Features

- Backend Node.js server
- Quote retrieval from Meld API
- Dynamic dropdowns for fiat and crypto currencies
- Popular currencies (USD, EUR, etc.) appear first
- Popular cryptos (BTC, ETH, USDC, etc.) appear first
- Simple frontend UI to display results

Architecture:

Frontend

- HTML / CSS / JavaScript
- Handles user input and displays quotes
- Dynamically populates dropdowns with MELD-supported fiat and crypto currencies
- Highlights the best quote visually

Backend

- Node.js + Express
- Handles API authentication
- Sends quote requests to the Meld sandbox
- Provides endpoints for dynamic fiat and crypto dropdown population

API

- Meld White-Label sandbox
- Returns multiple provider quotes

How to Run

1. Clone repo
2. Install dependencies
   npm install
3. Run server
   node server.js
4. Open frontend/index.html

API Authencation:

- API endpoints were validated using curl before implementing the backend integration.
- A 401 response confirmed that the endpoint was reachable and authentication was required.

Quote Display

- Quotes are sorted by destinationAmount to highlight the best provider for the user. Meaning the provider offering the highest amount
  of cryptocurrency for the same fiat amount appears first.
- The best quote is visually distinguished using CSS (.best-quote).

Notes / Challenges

- Handling API errors during sandbox testing. During testing, the Meld sandbox occasionally returned internal errors (UNEXPECTED_ERROR). Retrying the request usually resolved the issue, suggesting the problem originates from sandbox service instability rather than the integration logic.
- Currency and Crypto Currency attribute naming: The API returns name for both crypto and fiat currencies (e.g., crypto.name and fiat.name). Using .currencyName (as in documentation) returned undefined.

## Environment Variables

This project requires a MELD sandbox API key.

1. Create a file named `.env` in the project root.
2. Add the following line:

MELD_API_KEY=your_sandbox_key_here

3. Make sure `.env` is listed in `.gitignore` to keep your key private.

## Demo Video

You can see the project in action:

[Watch Demo](./demo/demo.mp4)
