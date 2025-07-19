export interface Stock {
    symbol: string;
    name: string;
    price: number;
    last_updated: string;
  }
  
  export interface Trade {
    symbol: string;
    name: string;
    price: number;
    quantity: number;
    type: 'BUY' | 'SELL';
    date: string;
  }
  