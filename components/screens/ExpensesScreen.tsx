import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from 'react-native-paper';

const initialExpenses = [
  { id: '1', name: 'Burger', amount: 10, date: '2025-03-01', canteen: 'Amul', category: 'Fast Food' },
  { id: '2', name: 'Fries', amount: 30, date: '2025-03-05', canteen: 'HK', category: 'Fast Food' },
  { id: '3', name: 'Soda', amount: 10, date: '2025-03-10', canteen: 'Amul', category: 'Beverage' },
];

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({ 
    name: '', 
    amount: '', 
    date: new Date().toISOString().split('T')[0], 
    category: '', 
    canteen: '' 
  });

  // Calculate total expenses and expenses by canteen
  const totalExpenses = useMemo(() => 
    expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses]);
  
  const canteenExpenses = useMemo(() => {
    const grouped = expenses.reduce((acc: { [key: string]: number }, expense) => {
      acc[expense.canteen] = (acc[expense.canteen] || 0) + expense.amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([canteen, amount]) => ({ canteen, amount }));
  }, [expenses]);

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.date || !newExpense.category || !newExpense.canteen) {
      alert('Please fill in all fields');
      return;
    }
    const expense = {
      id: (expenses.length + 1).toString(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
    };
    setExpenses([...expenses, expense]);
    setModalVisible(false);
    setNewExpense({ name: '', amount: '', date: new Date().toISOString().split('T')[0], category: '', canteen: '' });
  };

  const renderExpense = ({ item }: { item: { id: string; name: string; amount: number; date: string; canteen: string; category: string; } }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.expenseRow}>
          <Text style={styles.expenseName}>{item.name}</Text>
          <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.expenseDetailsRow}>
          <Text style={styles.expenseDetails}>
            <Ionicons name="calendar-outline" size={14} /> {item.date}
          </Text>
          <Text style={styles.expenseDetails}>
            <Ionicons name="restaurant-outline" size={14} /> {item.canteen}
          </Text>
          <Text style={styles.expenseDetails}>
            <Ionicons name="pricetag-outline" size={14} /> {item.category}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Student Expenses</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={32} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Total Expenses Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Expenses</Text>
        <Text style={styles.summaryAmount}>${totalExpenses.toFixed(2)}</Text>
      </View>

      {/* Canteen Expenses Summary */}
      <View style={styles.canteenSummaryContainer}>
        <Text style={styles.canteenSummaryTitle}>Expenses by Canteen</Text>
        {canteenExpenses.map((item, index) => (
          <View key={index} style={styles.canteenExpenseRow}>
            <Text style={styles.canteenName}>{item.canteen}</Text>
            <Text style={styles.canteenAmount}>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Expenses List */}
      <FlatList 
        data={expenses} 
        renderItem={renderExpense} 
        keyExtractor={(item) => item.id} 
        contentContainerStyle={styles.expensesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses recorded yet</Text>
          </View>
        }
      />

      {/* Add Expense Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TextInput 
              placeholder="Expense Name" 
              style={styles.input} 
              value={newExpense.name} 
              onChangeText={(text) => setNewExpense({ ...newExpense, name: text })} 
            />
            <TextInput 
              placeholder="Amount" 
              style={styles.input} 
              keyboardType="numeric" 
              value={newExpense.amount} 
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })} 
            />
            <TextInput 
              placeholder="Date" 
              style={styles.input} 
              value={newExpense.date} 
              onChangeText={(text) => setNewExpense({ ...newExpense, date: text })} 
            />
            <TextInput 
              placeholder="Category" 
              style={styles.input} 
              value={newExpense.category} 
              onChangeText={(text) => setNewExpense({ ...newExpense, category: text })} 
            />
            <TextInput 
              placeholder="Canteen" 
              style={styles.input} 
              value={newExpense.canteen} 
              onChangeText={(text) => setNewExpense({ ...newExpense, canteen: text })} 
            />
            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={handleAddExpense} style={styles.addButton}>
                Add Expense
              </Button>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7F9FC' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#4A90E2' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  summaryContainer: {
    backgroundColor: '#4A90E2',
    padding: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  summaryAmount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  canteenSummaryContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  canteenSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  canteenExpenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  canteenName: {
    fontSize: 16,
    color: '#333',
  },
  canteenAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  expensesList: { 
    padding: 16 
  },
  card: { 
    marginBottom: 12, 
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 10,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  expenseDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseDetails: { 
    fontSize: 14, 
    color: '#666',
    alignItems: 'center',
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    width: '90%', 
    padding: 20, 
    backgroundColor: 'white', 
    borderRadius: 15,
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 20,
    textAlign: 'center',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    padding: 12, 
    marginBottom: 16, 
    borderRadius: 8, 
    fontSize: 16 
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  addButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default ExpensesScreen;