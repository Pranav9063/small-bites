import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/lib/context/AuthContext';
import { fetchCanteenReviews } from '@/lib/services/firestoreService';
// import { useTheme } from '@/lib/context/ThemeContext';

interface ReviewItem {
  id: string;
  canteenId: string;
  canteenRating: number;
  canteenReview: string;
  itemRatings: {
      itemName: string;
      itemId: string;
      rating: number;
      review: string;
  }[];
  userId: string;
  timestamp: number; // changed back to number
}

// Hardcoded color palette
const COLORS = {
  background: '#fff',
  card: '#fff',
  text: '#222',
  textSecondary: '#777',
  primary: '#1976d2',
  error: '#d32f2f',
};

const Reviews = () => {
  const { user } = useAuth();
  // const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [noCanteen, setNoCanteen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadReviews = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const result = await fetchCanteenReviews(user.uid);
      
      if (result.success) {
        if (result.message === "no-canteen") {
          setNoCanteen(true);
        } else {
          // Sort reviews by most recent first
          const sortedReviews = result.reviews.sort(
            (a: { timestamp: number }, b: { timestamp: number }) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setReviews(sortedReviews);
        }
      } else {
        setError("Failed to load reviews. Please try again later.");
      }
    } catch (err) {
      console.error("Error in loadReviews:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [user?.uid]);

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const formatTimeAgo = (timestamp: number) => {
    if (!timestamp && timestamp !== 0) return "Unknown date";
    const reviewDate = new Date(timestamp);
    if (isNaN(reviewDate.getTime())) {
      return "Unknown date";
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - reviewDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };

  const renderStars = (rating: number, size = 16) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name={rating >= star ? "star" : "star-border"}
            size={size}
            color={rating >= star ? "#FFD700" : "#CCCCCC"}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: ReviewItem }) => {
    const isExpanded = expandedReviews[item.id] || false;
    // Get last 4 digits/characters of order id
    const orderIdSuffix = item.id?.slice(-4) || item.id;
    return (
      <View style={[styles.reviewCard, { backgroundColor: COLORS.card }]}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <View>
              {/* Show last 4 digits of order id */}
              <Text style={[styles.reviewerName, { color: COLORS.text }]}>
                Order ID: {orderIdSuffix}
              </Text>
              <Text style={styles.reviewDate}>
                {formatTimeAgo(item.timestamp)}
              </Text>
            </View>
          </View>
          <View>
            {renderStars(item.canteenRating)}
          </View>
        </View>

        {/* Optionally, show user name again above the review text if you want it even more prominent */}
        {/* <Text style={[styles.userName, { color: COLORS.primary, fontWeight: 'bold', marginBottom: 4 }]}>
          {item.customerName || "Anonymous Customer"}
        </Text> */}

        {item.canteenReview ? (
          <Text style={[styles.reviewText, { color: COLORS.text }]}>
            {item.canteenReview}
          </Text>
        ) : null}

        {item.itemRatings && item.itemRatings.length > 0 && (
          <>
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => toggleExpandReview(item.id)}
            >
              <Text style={[styles.expandButtonText, { color: COLORS.primary }]}>
                {isExpanded ? "Hide item reviews" : `Show item reviews (${item.itemRatings.length})`}
              </Text>
              <MaterialIcons 
                name={isExpanded ? "expand-less" : "expand-more"} 
                size={18} 
                color={COLORS.primary} 
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.itemReviewsContainer}>
                {item.itemRatings.map((itemRating, index) => (
                  <View 
                    key={itemRating.itemId} 
                    style={[
                      styles.itemReview,
                      index < item.itemRatings.length - 1 && styles.itemReviewBorder
                    ]}
                  >
                    <View style={styles.itemReviewHeader}>
                      <Text style={[styles.itemName, { color: COLORS.text }]}>
                        {itemRating.itemName || `Item ${index + 1}`}
                      </Text>
                      {renderStars(itemRating.rating, 14)}
                    </View>
                    
                    {itemRating.review ? (
                      <Text style={[styles.itemReviewText, { color: COLORS.textSecondary }]}>
                        {itemRating.review}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.emptyText, { color: COLORS.text }]}>Loading reviews...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="error-outline" size={48} color={COLORS.error} />
          <Text style={[styles.emptyText, { color: COLORS.text }]}>{error}</Text>
        </View>
      );
    }

    if (noCanteen) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="store" size={48} color={COLORS.textSecondary} />
          <Text style={[styles.emptyText, { color: COLORS.text }]}>
            No canteen is associated with your account.
          </Text>
        </View>
      );
    }

    if (reviews.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="rate-review" size={48} color={COLORS.textSecondary} />
          <Text style={[styles.emptyText, { color: COLORS.text }]}>
            No reviews yet for your canteen.
          </Text>
          <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
            Reviews will appear here when customers rate their experience.
          </Text>
        </View>
      );
    }

    return null;
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReviews();
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Text style={[styles.pageTitle, { color: COLORS.text }]}>
        Customer Reviews
      </Text>
      
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  reviewCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    justifyContent: 'center',
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  itemReviewsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  itemReview: {
    padding: 12,
  },
  itemReviewBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemReviewText: {
    fontSize: 13,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
});

export default Reviews;