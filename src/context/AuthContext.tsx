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
  ) => Promise<Request<void>>;
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

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "1094652425174-u5a1qb83iiemkuq4qvfmjsb06jhddag9.apps.googleusercontent.com",
    androidClientId:
      "1094652425174-l4ffuimej211ch4dg088it8kvbmapvlu.apps.googleusercontent.com",
    iosClientId:
      "1094652425174-d0d1v6mqcfne3as4kiqevpuf0rk2ch5t.apps.googleusercontent.com",
  });

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
        console.error("Error fetching user info:");
      }

      const userData = await response.json();
      const storedUserJson = await AsyncStorage.getItem(userData.email);
      let expTotal = 0;
      if (storedUserJson) {
        const signingUser = JSON.parse(storedUserJson);
        expTotal = signingUser.expTotal;
      }
      const user = new User(
        userData.id,
        userData.email,
        "",
        userData.picture,
        expTotal
      );

      await AsyncStorage.setItem(userData.email, JSON.stringify(user));
      await AsyncStorage.setItem("session", JSON.stringify(user));
      setState({ user, isLoading: false });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem("session");
      if (userJson) {
        const storedUser = JSON.parse(userJson);
        const user = new User(
          storedUser.id,
          storedUser.email,
          storedUser.password,
          storedUser.profilePhoto,
          storedUser.expTotal
        );
        setState({ user, isLoading: false });
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

      const user = new User(
        storedUser.id,
        storedUser.email,
        storedUser.password,
        storedUser.profilePhoto,
        storedUser.expTotal
      );

      await AsyncStorage.setItem("session", JSON.stringify(user));
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
  ): Promise<Request<void>> => {
    try {
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser) {
        return {
          success: false,
          error: { message: "Email déjà utilisé", statusCode: 400 },
        };
      }

      const hashedPassword = await hashPassword(password);
      const newUser = new User(
        Crypto.randomUUID(),
        email,
        hashedPassword,
        profilePhoto,
        0
      );

      await AsyncStorage.setItem(email, JSON.stringify(newUser));

      return { success: true };
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
      await AsyncStorage.removeItem("session");
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

export const saveUser = async (user: User) => {
  await AsyncStorage.setItem(user.email, JSON.stringify(user));
  await AsyncStorage.setItem("session", JSON.stringify(user));
};

export const deleteUser = async (user: User) => {
  await AsyncStorage.removeItem(user.email);
  await AsyncStorage.removeItem("session");
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
