import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { addMenuItemToCanteen } from '@/lib/services/firestoreService';
import { useAuth } from '@/lib/context/AuthContext';

export default function AddItem() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [calories, setCalories] = useState('');
  const [category, setCategory] = useState('Snacks');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { image, pickImage, uploadImage, uploading } = useImageUpload();

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  const handleSave =async () => {
    try {
      if (!name || !price || !calories || !category || !description || !image) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setLoading(true)
      const imageURL = await uploadImage();
      if(!imageURL) {
        Alert.alert('Error', 'Failed to upload image. Please try again.');
        return;
      }
  
      const menuItem : MenuItem= {
        item_id: Math.random().toString(36).substring(2, 9),
        name,
        price: parseFloat(price),
        calories: parseInt(calories),
        category,
        description,
        image : imageURL,
        availability: true,
      };

      if(!user) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      const res = await addMenuItemToCanteen(user.uid , menuItem);

      if(res.success) {
        Alert.alert('Success', 'Item added successfully!');
        router.back();
      } else {
        Alert.alert('Error', 'Failed to add item. Please try again.');
        throw new Error("Failed to add item to canteen.");
      }

      setLoading(false)

    } catch (error) {
      console.error("Error saving item:", error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally{
      setLoading(false)
    }

  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size={'large'} color="#007AFF"/>
        <Text style={{ fontSize: 20, color: "#333" }}>Saving...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Item</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Item Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter item name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor="#999"
            />
          </View>

          {/* Price Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price (₹) *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          {/* Calories Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Calories *</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              placeholder="Enter calories"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[
                    styles.categoryText,
                    category === cat && styles.selectedCategoryText,
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Image Upload */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upload Image *</Text>
            <TouchableOpacity onPress={pickImage} style={StyleSheet.compose(styles.input, { marginBottom: 8 })}>
              <Text style={styles.saveButtonText}>{image ? "Select a different image" : "Select Canteen Image"}</Text>
            </TouchableOpacity>

            {/* Display Selected Image */}
            <View style={{ display: "flex", alignItems: "center" , marginBottom: 16}}>
              {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />}
            </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#FFD337',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#333',
    fontWeight: '600',
  },
}); 