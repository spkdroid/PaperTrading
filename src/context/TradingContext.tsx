import React, { createContext, useContext, useState } from 'react';
import { PortfolioItem, Trade } from '../models/Portfolio';

interface TradingContextType {
  portfolio: PortfolioItem[];
  balance: number;
  trades: Trade[];
  buyStock: (symbol: string, name: string, quantity: number, price: number) => void;
  sellStock: (symbol: string, name: string, quantity: number, price: number) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [balance, setBalance] = useState<number>(100000); // Start with $100K virtual money
  const [trades, setTrades] = useState<Trade[]>([]);

  const buyStock = (symbol: string, name: string, quantity: number, price: number) => {
    const cost = price * quantity;
    if (balance < cost) return;

    setBalance(prev => prev - cost);
    setTrades(prev => [...prev, { symbol, name, quantity, price, type: 'BUY', timestamp: new Date().toISOString() }]);

    setPortfolio(prev => {
      const item = prev.find(p => p.symbol === symbol);
      if (item) {
        const newQuantity = item.quantity + quantity;
        const newAvg = (item.averagePrice * item.quantity + price * quantity) / newQuantity;
        return prev.map(p => p.symbol === symbol ? { ...p, quantity: newQuantity, averagePrice: newAvg } : p);
      }
      return [...prev, { symbol, name, quantity, averagePrice: price }];
    });
  };

  const sellStock = (symbol: string, name: string, quantity: number, price: number) => {
    const item = portfolio.find(p => p.symbol === symbol);
    if (!item || item.quantity < quantity) return;

    const proceeds = quantity * price;
    setBalance(prev => prev + proceeds);
    setTrades(prev => [...prev, { symbol, name, quantity, price, type: 'SELL', timestamp: new Date().toISOString() }]);

    setPortfolio(prev => {
      return prev
        .map(p => p.symbol === symbol ? { ...p, quantity: p.quantity - quantity } : p)
        .filter(p => p.quantity > 0);
    });
  };

  return (
    <TradingContext.Provider value={{ portfolio, balance, trades, buyStock, sellStock }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within TradingProvider');
  return context;
};
