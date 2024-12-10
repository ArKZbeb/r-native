import { makeRedirectUri, startAsync } from "expo-auth-session";
import { supabase } from "../../supabaseConfig";

export const signInWithGoogle = async (): Promise<void> => {
  try {
    const redirectUrl = makeRedirectUri({
      path: "auth/callback",
    });

    const authResponse = await startAsync({
      authUrl: `${supabase.auth.url}/authorize?provider=google&redirect_to=${redirectUrl}`,
      returnUrl: redirectUrl,
    });

    if (authResponse.type === "success") {
      await supabase.auth.setSession({
        access_token: authResponse.params.access_token,
        refresh_token: authResponse.params.refresh_token,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion Google:", error);
    throw error;
  }
};
