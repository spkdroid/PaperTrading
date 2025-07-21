import { makeAutoObservable, action, runInAction } from 'mobx';
import { getStocks } from '../services/StockService';

class DashboardViewModel {
  stocks = [];
  isLoading = true; // Start with loading true
  error = null;
  lastUpdated = null;
  refreshInterval = null;

  constructor() {
    makeAutoObservable(this, {
      loadStocks: action.bound,
      setRefreshInterval: action.bound,
      dispose: action.bound
    });
    
    console.log('[DashboardVM] Initializing...');
    this.loadStocks();
    this.setRefreshInterval();
  }

  setRefreshInterval = action(() => {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.refreshInterval = setInterval(() => {
      console.log('[DashboardVM] Auto-refreshing stocks...');
      this.loadStocks();
    }, 5 * 60 * 1000); // 5 minutes
  });

  loadStocks = action(async () => {
    console.log('[DashboardVM] Loading stocks...');
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      const stocks = await getStocks();
      runInAction(() => {
        console.log('[DashboardVM] Stocks loaded:', stocks.length);
        this.stocks = stocks;
        this.lastUpdated = new Date().toISOString();
      });
    } catch (err) {
      console.error('[DashboardVM] Error:', err);
      runInAction(() => {
        this.error = err.message || 'Failed to load stocks';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
        console.log('[DashboardVM] Loading complete');
      });
    }
  });

  dispose = action(() => {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  });
}

export default DashboardViewModel;