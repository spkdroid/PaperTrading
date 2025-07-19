import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useTrading } from '../context/TradingContext';

export const PaperTradingScreen = () => {
  const { portfolio, balance, trades } = useTrading();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paper Trading Portfolio</Text>
      <Text style={styles.balance}>Balance: ${balance.toFixed(2)}</Text>

      <Text style={styles.section}>Your Holdings</Text>
      <FlatList
        data={portfolio}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.symbol} ({item.name})</Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>Avg: ${item.averagePrice.toFixed(2)}</Text>
          </View>
        )}
      />

      <Text style={styles.section}>Trade History</Text>
      <FlatList
        data={trades}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.type} {item.symbol} x{item.quantity} @ ${item.price.toFixed(2)}</Text>
            <Text>{new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  balance: { fontSize: 16, marginBottom: 12 },
  section: { fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#ccc' },
});
