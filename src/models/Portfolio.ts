export interface PortfolioItem {
    symbol: string;
    name: string;
    quantity: number;
    averagePrice: number;
  }
  
  export interface Trade {
    symbol: string;
    name: string;
    quantity: number;
    price: number;
    type: 'BUY' | 'SELL';
    timestamp: string;
  }
  