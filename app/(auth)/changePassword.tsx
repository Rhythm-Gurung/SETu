import { useAuth } from '@/context/authContext';
import { getPasswordValidationMessage } from '@/utils/passwordValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ChangePassword = () => {
    const { email: paramEmail } = useLocalSearchParams();
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [errors, setErrors] = useState({
        confirmPassword: '',
        newPassword: ''
    })

    const router = useRouter();
    const { onChangePassword } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);
    const currentScrollY = useRef(0);

    const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    const email = Array.isArray(paramEmail) ? paramEmail[0] : paramEmail || '';

    const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    }

    useEffect(() => {
        const getResetToken = async () => {
            try {
                const token = await AsyncStorage.getItem('reset_token');
                if (token) {
                    setResetToken(token);
                    console.log("Reset token retrieved:", token);
                } else {
                    console.log("No reset token found");
                }
            } catch (error) {
                console.error("Error retrieving reset token:", error);
            }
        };

        getResetToken();
    }, []);

    const handleResetPassword = async () => {
        const newErrors = {
            confirmPassword: '',
            newPassword: ''
        };  

        if (!newPassword) newErrors.newPassword = 'Password is required';
        if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (newPassword) {
            const passwordError = getPasswordValidationMessage(newPassword);
            if (passwordError) {
                newErrors.newPassword = passwordError;
            }
        }

        setErrors(newErrors);

        const isValid = Object.values(newErrors).every(error => error === '');
        if (!isValid) {
            return;
        }

        if (!resetToken) {
            Alert.alert('Error', 'Reset token not found. Please restart the password reset process.');
            return;
        }

        try {
            setLoading(true);
            await onChangePassword!(confirmPassword, newPassword, resetToken);
            
            Alert.alert('Success', 'Password reset successfully!');
            router.navigate('/(auth)/login');
            
        } catch (error: any) {
            console.log("Password reset error:", error);
            Alert.alert(
                'Reset Failed',
                error.response?.data?.detail || error.message || 'An error occurred while resetting password'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            style={{ backgroundColor: '#EFF5D2' }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                onScroll={(e) => {
                    currentScrollY.current = e.nativeEvent.contentOffset.y;
                }}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 justify-center items-center pb-24 pt-16 px-6">
                    {/* Main Card Container */}
                    <View className="w-full max-w-sm">
                        {/* Card */}
                        <View 
                            className="rounded-2xl shadow-lg p-6 mb-6"
                            style={{ 
                                backgroundColor: '#FFFFFF',
                                borderColor: '#C6D870',
                                borderWidth: 1
                            }}
                        >
                            {/* Card Header */}
                            <View className="items-center mb-6">
                                <Text 
                                    className="text-2xl font-bold mb-2 text-blue-dark"
                                >
                                    Create New Password
                                </Text>
                                <Text 
                                    className="text-center text-sm mb-1 text-gray-650"
                                >
                                    Create a new password for your account
                                </Text>
                                <Text 
                                    className="text-center text-sm font-semibold"
                                    style={{ textDecorationLine: 'underline'}}
                                >
                                    {email}
                                </Text>
                            </View>

                            {/* New Password Input */}
                            <View className="mb-4">
                                <Text 
                                    className="text-sm font-medium mb-2"
                                    style={{ color: '#556B2F' }}
                                >
                                    New Password
                                </Text>
                                <View className='relative'>
                                    <TextInput
                                        className={`border-2 rounded-lg px-4 py-3 text-base bg-white ${
                                        errors.newPassword 
                                            ? 'border-[#EF4444]' 
                                            : isNewPasswordFocused 
                                            ? 'border-[#556B2F]' 
                                            : 'border-[#969799]'
                                        }`}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder="Enter new password"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        onFocus={() => {
                                          setIsNewPasswordFocused(true);
                                          setTimeout(() => {
                                            scrollViewRef.current?.scrollTo({
                                              y: currentScrollY.current + 100,
                                              animated: true,
                                            });
                                          }, Platform.OS === 'ios' ? 50 : 100);
                                        }}
                                        onBlur={() => setIsNewPasswordFocused(false)}
                                        secureTextEntry={!isPasswordVisible}
                                    />
                                    <TouchableOpacity
                                        className="absolute right-3 top-3"
                                        onPress={togglePasswordVisibility}
                                    >
                                        {isPasswordVisible ? (
                                        <EyeOff size={20} color="#969799" />
                                        ) : (
                                        <Eye size={20} color="#969799" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {errors.newPassword && (
                                    <Text className="text-sm text-red-500 mt-2">
                                    {errors.newPassword}
                                    </Text>
                                )}
                            </View>

                            {/* Confirm Password Input */}
                            <View className="mb-6">
                                <Text 
                                    className="text-sm font-medium mb-2"
                                    style={{ color: '#556B2F' }}
                                >
                                    Confirm Password
                                </Text>
                                <View 
                                    className="relative">
                                    <TextInput
                                        className={`border-2 rounded-lg px-4 py-3 text-base bg-white ${
                                        errors.confirmPassword 
                                            ? 'border-[#EF4444]' 
                                            : isConfirmPasswordFocused 
                                            ? 'border-[#556B2F]' 
                                            : 'border-[#969799]'
                                        }`}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder="Confirm new password"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        onFocus={() => {
                                          setIsConfirmPasswordFocused(true);
                                          setTimeout(() => {
                                            scrollViewRef.current?.scrollTo({
                                              y: currentScrollY.current + 140,
                                              animated: true,
                                            });
                                          }, Platform.OS === 'ios' ? 50 : 100);
                                        }}
                                        onBlur={() => setIsConfirmPasswordFocused(false)}
                                        secureTextEntry={!isConfirmPasswordVisible}
                                    />
                                    <TouchableOpacity
                                        className="absolute right-3 top-3"
                                        onPress={toggleConfirmPasswordVisibility}
                                        >
                                        {isConfirmPasswordVisible ? (
                                            <EyeOff size={20} color="#969799" />
                                        ) : (
                                            <Eye size={20} color="#969799" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {errors.confirmPassword && (
                                    <Text className="text-sm text-red-500 mt-2">
                                    {errors.confirmPassword}
                                    </Text>
                                )}
                            </View>

                            {/* Reset Password Button */}
                            <TouchableOpacity
                                className={`h-14 rounded-lg justify-center items-center mb-4 bg-blue-dark ${
                                    loading ? 'opacity-70' : ''
                                }`}
                                onPress={handleResetPassword}
                                disabled={loading}
                            >
                                <Text className="text-white text-lg font-semibold">
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </Text>
                            </TouchableOpacity>

                            {/* Back Link */}
                            <View className="items-center">
                                <Text 
                                    className="text-sm"
                                    style={{ color: '#556B2F' }}
                                >
                                    Remember your password?{' '}
                                    <Text 
                                        className="font-semibold underline text-blue-dark"
                                        onPress={() => router.navigate('/(auth)/login')}
                                    >
                                        Sign in
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        {/* Terms and Privacy */}
                        <View className="items-center">
                            <Text 
                                className="text-xs text-center"
                                style={{ color: '#8FA31E' }}
                            >
                                By resetting your password, you agree to our{' '}
                                <Text 
                                    className="underline"
                                    style={{ color: '#556B2F' }}
                                    onPress={() => router.navigate('/')}
                                >
                                    Terms of Service
                                </Text>{' '}
                                and{' '}
                                <Text 
                                    className="underline"
                                    style={{ color: '#556B2F' }}
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
    );
}

export default ChangePassword;