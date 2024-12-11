import {
  View,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { CustomInput } from "@/components/CustomInput";
import { CustomButton } from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const { signUp } = useAuth();

  const defaultProfilePhoto = require("@/assets/images/default-profile.jpeg");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfilePhoto(base64Image);
    }
  };

  const getDefaultProfilePhotoBase64 = async () => {
    try {
      const asset = Image.resolveAssetSource(defaultProfilePhoto);
      if (!asset?.uri) return null;

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error converting default photo to base64:", error);
      return null;
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Les mots de passe ne correspondent pas");
      return;
    }

    let photoToUse = profilePhoto;
    if (!photoToUse) {
      photoToUse = await getDefaultProfilePhotoBase64();
    }

    const signUpResult = await signUp(email, password, photoToUse || "");

    if (!signUpResult.success) {
      switch (signUpResult.error.statusCode) {
        case 400:
          Alert.alert("Error", "Email déjà utilisé");
          break;
        case 500:
          Alert.alert("Error", "Erreur lors de l'inscription");
          break;
        default:
          Alert.alert("Error", "Erreur lors de l'inscription");
          break;
      }
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={pickImage}
        style={styles.profilePhotoContainer}
      >
        <Image
          source={profilePhoto ? { uri: profilePhoto } : defaultProfilePhoto}
          style={styles.profilePhoto}
        />
        <View style={styles.editOverlay}>
          <Text style={styles.editText}>Modifier</Text>
        </View>
      </TouchableOpacity>

      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomInput
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <CustomButton title="S'inscrire" onPress={handleRegister} />
      <CustomButton
        title="Retour"
        onPress={() => router.back()}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profilePhotoContainer: {
    marginBottom: 20,
    position: "relative",
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 20,
  },
  editText: {
    color: "white",
    fontSize: 12,
  },
});
