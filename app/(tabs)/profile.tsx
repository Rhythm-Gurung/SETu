import { useAuth } from '@/context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ChevronRight, LogIn, LogOut, User } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const { getProfile, onLogout } = useAuth();

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getUserDisplayName = (profile: any) => {
    if (!profile) return 'Guest';

    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile.first_name) {
      return profile.first_name;
    }
    if (profile.username) {
      return capitalizeFirstLetter(profile.username);
    }
    if (profile.email) {
      return profile.email.split('@')[0];
    }
    return 'User';
  };

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);

      const accessToken = await AsyncStorage.getItem('access_token');

      if (!accessToken) {
        console.log('No access token, loading dummy user');
        setIsLoggedIn(false);
        setUser({
          email: 'guest@example.com',
          username: 'Guest',
          first_name: null,
          last_name: null,
        });
        return;
      }

      setIsLoggedIn(true);

      // getProfile already extracts user data and caches it in AsyncStorage
      const userData = await getProfile!();

      if (userData) {
        setUser(userData);
        console.log('User profile loaded successfully');
        return;
      }

      // Fallback to cached user
      const cachedUser = await AsyncStorage.getItem('user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        console.log('Loaded cached user profile');
      } else {
        setUser({
          email: 'guest@example.com',
          username: 'Guest',
          first_name: null,
          last_name: null,
        });
      }
    } catch (err: any) {
      console.error('Profile load error:', err?.response?.data || err?.message || err);

      // Fallback to cached user on error
      const cachedUser = await AsyncStorage.getItem('user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        console.log('Loaded cached user after error');
      } else {
        setUser({
          email: 'guest@example.com',
          username: 'Guest',
          first_name: null,
          last_name: null,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [getProfile]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const performLogout = useCallback(async () => {
    setLoading(true);
    try {
      if (onLogout) {
        const result = await onLogout();

        console.log("Logout result:", result);

        // Clear user state and storage
        setUser(null);
        await AsyncStorage.multiRemove(['user', 'access_token', 'refresh_token']);

        // Set dummy user data for display
        setUser({
          email: 'guest@example.com',
          username: 'Guest',
          first_name: null,
          last_name: null,
        });
        setIsLoggedIn(false);

        Alert.alert("Success", "You have been logged out successfully.");

        // Navigate to home
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      console.error('Logout error:', err);

      // Even on error, clear local data and show dummy user
      setUser(null);
      await AsyncStorage.multiRemove(['user', 'access_token', 'refresh_token']);

      setUser({
        email: 'guest@example.com',
        username: 'Guest',
        first_name: null,
        last_name: null,
      });
      setIsLoggedIn(false);

      Alert.alert("Info", "You have been logged out locally.");
      router.replace('/(tabs)/home');
    } finally {
      setLoading(false);
    }
  }, [onLogout, router]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: performLogout },
      ],
    );
  }, [performLogout]);

  const handleLogin = useCallback(() => {
    router.push('/(auth)/login');
  }, [router]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#EFF5D2]">
        <ActivityIndicator size="large" color="#8FA31E" />
        <Text className="text-[#556B2F] mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#EFF5D2]">
      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        {/* User Info */}
        <View className="bg-white rounded-2xl p-6 mb-6 border border-[#C6D870]">
          <View className="items-center">
            <View className="w-24 h-24 bg-[#8FA31E] rounded-full justify-center items-center mb-4">
              <User size={36} color="#FFFFFF" />
            </View>
            <Text className="text-xl font-bold text-[#556B2F]">
              {getUserDisplayName(user)}
            </Text>
            <Text className="text-[#8FA31E] mt-1">
              {user?.email || 'user@example.com'}
            </Text>
            <Text className="text-xs text-gray-400 mt-2">
              Username: {user?.username || 'Not set'}
            </Text>
          </View>
        </View>

        {/* Conditional Login/Logout Button */}
        {isLoggedIn ? (
          <TouchableOpacity
            className="bg-white rounded-2xl p-5 flex-row items-center border border-red-200"
            onPress={handleLogout}
          >
            <View className="w-10 h-10 bg-red-50 rounded-lg justify-center items-center mr-4">
              <LogOut size={22} color="#DC2626" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-red-600">Logout</Text>
              <Text className="text-sm text-gray-500">Sign out from your account</Text>
            </View>
            <ChevronRight size={22} color="#9CA3AF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-white rounded-2xl p-5 flex-row items-center border border-[#8FA31E]"
            onPress={handleLogin}
          >
            <View className="w-10 h-10 bg-[#EFF5D2] rounded-lg justify-center items-center mr-4">
              <LogIn size={22} color="#556B2F" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[#556B2F]">Login</Text>
              <Text className="text-sm text-gray-500">Sign in to your account</Text>
            </View>
            <ChevronRight size={22} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;
