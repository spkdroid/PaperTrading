import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import PortfolioItem from '../components/PortfolioItem';
import PortfolioViewModel from '../viewmodels/PortfolioViewModel';

const PortfolioScreen = observer(({ portfolioViewModel }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Portfolio</Text>
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Balance: ${portfolioViewModel.balance.toFixed(2)}</Text>
                <Text style={styles.summaryText}>Portfolio Value: ${portfolioViewModel.portfolioValue.toFixed(2)}</Text>
                <Text style={styles.summaryText}>Total Value: ${portfolioViewModel.totalValue.toFixed(2)}</Text>
            </View>
            
            <FlatList
                data={portfolioViewModel.portfolio}
                keyExtractor={(item) => item.symbol}
                renderItem={({ item }) => <PortfolioItem item={item} />}
                ListEmptyComponent={
                    <Text style={styles.empty}>Your portfolio is empty. Start trading!</Text>
                }
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summary: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 8,
    },
    empty: {
        textAlign: 'center',
        marginTop: 32,
        fontSize: 16,
        color: 'gray',
    },
});

export default PortfolioScreen;