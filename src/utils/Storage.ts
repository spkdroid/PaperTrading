import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trade } from '../types';

const STORAGE_KEY = 'trades';

export async function saveTrade(trade: Trade) {
  const trades = await getTrades();
  trades.push(trade);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

export async function getTrades(): Promise<Trade[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}
