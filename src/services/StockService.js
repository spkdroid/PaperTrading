import axios from 'axios';
import Stock from '../models/Stock';

const API_URL = 'https://spkdroid.com/stock/api.php';

export const getStocks = async () => {
  try {
    console.log('[StockService] Fetching stocks from:', API_URL);
    const response = await axios.get(API_URL);
    console.log('[StockService] Received data:', response.data);
    
    if (!response.data?.stocks) {
      throw new Error('Invalid API response format');
    }
    
    return response.data.stocks.map(stock => new Stock(
      stock.symbol,
      stock.name,
      parseFloat(stock.price),
      stock.last_updated
    ));
  } catch (error) {
    console.error('[StockService] Error:', error);
    throw error;
  }
};