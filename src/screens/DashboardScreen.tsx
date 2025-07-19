import React, { useEffect, useState } from 'react';
import { View, FlatList, Button } from 'react-native';
import { fetchStocks } from '../api/stockApi';
import { Stock } from '../types';
import StockCard from '../components/StockCard';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchStocks().then(setStocks);
  }, []);

  return (
    <View>
      <Button title="View Portfolio" onPress={() => navigation.navigate('Portfolio')} />
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => <StockCard stock={item} />}
      />
    </View>
  );
}
