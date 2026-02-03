import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import SplashScreen from "./splashScreen";

const Index = () => {
  const router = useRouter();
  const { authState, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait for auth state to load

    const timer = setTimeout(() => {
      if (authState?.authenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [authState, loading, router]);

  return <SplashScreen />;
};

export default Index;
