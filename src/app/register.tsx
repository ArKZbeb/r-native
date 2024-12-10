import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { CustomInput } from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import { getUsers, saveUsers } from "../../utils/storage";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lles mots de passe ne correspondent pas");
      return;
    }

    const users = await getUsers();
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      Alert.alert("Cet email est déjà utilisé");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
    };

    await saveUsers([...users, newUser]);
    Alert.alert("Succès", "Compte créé avec succès", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
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
});
