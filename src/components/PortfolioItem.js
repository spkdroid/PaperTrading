import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PortfolioItem = ({ item }) => {
    const profitLoss = item.profitLoss;
    const profitLossColor = profitLoss >= 0 ? '#2ecc71' : '#e74c3c';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.value}>${item.currentValue.toFixed(2)}</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.details}>
                <Text style={styles.quantity}>{item.quantity} shares</Text>
                <Text style={[styles.profitLoss, { color: profitLossColor }]}>
                    {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} (
                    {((profitLoss / (item.quantity * item.avgPrice)) * 100).toFixed(2)}%)
                </Text>
            </View>
            <Text style={styles.avgPrice}>Avg Price: ${item.avgPrice.toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    symbol: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    quantity: {
        fontSize: 14,
        color: '#666',
    },
    profitLoss: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    avgPrice: {
        fontSize: 12,
        color: '#999',
    },
});

export default PortfolioItem;