import { View, Text, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { CustomButton } from "@/components/CustomButton";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const getImageSource = () => {
    if (!user?.profilePhoto) {
      return require("@/assets/images/default-profile.jpeg");
    }
    // Handle both base64 and URI formats
    return { uri: user.profilePhoto };
  };

  return (
    <View style={styles.container}>
      <Image source={getImageSource()} style={styles.profileImage} />
      <Text style={styles.welcome}>Bienvenue {user?.email}!</Text>
      <CustomButton
        title="Se déconnecter"
        onPress={handleLogout}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(20 0 102)",
    paddingVertical: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    marginBottom: 20,
    color: "whitesmoke",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});
