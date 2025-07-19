import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'PORTFOLIO_STATE';

export const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState({});
  const [balance, setBalance] = useState(10000);

  useEffect(() => {
    const loadData = async () => {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const { balance, portfolio } = JSON.parse(storedData);
        setBalance(balance);
        setPortfolio(portfolio);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ balance, portfolio }));
  }, [balance, portfolio]);

  const buyStock = (symbol, quantity, price) => {
    const totalCost = price * quantity;
    if (balance < totalCost) return;

    setBalance(prev => prev - totalCost);
    setPortfolio(prev => ({
      ...prev,
      [symbol]: {
        quantity: (prev[symbol]?.quantity || 0) + quantity,
        avgPrice:
          ((prev[symbol]?.avgPrice || 0) * (prev[symbol]?.quantity || 0) +
            price * quantity) /
          ((prev[symbol]?.quantity || 0) + quantity),
      },
    }));
  };

  const sellStock = (symbol, quantity, price) => {
    const stock = portfolio[symbol];
    if (!stock || stock.quantity < quantity) return;

    const totalGain = price * quantity;
    setBalance(prev => prev + totalGain);
    setPortfolio(prev => {
      const newQty = stock.quantity - quantity;
      if (newQty === 0) {
        const newPortfolio = { ...prev };
        delete newPortfolio[symbol];
        return newPortfolio;
      } else {
        return {
          ...prev,
          [symbol]: {
            ...stock,
            quantity: newQty,
          },
        };
      }
    });
  };

  return (
    <PortfolioContext.Provider value={{ balance, portfolio, buyStock, sellStock }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
