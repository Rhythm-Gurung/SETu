import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

const SplashScreen = () => {
  return (
    <View className="flex-1 bg-blue-lightest justify-center items-center">
      <View className="items-center">
        <Image
          source={require('@/assets/images/icon.png')}
          className="w-32 h-32 mb-6"
          resizeMode="contain"
        />

        <Text className="text-3xl font-extrabold text-white mb-1">
          SETu
        </Text>

        <Text className="text-sm text-gray-550 mb-6">
          Find your perfect trainer
        </Text>

        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    </View>
  );
};

export default SplashScreen;
