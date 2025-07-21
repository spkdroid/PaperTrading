export default class PortfolioItem {
    constructor(symbol, name, quantity, avgPrice) {
        this.symbol = symbol;
        this.name = name;
        this.quantity = quantity;
        this.avgPrice = avgPrice;
    }

    get currentValue() {
        return this.quantity * this.currentPrice;
    }

    get profitLoss() {
        return this.currentValue - (this.quantity * this.avgPrice);
    }
}