import React, { createContext, useContext, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { AuthState, User } from "@/types/auth.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Request } from "@/types/request";

// Ensure WebBrowser is properly redirected
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<Request<User>>;
  signInWithGoogle: () => Promise<Request<void>>;
  signUp: (
    email: string,
    password: string,
    profilePhoto: string
  ) => Promise<Request<User>>;
  signOut: () => Promise<Request<void>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId:
        "1094652425174-u5a1qb83iiemkuq4qvfmjsb06jhddag9.apps.googleusercontent.com",
    },
    {
      native: "nativequiz://",
    }
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
        profilePhoto: userData.picture,
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

  const signIn = async (
    email: string,
    password: string
  ): Promise<Request<User>> => {
    try {
      const storedUserJson = await AsyncStorage.getItem(email);
      if (!storedUserJson) {
        return {
          success: false,
          error: { message: "Utilisateur non trouvé", statusCode: 404 },
        };
      }

      const storedUser = JSON.parse(storedUserJson);
      const hashedPassword = await hashPassword(password);

      if (storedUser.password !== hashedPassword) {
        return {
          success: false,
          error: { message: "Mot de passe incorrect", statusCode: 401 },
        };
      }

      const user: User = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        profilePhoto: storedUser.profilePhoto,
      };

      await AsyncStorage.setItem("user", JSON.stringify(user));
      setState({ user, isLoading: false });

      return { success: true, data: user };
    } catch (error) {
      console.error("Error signing in:", error);
      return {
        success: false,
        error: { message: "Erreur lors de la connexion", statusCode: 500 },
      };
    }
  };

  const signInWithGoogle = async (): Promise<Request<void>> => {
    try {
      if (!request) {
        return {
          success: false,
          error: {
            message: "Google Auth request not initialized",
            statusCode: 500,
          },
        };
      }

      const result = await promptAsync();

      if (result.type === "error") {
        return {
          success: false,
          error: { message: "Google sign in failed", statusCode: 400 },
        };
      }

      if (result.type !== "success") {
        return {
          success: false,
          error: { message: "Google sign in was cancelled", statusCode: 400 },
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return {
        success: false,
        error: { message: "Erreur lors de la connexion", statusCode: 500 },
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    profilePhoto: string
  ): Promise<Request<User>> => {
    try {
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser) {
        return {
          success: false,
          error: { message: "Email déjà utilisé", statusCode: 400 },
        };
      }

      const hashedPassword = await hashPassword(password);
      const newUser = {
        id: Crypto.randomUUID(),
        email,
        password: hashedPassword,
        profilePhoto,
      };

      await AsyncStorage.setItem(email, JSON.stringify(newUser));
      const user: User = {
        id: newUser.id,
        email: newUser.email,
        profilePhoto,
      };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setState({ user, isLoading: false });

      return { success: true, data: user };
    } catch (error) {
      console.error("Error signing up:", error);
      return {
        success: false,
        error: { message: "Erreur lors de l'inscription", statusCode: 500 },
      };
    }
  };

  const signOut = async (): Promise<Request<void>> => {
    try {
      await AsyncStorage.removeItem("user");
      setState({ user: null, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return {
        success: false,
        error: { message: "Erreur lors de la déconnexion", statusCode: 500 },
      };
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
