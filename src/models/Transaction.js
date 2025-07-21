export default class Transaction {
    constructor(type, symbol, name, quantity, price, date) {
        this.type = type; // 'buy' or 'sell'
        this.symbol = symbol;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.date = date || new Date().toISOString();
    }
}