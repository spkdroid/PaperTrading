import { makeAutoObservable, action, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PortfolioViewModel {
  portfolio = [];
  transactions = [];
  balance = 10000;
  isLoading = false;

  constructor() {
    makeAutoObservable(this, {
      loadPortfolio: action,
      savePortfolio: action,
      buyStock: action,
      sellStock: action,
      addTransaction: action,
      updateStockPrices: action
    });
    this.loadPortfolio();
  }

  loadPortfolio = action(async () => {
    this.isLoading = true;
    try {
      const [savedPortfolio, savedTransactions, savedBalance] = await Promise.all([
        AsyncStorage.getItem('portfolio'),
        AsyncStorage.getItem('transactions'),
        AsyncStorage.getItem('balance')
      ]);

      runInAction(() => {
        if (savedPortfolio) this.portfolio = JSON.parse(savedPortfolio);
        if (savedTransactions) this.transactions = JSON.parse(savedTransactions);
        if (savedBalance) this.balance = parseFloat(savedBalance);
      });
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  });

  savePortfolio = action(async () => {
    try {
      await AsyncStorage.multiSet([
        ['portfolio', JSON.stringify(this.portfolio)],
        ['transactions', JSON.stringify(this.transactions)],
        ['balance', this.balance.toString()],
      ]);
    } catch (error) {
      console.error('Error saving portfolio:', error);
    }
  });

  buyStock = action((stock, quantity) => {
    const totalCost = stock.price * quantity;
    if (totalCost > this.balance) {
      throw new Error('Insufficient funds');
    }

    this.balance -= totalCost;

    const existingItem = this.portfolio.find(item => item.symbol === stock.symbol);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const newAvgPrice = ((existingItem.quantity * existingItem.avgPrice) + totalCost) / newQuantity;
      existingItem.quantity = newQuantity;
      existingItem.avgPrice = newAvgPrice;
    } else {
      this.portfolio.push({
        symbol: stock.symbol,
        name: stock.name,
        quantity: quantity,
        avgPrice: stock.price,
        currentPrice: stock.price
      });
    }

    this.addTransaction('buy', stock, quantity);
    this.savePortfolio();
  });

  sellStock = action((stock, quantity) => {
    const portfolioItem = this.portfolio.find(item => item.symbol === stock.symbol);
    if (!portfolioItem || portfolioItem.quantity < quantity) {
      throw new Error('Not enough shares to sell');
    }

    this.balance += stock.price * quantity;

    portfolioItem.quantity -= quantity;
    if (portfolioItem.quantity === 0) {
      this.portfolio = this.portfolio.filter(item => item.symbol !== stock.symbol);
    }

    this.addTransaction('sell', stock, quantity);
    this.savePortfolio();
  });

  addTransaction = action((type, stock, quantity) => {
    this.transactions.unshift({
      type,
      symbol: stock.symbol,
      name: stock.name,
      quantity,
      price: stock.price,
      date: new Date().toISOString(),
      id: Date.now().toString()
    });
  });

  updateStockPrices = action((stocks) => {
    stocks.forEach(stock => {
      const portfolioItem = this.portfolio.find(item => item.symbol === stock.symbol);
      if (portfolioItem) {
        portfolioItem.currentPrice = stock.price;
      }
    });
    this.savePortfolio();
  });

  get portfolioValue() {
    return this.portfolio.reduce((total, item) => {
      return total + (item.quantity * (item.currentPrice || 0));
    }, 0);
  }

  get totalValue() {
    return this.balance + this.portfolioValue;
  }
}

export default PortfolioViewModel;