import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PortfolioViewModel from './src/viewmodels/PortfolioViewModel';
import TransactionsViewModel from './src/viewmodels/TransactionsViewModel';
import DashboardViewModel from './src/viewmodels/DashboardViewModel';
import AppNavigator from './src/navigation/AppNavigator';

// Initialize outside component to maintain state
const dashboardViewModel = new DashboardViewModel();
const portfolioViewModel = new PortfolioViewModel();
const transactionsViewModel = new TransactionsViewModel();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator 
          dashboardViewModel={dashboardViewModel} 
          portfolioViewModel={portfolioViewModel}
          transactionsViewModel={transactionsViewModel}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;