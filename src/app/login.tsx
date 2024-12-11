import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { getUsers, saveCurrentUser } from "../utils/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const users = await getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      await saveCurrentUser(user);
      router.replace("/home");
    } else {
      Alert.alert("Erreur", "Email ou mot de passe incorrect");
    }
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
      <CustomButton title="Se connecter" onPress={handleLogin} />
      <CustomButton
        title="S'inscrire"
        onPress={() => router.push("/register")}
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
