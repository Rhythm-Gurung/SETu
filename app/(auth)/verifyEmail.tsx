import OTPInput from '@/components/OTPInput';
import { useAuth } from '@/context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const VerifyEmail = () => {
    const { email: paramEmail, type: paramType } = useLocalSearchParams();
    const [verifyCode, setVerifyCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ email: string }>({ email: '' });
    const [isOtpFocused, setIsOtpFocused] = useState(false);

    const router = useRouter();
    const { onVerifyEmail, onResendOTP, onVerifyForgotPassword } = useAuth();

    const email = Array.isArray(paramEmail) ? paramEmail[0] : paramEmail || '';
    const type = Array.isArray(paramType) ? paramType[0] : paramType || 'email-verification';

    const isEmailVerification = type === 'email-verification';
    const isForgotPassword = type === 'forgot-password'; // Add explicit check

    const getTitle = () => {
        return isEmailVerification ? 'Verify Your Email' : 'Reset Your Password';
    };

    const getDescription = () => {
        return isEmailVerification 
            ? 'Enter the 6-digit code sent to' 
            : 'Enter the 6-digit code to reset your password for';
    };

    const getButtonText = () => {
        if (loading) {
            return isEmailVerification ? 'Verifying...' : 'Verifying...';
        }
        return isEmailVerification ? 'Verify Email' : 'Reset Password';
    };

    const handleVerify = async () => {
        console.log("Starting verification process..."); 

        const newErrors = { email: '', verifyCode: '' };

        if (!email || !verifyCode) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (verifyCode.length !== 6) {
            Alert.alert('Error', 'Please enter 6-digit verification code');
            return;
        }

        setErrors(newErrors);
        try {
            setLoading(true);
            
            if (isEmailVerification) {
                // Handle email verification
                await onVerifyEmail!(email, verifyCode);
                Alert.alert('Success', 'Email verified successfully!');
                router.navigate('/(auth)/login');
            } else {
                // Handle forgot password verification
                const response = await onVerifyForgotPassword!(email, verifyCode);
                
                // Store reset_token in AsyncStorage
                if (response?.reset_token) {
                    await AsyncStorage.setItem('reset_token', response.reset_token);
                    console.log("Reset token stored successfully");
                }
                
                router.navigate({
                    pathname: '/(auth)/changePassword',
                    // params: { email: email },
                });
            }
        } catch (error: any) {
            console.log("Verification error:", error);
            const errorData = error.response?.data;
            if (errorData?.detail) {
                Alert.alert('Verification Failed', errorData.detail);
            }
            else if (error.message) {
                Alert.alert('Verification Failed', error.message);
            }
            else {
                Alert.alert('Verification Failed', 'An error occurred during verification');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            Alert.alert('Error', 'Email is required');
            return;
        }

        try {
            setLoading(true);
            await onResendOTP!(email);
            Alert.alert('Success', 'OTP has been resent!');
        } catch (error: any) {
            Alert.alert(
                'Error', 
                error.response?.data?.detail || error.message || 'Failed to resend code'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        if (isEmailVerification) {
            router.back();
        } else {
            router.navigate('/(auth)/forgetPassword');
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
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
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
                                    {getTitle()}
                                </Text>
                                <Text 
                                    className="text-center text-sm mb-1 text-gray-650"
                                >
                                    {getDescription()}
                                </Text>
                                <Text 
                                    className="text-center text-sm font-semibold"
                                    style={{ textDecorationLine: 'underline'}}
                                >
                                    {email}
                                </Text>
                            </View>

                            {/* Reusable OTP Input Component */}
                            <OTPInput
                                verifyCode={verifyCode}
                                setVerifyCode={setVerifyCode}
                                loading={loading}
                                isOtpFocused={isOtpFocused}
                                setIsOtpFocused={setIsOtpFocused}
                                errors={errors}
                                type={isEmailVerification ? 'email-verification' : 'password-reset'}
                            />

                            {/* Verify Button */}
                            <TouchableOpacity
                                className={`h-14 rounded-lg justify-center items-center mb-4 bg-blue-dark ${
                                    loading ? 'opacity-70' : ''
                                }`}
                                onPress={handleVerify}
                                disabled={loading}
                            >
                                <Text className="text-white text-lg font-semibold">
                                    {getButtonText()}
                                </Text>
                            </TouchableOpacity>

                            {/* Resend Code - ONLY show for email verification, HIDE for forgot password */}
                            {isEmailVerification && !isForgotPassword && (
                                <View className="items-center mb-4">
                                    <Text 
                                        className="text-sm mb-2 text-gray-650" 
                                    >
                                        Didn&apos;t receive the code?
                                    </Text>
                                    <TouchableOpacity
                                        onPress={handleResendCode}
                                        disabled={loading}
                                    >
                                        <Text 
                                            className="text-sm font-semibold text-blue-dark"
                                        >
                                            Resend Code
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Back Link */}
                            <View className="items-center">
                                <Text 
                                    className="text-sm text-gray-650"
                                >
                                    Wrong email?{' '}
                                    <Text 
                                        className="font-semibold underline text-blue-dark"
                                        onPress={handleGoBack}
                                    >
                                        Go back
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
                                By verifying, you agree to our{' '}
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

export default VerifyEmail;