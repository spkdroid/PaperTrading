import axios from 'axios';
import { Stock } from '../models/Stock';

export const fetchStocks = async (): Promise<Stock[]> => {
  const response = await axios.get('https://spkdroid.com/stock/api.php');
  return response.data.stocks;
};
