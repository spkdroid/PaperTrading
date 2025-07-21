import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import StockCard from '../components/StockCard';

const DashboardScreen = observer(({ dashboardViewModel }) => {
  useEffect(() => {
    console.log('[DashboardScreen] Component mounted');
    return () => {
      console.log('[DashboardScreen] Component unmounted');
    };
  }, []);

  if (dashboardViewModel.isLoading && dashboardViewModel.stocks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading market data...</Text>
      </View>
    );
  }

  if (dashboardViewModel.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {dashboardViewModel.error}</Text>
        <Text style={styles.retryText} onPress={() => dashboardViewModel.loadStocks()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.lastUpdated}>
        Last updated: {new Date(dashboardViewModel.lastUpdated).toLocaleString()}
      </Text>
      <FlatList
        data={dashboardViewModel.stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => <StockCard stock={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  lastUpdated: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default DashboardScreen;