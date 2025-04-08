import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { addMenuItemToCanteen } from '@/lib/services/firestoreService';
import { useAuth } from '@/lib/context/AuthContext';
import { Theme } from '@/constants/Theme';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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
  const theme = useTheme();
  const styles = createStyles(theme);

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  const handleSave = async () => {
    try {
      if (!name || !price || !calories || !category || !description || !image) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setLoading(true)
      const imageURL = await uploadImage();
      if (!imageURL) {
        Alert.alert('Error', 'Failed to upload image. Please try again.');
        return;
      }

      const menuItem: MenuItem = {
        item_id: Math.random().toString(36).substring(2, 9),
        name,
        price: parseFloat(price),
        calories: parseInt(calories),
        category,
        description,
        image: imageURL,
        availability: true,
      };

      if (!user) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      const res = await addMenuItemToCanteen(user.uid, menuItem);

      if (res.success) {
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
    } finally {
      setLoading(false)
    }

  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color="#007AFF" />
        <Text style={styles.loadingText}>Saving...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" /> */}
      <View style={styles.content}>
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
          <View style={styles.imageSection}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <MaterialIcons name="add-a-photo" size={36} color={theme.colors.primary} />
                  <Text style={styles.imagePickerText}>Add Food Pics</Text>
                </View>
              )}
            </TouchableOpacity>
            {image && (
              <TouchableOpacity onPress={pickImage} style={styles.changeImageButton}>
                <MaterialIcons name="edit" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 20,
    color: '#333',
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
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    marginBottom: 30
  },
  saveButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
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
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  imageSection: {
    position: "relative",
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePicker: {
    width: width * 0.5,
    height: width * 0.35,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePickerPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePickerText: {
    marginTop: 8,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  changeImageButton: {
    position: "absolute",
    zIndex: 1,
    bottom: 10,
    right: 95,
    marginTop: 12,
    padding: 5,
    alignSelf: 'center',
    backgroundColor: "white",
    borderRadius: "50%"
  },
  changeImageText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
}); 