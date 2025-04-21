import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Theme } from "@/constants/Theme";
import { CartItem } from "@/lib/context/CartContext";

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  canteenId: string;
  canteenName: string;
  cart: CartItem[];
  theme: Theme;
  onSubmitReview: (review: {
    orderId: string;
    canteenId: string;
    canteenRating: number;
    canteenReview: string;
    itemRatings: {
      itemId: string;
      rating: number;
      review: string;
    }[];
  }) => Promise<void>;
}

const ReviewModal = ({
  visible,
  onClose,
  orderId,
  canteenId,
  canteenName,
  cart,
  theme,
  onSubmitReview,
}: ReviewModalProps) => {
  const [canteenRating, setCanteenRating] = useState(0);
  const [canteenReview, setCanteenReview] = useState("");
  const [itemRatings, setItemRatings] = useState<
    {
      itemId: string;
      name: string;
      rating: number;
      review: string;
    }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0); // 0: canteen, 1: items

  // Initialize item ratings and reset step on open
  React.useEffect(() => {
    if (visible && cart?.length > 0) {
      const initialItemRatings = cart.map((item) => ({
        itemId: item.id,
        name: item.name,
        rating: 0,
        review: "",
      }));
      setItemRatings(initialItemRatings);
      setStep(0);
      setCanteenRating(0);
      setCanteenReview("");
    }
  }, [visible, cart]);

  const handleRatingChange = (rating: number, type: "canteen" | string) => {
    if (type === "canteen") {
      setCanteenRating(rating);
    } else {
      setItemRatings((prev) =>
        prev.map((item) => (item.itemId === type ? { ...item, rating } : item))
      );
    }
  };

  const handleReviewChange = (text: string, type: "canteen" | string) => {
    if (type === "canteen") {
      setCanteenReview(text);
    } else {
      setItemRatings((prev) =>
        prev.map((item) =>
          item.itemId === type ? { ...item, review: text } : item
        )
      );
    }
  };

  const handleNext = () => {
    if (step === 0) {
      if (canteenRating === 0) {
        Alert.alert(
          "Rating Required",
          "Please rate the canteen before continuing"
        );
        return;
      }
      setStep(1);
    }
  };

  const handleBack = () => {
    if (step === 1) setStep(0);
  };

  const handleSubmit = async () => {
    if (canteenRating === 0) {
      Alert.alert(
        "Rating Required",
        "Please rate the canteen before submitting"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare the review data
      const reviewData = {
        orderId,
        canteenId,
        canteenRating,
        canteenReview,
        itemRatings: itemRatings.map((item) => ({
          itemName: item.name,
          itemId: item.itemId,
          rating: item.rating,
          review: item.review,
        })),
      };

      // Call the passed function to handle the review submission
      await onSubmitReview(reviewData);

      // Reset the form
      setCanteenRating(0);
      setCanteenReview("");
      setItemRatings([]);

      // Close the modal
      onClose();

      // Show success message
      Alert.alert("Review Submitted", "Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, type: "canteen" | string) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingChange(star, type)}
            style={styles.starButton}
          >
            <MaterialIcons
              name={rating >= star ? "star" : "star-border"}
              size={28}
              color={rating >= star ? "#FFD700" : "#CCCCCC"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rate Your Experience</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {step === 0 && (
              <>
                {/* Canteen Rating Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Rate {canteenName}</Text>
                  {renderStars(canteenRating, "canteen")}

                  <Text style={styles.inputLabel}>
                    Add a comment (optional)
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Share details of your experience at this canteen..."
                    multiline
                    numberOfLines={3}
                    value={canteenReview}
                    onChangeText={(text) => handleReviewChange(text, "canteen")}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.nextButton,
                    { backgroundColor: theme.colors.primary },
                    canteenRating === 0 && styles.disabledButton,
                  ]}
                  disabled={canteenRating === 0}
                  onPress={handleNext}
                >
                  <Text style={styles.submitButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 1 && (
              <>
                <Text style={styles.sectionTitle}>Rate Individual Items</Text>
                {itemRatings.map((item, index) => (
                  <View
                    key={item.itemId}
                    style={[
                      styles.itemSection,
                      index < itemRatings.length - 1 && styles.itemBorder,
                    ]}
                  >
                    <Text style={styles.itemName}>{item.name}</Text>
                    {renderStars(item.rating, item.itemId)}

                    <TextInput
                      style={styles.itemReviewInput}
                      placeholder="Comment on this item (optional)"
                      multiline
                      numberOfLines={2}
                      value={item.review}
                      onChangeText={(text) =>
                        handleReviewChange(text, item.itemId)
                      }
                    />
                  </View>
                ))}
                <View style={styles.carouselButtonRow}>
                  <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: "#eee" }]}
                    onPress={handleBack}
                  >
                    <Text style={[styles.submitButtonText, { color: "#333" }]}>
                      Back
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: theme.colors.primary },
                      isSubmitting && styles.disabledButton,
                    ]}
                    disabled={isSubmitting}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  starButton: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 16,
  },
  itemSection: {
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  itemReviewInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  nextButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  carouselButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
});

export default ReviewModal;
