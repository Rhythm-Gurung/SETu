import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({ email: '' });
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const router = useRouter();
  const { onForgetPassword } = useAuth();

  const handleResetPassword = async () => {
    const newErrors = { email: '' };

    // Validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every(error => error === '');
    
    if (isValid) {
        try{
          setIsLoading(true);
          const result = await onForgetPassword!(email);

          if(result){
            Alert.alert('Success', 'OPT has been send to your Email.');
            router.navigate({
              pathname: '/(auth)/verifyEmail',
              params: { email: email, type: 'forgot-password' },
            });
          }
        }catch(error:any){
          Alert.alert(
            'Error',
            error.response?.data?.detail || 'An error occurred while sending reset instructions.'
          );
        }finally{
          setIsLoading(false);
        }
      } else{
        Alert.alert('Error', 'Please fill the requirements before submitting.');
      }
  };

  const handleBackToLogin = () => {
    router.navigate('/(auth)/login');
  };

  const handleResetAnother = () => {
    setEmail('');
    setIsSubmitted(false);
    setErrors({ email: '' });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-blue-lightest"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center items-center px-6 py-12">
            {/* Main Card Container */}
            <View className="w-full max-w-sm">
              {/* Card */}
              <View
                className="rounded-2xl bg-blue-lighter border border-blue-light/60 shadow-lg p-6 mb-6"
              >
                {/* Card Header */}
                <View className="items-center mb-6">
                  <Text
                    className="text-3xl font-extrabold mb-2 text-white"
                  >
                    Forgot Password
                  </Text>
                  <Text
                    className="text-center text-sm text-gray-550"
                  >
                    {isSubmitted 
                      ? 'Check your email for reset instructions' 
                      : 'Enter your email to reset your password'
                    }
                  </Text>
                </View>

                {/* Success Message */}
                {isSubmitted ? (
                  <View className="space-y-6">
                    {/* Success Icon */}
                    <View className="items-center">
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center mb-4 bg-blue-lightest/40"
                      >
                        <Text className="text-2xl text-blue-medium">✓</Text>
                      </View>
                      <Text 
                        className="text-center text-sm mb-2 text-gray-550"
                      >
                        Reset email sent successfully!
                      </Text>
                      <Text
                        className="text-center text-xs text-gray-550"
                      >
                        We&apos;ve sent instructions to{'\n'}
                        <Text className="text-blue-dark font-semibold underline">{email}</Text>
                      </Text>
                    </View>


                    <View className="space-y-3">
                      <TouchableOpacity
                        className="rounded-xl py-3 items-center bg-blue-dark"
                        onPress={handleBackToLogin}
                      >
                        <Text className="font-semibold text-base text-white">
                          Back to Login
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        className="rounded-xl py-3 items-center border border-blue-light"
                        onPress={handleResetAnother}
                      >
                        <Text 
                          className="font-semibold text-base text-gray-650"
                        >
                          Reset Another Email
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* Email Input Form */
                  <View className="space-y-8">
                    {/* Form Fields */}
                    <View className="space-y-6">
                      {/* Email Input */}
                      <View>
                        <Text
                          className="text-sm font-semibold uppercase text-gray-550 mb-2"
                        >
                          Email Address
                        </Text>
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-base bg-blue-lighter text-white mb-2 ${
                            errors.email
                              ? 'border-[#EF4444]'
                              : isEmailFocused
                                ? 'border-blue-dark'
                                : 'border-blue-light'
                          }`}
                          placeholder="m@example.com"
                          placeholderTextColor="#6B7280"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          onFocus={() => setIsEmailFocused(true)}
                          onBlur={() => setIsEmailFocused(false)}
                        />
                        {errors.email && (
                          <Text className="text-sm text-red-500 mb-2">
                            {errors.email}
                          </Text>
                        )}
                      </View>
                      {/* Reset Button */}
                      <TouchableOpacity
                        className={`rounded-xl py-3 items-center bg-blue-dark mb-2 mt-2 ${
                          isLoading ? 'opacity-70' : ''
                        }`}
                        onPress={handleResetPassword}
                        disabled={isLoading}
                      >
                        <Text className="font-semibold text-base text-white">
                          {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Back to Login link */}
                    <View className="items-center">
                      <Text
                        className="text-sm text-gray-550"
                      >
                        Remember your password?{' '}
                        <Text 
                          className="font-semibold text-blue-dark"
                          onPress={handleBackToLogin}
                        >
                          Back to Login
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Terms and Privacy */}
              <View className="items-center">
                <Text
                  className="text-[11px] text-center text-gray-550"
                >
                  By clicking continue, you agree to our{' '}
                  <Text
                    className="font-semibold text-blue-dark"
                    onPress={() => router.navigate('/')}
                  >
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text
                    className="font-semibold text-blue-dark"
                    onPress={() => router.navigate('/')}
                  >
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordScreen;