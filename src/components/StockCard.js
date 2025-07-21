import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StockCard = ({ stock }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{stock.symbol}</Text>
        <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.name}>{stock.name}</Text>
      <Text style={styles.updated}>
        Updated: {new Date(stock.lastUpdated).toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  name: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  updated: {
    fontSize: 12,
    color: '#999',
  },
});

export default StockCard;