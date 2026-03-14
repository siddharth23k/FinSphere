# FinSphere 

> A full-stack paper trading and financial literacy platform built as a Web Technology college project.

FinSphere lets users simulate stock market investing with ₹1,00,000 in virtual capital — no real money, real learning. Built with React, Node/Express, MongoDB and the Finnhub market data API.

---

## Live Preview

> Run locally — see setup instructions below.

---

## ✨ Features

- **Paper Trading** — Buy and sell real stocks using virtual money. Supports fractional shares.
- **Live Market Data** — Real-time stock quotes, search and price history via the Finnhub API.
- **Portfolio Analytics** — Track holdings, unrealized P&L, sector exposure and allocation breakdown.
- **Market News** — Curated financial news with category filtering (Markets, Stocks, Economy, Crypto).
- **Learn Finance** — Structured learning tracks covering basics, investing strategies, budgeting and stock analysis.
- **Recommendations** — Personalized investment cards, a What-If compound interest simulator and portfolio insights.
- **User Profiles** — Risk appetite, experience level, PAN, phone — fully editable.
- **JWT Authentication** — Secure register/login with bcrypt password hashing and JWT session tokens.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, CSS Modules |
| Backend | Node.js, Express 4, MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Market Data | [Finnhub API](https://finnhub.io) |
| Database | MongoDB Atlas |
| Dev Tools | Nodemon, dotenv |

---

## 📁 Project Structure

```
finsphere/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   └── Trade.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── portfolio.js
│   │   ├── stocks.js
│   │   └── trades.js
│   ├── .env               ← not committed
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   └── Navbar.jsx
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── Home.jsx
        │   ├── Auth.jsx
        │   ├── Dashboard.jsx
        │   ├── Portfolio.jsx
        │   ├── News.jsx
        │   ├── Learn.jsx
        │   ├── Recommendations.jsx
        │   └── Profile.jsx
        ├── services/
        │   └── api.js
        ├── styles/
        │   └── global.css
        └── App.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- [Finnhub API key](https://finnhub.io) (free tier — 60 requests/min)

### 1. Clone the repository

```bash
git clone https://github.com/siddharth23k/finsphere.git
cd finsphere
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FINNHUB_API_KEY=your_finnhub_key
```

Start the backend server:

```bash
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm start
```

The app opens at **http://localhost:3000**

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any random secret string for signing tokens |
| `FINNHUB_API_KEY` | API key from finnhub.io |
| `PORT` | Backend port (default: 5000) |


---

## Pages

| Page | Description |
|------|-------------|
| `/` | Landing page with features and testimonials |
| `/auth` | Sign in / Sign up |
| `/dashboard` | Portfolio overview, alerts, recent activity |
| `/portfolio` | Holdings table, trade history, buy/sell modal |
| `/recommendations` | Stock explorer, AI insights, compound simulator |
| `/news` | Live market news with category filters |
| `/learn` | Finance learning tracks with progress tracking |
| `/profile` | Account settings and investment preferences |

---

## API Endpoints:

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/quote/:symbol` | Real-time stock quote |
| GET | `/api/stocks/search/:query` | Search stocks |
| GET | `/api/stocks/history/:symbol` | 30-day price history |
| GET | `/api/stocks/news` | Market news feed |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get user portfolio |
| POST | `/api/portfolio/buy` | Buy a stock |
| POST | `/api/portfolio/sell` | Sell a stock |
| GET | `/api/trades` | Get trade history |

---

## Disclaimer

FinSphere is an **educational paper trading simulation**. No real money is involved. Stock prices are sourced from the Finnhub API and may be delayed. This platform does not constitute real financial advice.

Built as a college Web Technology project — not a registered financial service.

