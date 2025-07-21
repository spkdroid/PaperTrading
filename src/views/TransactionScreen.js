import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import TransactionForm from '../components/TransactionForm';
import DashboardViewModel from '../viewmodels/DashboardViewModel';

const TransactionScreen = observer(({ route, navigation, portfolioViewModel }) => {
  const { symbol } = route.params;
  const [dashboardVM] = useState(() => new DashboardViewModel());
  const [stock, setStock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        await dashboardVM.loadStocks();
        const foundStock = dashboardVM.getStockBySymbol(symbol);
        setStock(foundStock);
      } catch (error) {
        Alert.alert('Error', 'Failed to load stock data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  const handleTransaction = (type, quantity) => {
    try {
      if (type === 'buy') {
        portfolioViewModel.buyStock(stock, quantity);
      } else {
        portfolioViewModel.sellStock(stock, quantity);
      }
      Alert.alert(
        'Success',
        `${type === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Transaction Failed', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading stock data...</Text>
      </View>
    );
  }

  if (!stock) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Stock not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{stock.symbol}</Text>
        <Text style={styles.companyName}>{stock.name}</Text>
        <Text style={styles.currentPrice}>${stock.price.toFixed(2)}</Text>
      </View>

      <TransactionForm
        stock={stock}
        onSubmit={handleTransaction}
        onCancel={() => navigation.goBack()}
        maxQuantity={
          portfolioViewModel.portfolio.find(item => item.symbol === stock.symbol)?.quantity || 0
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  symbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
    textAlign: 'center',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TransactionScreen;