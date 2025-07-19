import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Stock } from '../types';
import { useNavigation } from '@react-navigation/native';

export default function StockCard({ stock }: { stock: Stock }) {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{stock.name}</Text>
      <Text>${stock.price.toFixed(2)}</Text>
      <Button title="Trade" onPress={() => navigation.navigate('Trade', { stock })} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
  },
});
