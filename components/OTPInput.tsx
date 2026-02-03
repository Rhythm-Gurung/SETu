// components/OTPInput.tsx
import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface OTPInputProps {
  verifyCode: string;
  setVerifyCode: (code: string) => void;
  loading: boolean;
  isOtpFocused: boolean;
  setIsOtpFocused: (focused: boolean) => void;
  errors: { email?: string; verifyCode?: string };
  type: 'email-verification' | 'password-reset';
}

const OTPInput: React.FC<OTPInputProps> = ({
  verifyCode,
  setVerifyCode,
  loading,
  isOtpFocused,
  setIsOtpFocused,
  errors,
  type
}) => {
  const getPlaceholder = () => {
    return type === 'email-verification' 
      ? "Enter 6-digit verification code" 
      : "Enter 6-digit password reset code";
  };

  return (
    <View className="mb-6">
      <TextInput 
        className={`w-full h-14 bg-white border-2 rounded-lg px-4 text-lg text-center font-bold ${
          errors.verifyCode 
            ? 'border-[#EF4444]' 
            : isOtpFocused 
            ? 'border-[#556B2F]' 
            : 'border-[#969799]'
        }`}
        style={{ 
          borderColor: '#C6D870',
          color: '#556B2F'
        }}
        placeholder={getPlaceholder()}
        placeholderTextColor="#969799"
        keyboardType="number-pad"
        maxLength={6}
        value={verifyCode}
        onChangeText={setVerifyCode}
        editable={!loading}
        onFocus={() => setIsOtpFocused(true)}
        onBlur={() => setIsOtpFocused(false)}
      />
      {errors.verifyCode ? (
        <Text className="mt-2 text-sm text-red-500 text-center">
          {errors.verifyCode}
        </Text>
      ) : null}
    </View>
  );
};

export default OTPInput;