import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import StockCard from '../components/StockCard';

const DashboardScreen = observer(({ 
  navigation,
  dashboardViewModel,
  portfolioViewModel
}) => {
  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        await dashboardViewModel.loadStocks();
        dashboardViewModel.setupAutoRefresh();
      } catch (error) {
        console.error('Initial load error:', error);
      }
    };
    
    loadData();
    
    return () => {
      dashboardViewModel.dispose();
    };
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    dashboardViewModel.loadStocks();
  };

  // Render loading state
  if (dashboardViewModel.isLoading && dashboardViewModel.stocks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading market data...</Text>
      </View>
    );
  }

  // Render error state
  if (dashboardViewModel.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{dashboardViewModel.error}</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.retryText}>Tap to retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate portfolio value
  const portfolioValue = portfolioViewModel.portfolioValue;
  const totalValue = portfolioViewModel.totalValue;

  return (
    <View style={styles.container}>
      {/* Portfolio Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Available Cash:</Text>
          <Text style={styles.summaryValue}>${portfolioViewModel.balance.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Portfolio Value:</Text>
          <Text style={styles.summaryValue}>${portfolioValue.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Value:</Text>
          <Text style={[styles.summaryValue, styles.totalValue]}>${totalValue.toFixed(2)}</Text>
        </View>
      </View>

      {/* Market Data Header */}
      <View style={styles.marketHeader}>
        <Text style={styles.marketTitle}>Market Stocks</Text>
        <Text style={styles.lastUpdated}>
          Updated: {new Date(dashboardViewModel.lastUpdated).toLocaleTimeString()}
        </Text>
      </View>

      {/* Stocks List */}
      <FlatList
        data={dashboardViewModel.stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <StockCard 
            stock={item}
            ownedQuantity={portfolioViewModel.getStockQuantity(item.symbol)}
            onPress={() => navigation.navigate('Transaction', { 
              symbol: item.symbol,
              name: item.name,
              price: item.price
            })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={dashboardViewModel.isLoading}
        onRefresh={handleRefresh}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryText: {
    color: '#3498db',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  marketHeader: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  marketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 3,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default DashboardScreen;