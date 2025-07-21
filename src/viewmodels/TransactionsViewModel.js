import { makeAutoObservable } from 'mobx';

class TransactionsViewModel {
    transactions = [];

    constructor() {
        makeAutoObservable(this);
        // Load from storage if needed
    }

    getTransactions() {
        return this.transactions.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

export default TransactionsViewModel;