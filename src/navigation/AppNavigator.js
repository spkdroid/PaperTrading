import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../views/DashboardScreen';
import PortfolioScreen from '../views/PortfolioScreen';
import TransactionScreen from '../views/TransactionScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ 
  dashboardViewModel, 
  portfolioViewModel, 
  transactionsViewModel 
}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard">
        {props => (
          <DashboardScreen 
            {...props} 
            dashboardViewModel={dashboardViewModel}
            portfolioViewModel={portfolioViewModel}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Portfolio">
        {props => (
          <PortfolioScreen 
            {...props} 
            portfolioViewModel={portfolioViewModel}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Transactions">
        {props => (
          <TransactionsScreen 
            {...props} 
            transactionsViewModel={transactionsViewModel}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Transaction" component={TransactionScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;