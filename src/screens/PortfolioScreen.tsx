import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Trade } from '../types';
import { getTrades } from '../utils/Storage';
import PortfolioItem from '../components/PortfolioItem';

export default function PortfolioScreen() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const load = async () => {
      const t = await getTrades();
      setTrades(t);
    };
    const unsubscribe = load();
    return () => unsubscribe;
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 20, padding: 10 }}>Your Portfolio</Text>
      <FlatList
        data={trades}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <PortfolioItem trade={item} />}
      />
    </View>
  );
}
