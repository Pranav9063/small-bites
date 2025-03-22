// import React from 'react';
// import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
// import { Dimensions } from 'react-native';

// // Sample data
// const expensesData = [
//     { id: '1', canteen: 'Canteen A', amount: 50 },
//     { id: '2', canteen: 'Canteen B', amount: 30 },
//     { id: '3', canteen: 'Canteen C', amount: 20 },
// ];

// const screenWidth = Dimensions.get('window').width;

// const ExpensesScreen = () => {
//     const totalAmount = expensesData.reduce((sum, expense) => sum + expense.amount, 0);

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.headerText}>Expenses</Text>
//             </View>
//             <View style={styles.totalAmountContainer}>
//                 <Text style={styles.totalAmountText}>Total Amount Spent: ${totalAmount}</Text>
//             </View>
//             <View style={styles.chartContainer}>
//                 {expensesData.map((expense) => (
//                     <View key={expense.id} style={styles.chartItem}>
//                         <Text style={styles.canteenText}>{expense.canteen}</Text>
//                         <Text style={styles.amountText}>${expense.amount}</Text>
//                     </View>
//                 ))}
//             </View>
//             <FlatList
//                 data={expensesData}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({ item }) => (
//                     <View style={styles.expenseItem}>
//                         <Text style={styles.canteenText}>{item.canteen}</Text>
//                         <Text style={styles.amountText}>${item.amount}</Text>
//                     </View>
//                 )}
//                 contentContainerStyle={styles.content}
//             />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         paddingTop: 24,
//     },
//     header: {
//         paddingVertical: 24,
//         paddingHorizontal: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f0f0f0',
//     },
//     headerText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#0000ff', // Blue color for header text
//     },
//     totalAmountContainer: {
//         padding: 16,
//         backgroundColor: '#f0f8ff', // Light blue background
//         borderBottomWidth: 1,
//         borderBottomColor: '#f0f0f0',
//     },
//     totalAmountText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#0000ff', // Blue color for total amount text
//     },
//     chartContainer: {
//         padding: 16,
//     },
//     chartItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f0f0f0',
//     },
//     content: {
//         padding: 16,
//     },
//     expenseItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f0f0f0',
//     },
//     canteenText: {
//         fontSize: 16,
//         color: '#0000ff', // Blue color for canteen text
//     },
//     amountText: {
//         fontSize: 16,
//         color: '#0000ff', // Blue color for amount text
//     },
// });

// export default ExpensesScreen;

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { G, Text as SvgText } from 'react-native-svg';

// Sample data
const expensesData = [
    { id: '1', canteen: 'Canteen A', amount: 50, color: '#FF6384' },
    { id: '2', canteen: 'Canteen B', amount: 30, color: '#36A2EB' },
    { id: '3', canteen: 'Canteen C', amount: 20, color: '#FFCE56' },
];

const screenWidth = Dimensions.get('window').width;

const ExpensesScreen = () => {
    const totalAmount = expensesData.reduce((sum, expense) => sum + expense.amount, 0);

    const pieData = expensesData.map((expense, index) => ({
        value: expense.amount,
        svg: { fill: expense.color },
        key: `pie-${index}`,
    }));

    const Labels = ({ slices }) => {
        return slices.map((slice, index) => {
            const { centroid, data } = slice;
            return (
                <SvgText
                    key={`label-${index}`}
                    x={centroid[0]}
                    y={centroid[1]}
                    fill="white"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={14}
                    fontWeight="bold"
                >
                    {`${expensesData[index].canteen}`}
                </SvgText>
            );
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Expenses</Text>
            </View>
            <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmountText}>Total Amount Spent: ${totalAmount}</Text>
            </View>

            {/* Pie Chart */}
            <View style={styles.chartContainer}>
                <PieChart style={styles.pieChart} data={pieData}>
                    <Labels />
                </PieChart>
            </View>

            <FlatList
                data={expensesData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                        <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                        <Text style={styles.canteenText}>{item.canteen}</Text>
                        <Text style={styles.amountText}>${item.amount}</Text>
                    </View>
                )}
                contentContainerStyle={styles.content}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 24,
    },
    header: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0000ff',
    },
    totalAmountContainer: {
        padding: 16,
        backgroundColor: '#f0f8ff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    totalAmountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0000ff',
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    pieChart: {
        height: 200,
        width: 200,
    },
    content: {
        paddingHorizontal: 16,
    },
    expenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    colorBox: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 5,
    },
    canteenText: {
        fontSize: 16,
        color: '#0000ff',
        flex: 1,
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0000ff',
    },
});

export default ExpensesScreen;
