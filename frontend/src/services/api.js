import { API } from './apiInstance';

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Portfolio
export const getPortfolio = () => API.get('/portfolio');
export const buyStock = (data) => API.post('/portfolio/buy', data);
export const sellStock = (data) => API.post('/portfolio/sell', data);

// Stocks
export const getStockQuote = (symbol) => API.get(`/stocks/quote/${symbol}`);
export const searchStocks = (query) => API.get(`/stocks/search/${query}`);
export const getStockHistory = (symbol) => API.get(`/stocks/history/${symbol}`);
export const getNews = () => API.get('/stocks/news');
export const getIndexData = (symbol = '^GSPC') => API.get(`/stocks/history/${symbol}`);

// Trades
export const getTrades = () => API.get('/trades');
export const getRecentTrades = () => API.get('/trades/recent');