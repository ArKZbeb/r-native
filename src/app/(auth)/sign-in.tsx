import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { CustomInput } from "@/components/CustomInput";
import { CustomButton } from "@/components/CustomButton";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    const signInResult = await signIn(email, password);

    if (!signInResult.success) {
      Alert.alert("Error", signInResult.error.message);
      return;
    }

    router.replace({
      pathname: "/",
    });
  };

  const handleGoogleSignIn = async () => {
    const signInResult = await signInWithGoogle();

    if (!signInResult.success) {
      switch (signInResult.error.statusCode) {
        case 400:
          Alert.alert("Error", "Connexion refusée");
          break;
        case 500:
          Alert.alert("Error", "Erreur lors de la connexion");
          break;
        default:
          Alert.alert("Error", "Erreur lors de la connexion");
          break;
      }
      return;
    }

    router.replace({
      pathname: "/",
    });
  };

  return (
    <View style={styles.container}>
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
      <CustomButton title="Se connecter" onPress={handleSignIn} />
      <CustomButton
        title="Se connecter avec Google"
        onPress={handleGoogleSignIn}
      />
      <CustomButton
        title="S'inscrire"
        onPress={() => router.push("/sign-up")}
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
});
