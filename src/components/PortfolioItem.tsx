import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trade } from '../types';

export default function PortfolioItem({ trade }: { trade: Trade }) {
  return (
    <View style={styles.container}>
      <Text>{trade.symbol} ({trade.type})</Text>
      <Text>{trade.quantity} @ ${trade.price.toFixed(2)}</Text>
      <Text>{new Date(trade.date).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    margin: 5,
    padding: 10,
    borderRadius: 6,
  },
});

