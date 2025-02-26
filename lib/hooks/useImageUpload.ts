import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";

export const useImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image) return null;
    setUploading(true);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `canteen_${Date.now()}.jpg`;
      const storageRef = storage().ref().child(`canteen_images/${filename}`);
      await storageRef.put(blob);

      const downloadURL = await storageRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    } finally {
        setUploading(false);
    }
  };

  return { image, pickImage, uploadImage, uploading };
};
