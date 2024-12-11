import { CustomButton } from "@/components/CustomButton";
import { saveCurrentUser } from "@/utils/storage";
import { router } from "expo-router";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function Profil() {
  const handleLogout = async () => {
    await saveCurrentUser(null as any);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <CustomButton
        title="Se déconnecter"
        onPress={handleLogout}
        variant="secondary"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(20 0 102)",
    flex: 1,
    justifyContent: "space-between",
  },

  title: {
    color: "whitesmoke",
    fontSize: 24,
    textAlign: "center",
  },
});
