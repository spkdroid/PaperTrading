import { makeAutoObservable, action, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';


const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

class PortfolioViewModel {
  portfolio = [];
  transactions = [];
  balance = 10000; // Initial balance
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {
      loadPortfolio: action.bound,
      savePortfolio: action.bound,
      buyStock: action.bound,
      sellStock: action.bound,
      addTransaction: action.bound,
      updateStockPrices: action.bound,
      dispose: action.bound,
    });
    this.loadPortfolio();
  }

  // Load portfolio from AsyncStorage
  loadPortfolio = action(async () => {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      const [portfolio, transactions, balance] = await Promise.all([
        AsyncStorage.getItem('portfolio'),
        AsyncStorage.getItem('transactions'),
        AsyncStorage.getItem('balance'),
      ]);

      runInAction(() => {
        this.portfolio = portfolio ? JSON.parse(portfolio) : [];
        this.transactions = transactions ? JSON.parse(transactions) : [];
        this.balance = balance ? parseFloat(balance) : 10000;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load portfolio data';
        console.error('Load error:', error);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  });

  // Save portfolio to AsyncStorage
  savePortfolio = action(async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('portfolio', JSON.stringify(this.portfolio)),
        AsyncStorage.setItem('transactions', JSON.stringify(this.transactions)),
        AsyncStorage.setItem('balance', this.balance.toString()),
      ]);
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to save portfolio data';
        console.error('Save error:', error);
      });
    }
  });

  // Buy stock
  buyStock = action(async (stock, quantity) => {
    const totalCost = stock.price * quantity;
    
    if (totalCost > this.balance) {
      throw new Error(`Insufficient funds. Need $${totalCost.toFixed(2)} but only have $${this.balance.toFixed(2)}`);
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    runInAction(() => {
      this.balance -= totalCost;
      const existingItem = this.portfolio.find(item => item.symbol === stock.symbol);

      if (existingItem) {
        // Update existing position
        const newQuantity = existingItem.quantity + quantity;
        existingItem.avgPrice = 
          ((existingItem.quantity * existingItem.avgPrice) + totalCost) / newQuantity;
        existingItem.quantity = newQuantity;
      } else {
        // Add new position
        this.portfolio.push({
          id: generateId(),
          symbol: stock.symbol,
          name: stock.name,
          quantity: quantity,
          avgPrice: stock.price,
          currentPrice: stock.price,
        });
      }

      this.addTransaction({
        type: 'buy',
        symbol: stock.symbol,
        name: stock.name,
        quantity: quantity,
        price: stock.price,
        total: totalCost,
      });
    });

    await this.savePortfolio();
  });

  // Sell stock
  sellStock = action(async (stock, quantity) => {
    const portfolioItem = this.portfolio.find(item => item.symbol === stock.symbol);
    
    if (!portfolioItem) {
      throw new Error(`You don't own any ${stock.symbol} shares`);
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    if (portfolioItem.quantity < quantity) {
      throw new Error(`You only own ${portfolioItem.quantity} share${portfolioItem.quantity !== 1 ? 's' : ''} of ${stock.symbol}`);
    }

    const totalValue = stock.price * quantity;

    runInAction(() => {
      this.balance += totalValue;
      portfolioItem.quantity -= quantity;

      // Remove if quantity reaches zero
      if (portfolioItem.quantity === 0) {
        this.portfolio = this.portfolio.filter(item => item.symbol !== stock.symbol);
      }

      this.addTransaction({
        type: 'sell',
        symbol: stock.symbol,
        name: stock.name,
        quantity: quantity,
        price: stock.price,
        total: totalValue,
      });
    });

    await this.savePortfolio();
  });

  // Add transaction
  addTransaction = action(({ type, symbol, name, quantity, price, total }) => {
    this.transactions.unshift({
      id: generateId(),
      type,
      symbol,
      name,
      quantity,
      price,
      total,
      date: new Date().toISOString(),
    });
  });

  // Update stock prices from market data
  updateStockPrices = action((stocks) => {
    stocks.forEach(marketStock => {
      const portfolioItem = this.portfolio.find(item => item.symbol === marketStock.symbol);
      if (portfolioItem) {
        portfolioItem.currentPrice = marketStock.price;
      }
    });
    this.savePortfolio();
  });

  // Get quantity of a specific stock
  getStockQuantity = (symbol) => {
    const item = this.portfolio.find(item => item.symbol === symbol);
    return item ? item.quantity : 0;
  };

  // Calculate portfolio value
  get portfolioValue() {
    return this.portfolio.reduce((total, item) => {
      return total + (item.quantity * (item.currentPrice || 0));
    }, 0);
  }

  // Calculate total value (portfolio + cash)
  get totalValue() {
    return this.balance + this.portfolioValue;
  }

  // Calculate profit/loss for a stock
  getStockProfitLoss = (symbol) => {
    const item = this.portfolio.find(item => item.symbol === symbol);
    if (!item) return 0;
    return (item.currentPrice - item.avgPrice) * item.quantity;
  };

  // Cleanup
  dispose = action(() => {
    // Cleanup any resources if needed
  });
}

export default PortfolioViewModel;