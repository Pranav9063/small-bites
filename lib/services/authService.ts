import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

export const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error("Google Sign-In failed");
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);

    return userInfo;
  } catch (err) {
    const error = err as any;
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error("User cancelled the login flow");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error("Sign in is in progress already");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error("Play services not available or outdated");
    } else {
      throw new Error(error.message);
    }
  }
};

export const googleSignOut = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
