import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  Platform,
  Image,
} from 'react-native';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

const reviews: Review[] = [
  {
    id: '1',
    userName: 'Pradneya',
    rating: 4.7,
    comment: 'The Pizza was good and the fries were crispy.',
    timeAgo: '10 minutes ago'
  },
  {
    id: '2',
    userName: 'Manav',
    rating: 3.5,
    comment: 'The Burger was spicier than expected.',
    timeAgo: '15 minutes ago'
  },
  {
    id: '3',
    userName: 'Pranav',
    rating: 4.2,
    comment: 'The Fries were good and the Burger was juicy.',
    timeAgo: '18 minutes ago'
  },
];

const ReviewScreen = () => {
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <Text key={index} style={styles.starIcon}>
            {index < Math.floor(rating) ? '★' : (index < rating ? '⭐' : '☆')}
          </Text>
        ))}
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>
            {item.userName.charAt(0)}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
      </View>
      {renderStars(item.rating)}
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reviewsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  reviewsList: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default ReviewScreen; 