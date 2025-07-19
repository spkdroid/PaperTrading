import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { saveTrade } from '../utils/Storage';
import { Trade } from '../types';

export default function TradeScreen() {
  const route = useRoute<RouteProp<any>>();
  const { stock } = route.params;
  const [qty, setQty] = useState('1');

  const trade = async (type: 'BUY' | 'SELL') => {
    const tradeData: Trade = {
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      quantity: parseInt(qty),
      type,
      date: new Date().toISOString(),
    };
    await saveTrade(tradeData);
    Alert.alert(`${type} Order Placed`, `${qty} shares of ${stock.symbol}`);
  };

  return (
    <View style={styles.container}>
      <Text>Trade {stock.name} (${stock.symbol})</Text>
      <TextInput
        keyboardType="numeric"
        value={qty}
        onChangeText={setQty}
        style={styles.input}
        placeholder="Quantity"
      />
      <Button title="Buy" onPress={() => trade('BUY')} />
      <Button title="Sell" onPress={() => trade('SELL')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
  },
});
