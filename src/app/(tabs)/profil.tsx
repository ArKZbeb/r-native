import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { CustomButton } from "@/components/CustomButton";
import { deleteUser, useAuth } from "@/context/AuthContext";
import { ExperienceProgressBar } from "@/components/ExperienceProgressBar";

export default function Home() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const deleteAcount = async () => {
    if (user != null) {
      await deleteUser(user);
      await signOut();
      router.replace("/");
    }
  };

  const getImageSource = () => {
    if (!user?.profilePhoto) {
      return require("@/assets/images/default-profile.jpeg");
    }
    return { uri: user.profilePhoto };
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={getImageSource()} style={styles.profileImage} />
        <Text style={styles.title}>{user?.email}</Text>
      </View>

      {user && <ExperienceProgressBar expTotal={user.expTotal} />}

      <View style={styles.profilBottom}>
        <CustomButton
          title="Se déconnecter"
          onPress={handleLogout}
          variant="secondary"
        />

        <TouchableOpacity onPress={deleteAcount}>
          <Text style={styles.deleteBtn}>delete acount</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(233, 236, 239)",
    paddingVertical: 30,
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    marginHorizontal: "auto",
  },

  profilBottom: {
    width: "80%",
    display: "flex",
  },

  deleteBtn: {
    margin: "auto",
    color: "red",
    fontSize: 18,
  },
});
