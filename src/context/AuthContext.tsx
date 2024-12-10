import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as Google from "expo-auth-session/providers/google";
import * as Crypto from "expo-crypto";
import { AuthState, User } from "../../utils/types";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  // Configure Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    clientId:
      "1094652425174-u5a1qb83iiemkuq4qvfmjsb06jhddag9.apps.googleusercontent.com",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await SecureStore.getItemAsync("user");
      if (userJson) {
        setState({ user: JSON.parse(userJson), isLoading: false });
      } else {
        setState({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setState({ user: null, isLoading: false });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Dans un cas réel, vous feriez une requête à votre backend
      // Ici, on vérifie juste si l'utilisateur existe dans le stockage local
      const storedUserJson = await SecureStore.getItemAsync(email);
      if (!storedUserJson) {
        throw new Error("User not found");
      }

      const storedUser = JSON.parse(storedUserJson);
      const hashedPassword = await hashPassword(password);

      if (storedUser.password !== hashedPassword) {
        throw new Error("Invalid password");
      }

      const user: User = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
      };

      await SecureStore.setItemAsync("user", JSON.stringify(user));
      setState({ user, isLoading: false });
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === "success") {
        const { authentication } = result;

        // Récupération des informations de l'utilisateur avec le token d'accès
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: {
              Authorization: `Bearer ${authentication?.accessToken}`,
            },
          }
        );

        const userData = await userInfoResponse.json();

        // Création de l'utilisateur avec les vraies données Google
        const user: User = {
          id: userData.id, // Google User ID
          email: userData.email,
          name: userData.name,
        };

        // Stockage des informations utilisateur
        await SecureStore.setItemAsync("user", JSON.stringify(user));
        setState({ user, isLoading: false });

        // Optionnel : stockage du token pour une utilisation ultérieure
        if (authentication?.accessToken) {
          await SecureStore.setItemAsync(
            "googleToken",
            authentication.accessToken
          );
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to sign in with Google"
      );
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const existingUser = await SecureStore.getItemAsync(email);
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await hashPassword(password);
      const newUser = {
        id: Crypto.randomUUID(),
        email,
        password: hashedPassword,
      };

      await SecureStore.setItemAsync(email, JSON.stringify(newUser));
      const user: User = {
        id: newUser.id,
        email: newUser.email,
      };
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      setState({ user, isLoading: false });
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      setState({ user: null, isLoading: false });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const hashPassword = async (password: string): Promise<string> => {
    const data = new TextEncoder().encode(password);
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    return hash;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
