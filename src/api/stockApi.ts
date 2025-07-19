import axios from 'axios';
import { Stock } from '../types';

const BASE_URL = 'https://spkdroid.com/stock/api.php';

export async function fetchStocks(): Promise<Stock[]> {
  const res = await axios.get(BASE_URL);
  return res.data.stocks;
}
