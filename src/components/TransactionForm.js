import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';

const TransactionForm = observer(({ 
  stock, 
  onSubmit, 
  onCancel, 
  maxQuantity = 0, 
  balance = 10000,
  isLoading = false
}) => {
  const [quantity, setQuantity] = useState('');
  const [transactionType, setTransactionType] = useState('buy');

  const handleSubmit = () => {
    if (isLoading) return;
    
    const qty = parseFloat(quantity);
    if (isNaN(qty)) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }

    if (qty <= 0) {
      Alert.alert('Invalid Quantity', 'Quantity must be greater than zero');
      return;
    }

    if (!Number.isInteger(qty)) {
      Alert.alert('Invalid Quantity', 'Please enter whole shares only');
      return;
    }

    if (transactionType === 'sell' && qty > maxQuantity) {
      Alert.alert('Insufficient Shares', `You only have ${maxQuantity} share${maxQuantity !== 1 ? 's' : ''} to sell`);
      return;
    }

    if (transactionType === 'buy' && qty * stock.price > balance) {
      Alert.alert('Insufficient Funds', `You need $${(qty * stock.price).toFixed(2)} but only have $${balance.toFixed(2)}`);
      return;
    }

    onSubmit(transactionType, qty);
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    return (qty * stock.price).toFixed(2);
  };

  const handleQuantityChange = (text) => {
    // Allow empty input or valid numbers
    if (text === '' || /^[0-9]*\.?[0-9]*$/.test(text)) {
      setQuantity(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            transactionType === 'buy' && styles.activeBuyButton,
            isLoading && styles.disabledButton
          ]}
          onPress={() => !isLoading && setTransactionType('buy')}
          disabled={isLoading}
        >
          <Text style={[
            styles.toggleButtonText,
            transactionType === 'buy' && styles.activeButtonText
          ]}>
            BUY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            transactionType === 'sell' && styles.activeSellButton,
            isLoading && styles.disabledButton
          ]}
          onPress={() => !isLoading && setTransactionType('sell')}
          disabled={isLoading}
        >
          <Text style={[
            styles.toggleButtonText,
            transactionType === 'sell' && styles.activeButtonText
          ]}>
            SELL
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.availableText}>
        {transactionType === 'sell' 
          ? `Available: ${maxQuantity} share${maxQuantity !== 1 ? 's' : ''}`
          : `Available Cash: $${balance.toFixed(2)}`}
      </Text>

      <TextInput
        style={[
          styles.input,
          isLoading && styles.disabledInput
        ]}
        keyboardType="numeric"
        placeholder="Enter share quantity"
        placeholderTextColor="#999"
        value={quantity}
        onChangeText={handleQuantityChange}
        editable={!isLoading}
        autoFocus
      />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {quantity || '0'} share{(parseInt(quantity) || 0) !== 1 ? 's' : ''} × ${stock.price.toFixed(2)} =
        </Text>
        <Text style={styles.totalText}>${calculateTotal()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.cancelButton,
            isLoading && styles.disabledButton
          ]} 
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            transactionType === 'buy' ? styles.buyButton : styles.sellButton,
            isLoading && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Processing...' : `${transactionType === 'buy' ? 'Buy' : 'Sell'} Shares`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeBuyButton: {
    backgroundColor: '#2ecc71',
  },
  activeSellButton: {
    backgroundColor: '#e74c3c',
  },
  disabledButton: {
    opacity: 0.6,
  },
  toggleButtonText: {
    fontWeight: 'bold',
    color: '#666',
  },
  activeButtonText: {
    color: 'white',
  },
  availableText: {
    color: '#666',
    marginBottom: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 2,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  buyButton: {
    backgroundColor: '#2ecc71',
  },
  sellButton: {
    backgroundColor: '#e74c3c',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TransactionForm;