import React, { createContext, useContext, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { AuthState, User } from "../utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ensure WebBrowser is properly redirected
WebBrowser.maybeCompleteAuthSession();

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

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId:
        "1094652425174-u5a1qb83iiemkuq4qvfmjsb06jhddag9.apps.googleusercontent.com",
    },
    { native: "nativequiz://" }
  );

  useEffect(() => {
    loadUser();
  }, []);

  // Handle Google Sign In Response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    } else if (response?.type === "error") {
      console.error("Google Sign In Error:", response.error);
    }
  }, [response]);

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await response.json();

      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      };

      await AsyncStorage.setItem("user", JSON.stringify(user));
      setState({ user, isLoading: false });
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
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
      const storedUserJson = await AsyncStorage.getItem(email);
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

      await AsyncStorage.setItem("user", JSON.stringify(user));
      setState({ user, isLoading: false });
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!request) {
        throw new Error("Google Auth request not initialized");
      }

      const result = await promptAsync();

      if (result.type === "error") {
        throw new Error(result.error?.message || "Google sign in failed");
      }

      if (result.type !== "success") {
        throw new Error("Google sign in was cancelled");
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
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await hashPassword(password);
      const newUser = {
        id: Crypto.randomUUID(),
        email,
        password: hashedPassword,
      };

      await AsyncStorage.setItem(email, JSON.stringify(newUser));
      const user: User = {
        id: newUser.id,
        email: newUser.email,
      };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setState({ user, isLoading: false });
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setState({ user: null, isLoading: false });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const hashPassword = async (password: string): Promise<string> => {
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
