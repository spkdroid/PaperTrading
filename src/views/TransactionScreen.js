import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';

const TransactionHistoryScreen = observer(({ transactionsViewModel }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={transactionsViewModel.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.transactionItem,
            item.type === 'buy' ? styles.buyTransaction : styles.sellTransaction
          ]}>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <Text>{item.type.toUpperCase()} - {item.quantity} shares</Text>
            <Text>Price: ${item.price.toFixed(2)}</Text>
            <Text>Total: ${item.total.toFixed(2)}</Text>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  transactionItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  buyTransaction: {
    backgroundColor: '#e6f7ee',
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  sellTransaction: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  symbol: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
});

export default TransactionHistoryScreen;