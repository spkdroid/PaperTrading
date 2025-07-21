export default class Stock {
    constructor(symbol, name, price, lastUpdated) {
        this.symbol = symbol;
        this.name = name;
        this.price = price;
        this.lastUpdated = lastUpdated;
    }
}