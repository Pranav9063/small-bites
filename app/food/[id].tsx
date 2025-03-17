import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ingredients = [
  { id: '1', name: 'Tomato', image: require('@/assets/images/menuItems/ingridients.jpeg') },
  { id: '2', name: 'Cheese', image: require('@/assets/images/menuItems/ingridients.jpeg') },
  { id: '3', name: 'Basil', image: require('@/assets/images/menuItems/ingridients.jpeg') },
  { id: '4', name: 'Olive', image: require('@/assets/images/menuItems/ingridients.jpeg') },
];

export default function FoodDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [quantity, setQuantity] = React.useState(1);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header Background */}
      <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Animated.Image 
            source={require('@/assets/images/canteenImg.png')} 
            style={[styles.foodImage, { transform: [{ scale: imageScale }] }]}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <View>
              <Text style={styles.title}>{params.name as string}</Text>
              <Text style={styles.subtitle}>Italian Cuisine</Text>
            </View>
            <Text style={styles.price}>${Number(params.price).toFixed(2)}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <View style={styles.statIconContainer}>
                <Ionicons name="star" size={16} color="#FFD337" />
              </View>
              <View>
                <Text style={styles.statValue}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            <View style={styles.stat}>
              <View style={styles.statIconContainer}>
                <Ionicons name="flame" size={16} color="#FF9500" />
              </View>
              <View>
                <Text style={styles.statValue}>{params.calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </View>
            <View style={styles.stat}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time" size={16} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.statValue}>20-30</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {params.description as string}. Our signature dish made with fresh ingredients 
              and prepared with love. Perfect blend of flavors that will satisfy your cravings.
            </Text>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ingredientsContainer}
            >
              {ingredients.map((ingredient, index) => (
                <View key={ingredient.id} style={styles.ingredientItem}>
                  <Image source={ingredient.image} style={styles.ingredientImage} />
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity 
            onPress={() => setQuantity(prev => prev + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.addToCartButton, styles.addToCartGradient]}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD337',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  ingredientsContainer: {
    paddingVertical: 8,
  },
  ingredientItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  ingredientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  ingredientName: {
    fontSize: 14,
    color: '#666',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 4,
    marginRight: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#333',
  },
  addToCartButton: {
    flex: 1,
  },
  addToCartGradient: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD337',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 