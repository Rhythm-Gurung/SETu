import { useAuth } from "@/context/authContext";
import { getPasswordValidationMessage } from "@/utils/passwordValidation";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useRef, useState, useEffect } from "react";
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
  View,
} from "react-native";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { onRegister } = useAuth();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentScrollY = useRef(0);

  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
    if (inputName === "password" || inputName === "confirmPassword") {
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = setTimeout(() => {
        const scrollAmount = inputName === "confirmPassword" ? 140 : 100;
        scrollViewRef.current?.scrollTo({
          y: currentScrollY.current + scrollAmount,
          animated: true,
        });
      }, Platform.OS === "ios" ? 50 : 100);
    }
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const handleRegister = async () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (password) {
      const passwordError = getPasswordValidationMessage(password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");

    if (isValid) {
      try {
        setIsLoading(true);
        const result = await onRegister!(
          email,
          username,
          password,
          confirmPassword,
        );

        if (result) {
          Alert.alert("Success", "Registration successful!");
          router.navigate({
            pathname: "/(auth)/verifyEmail",
            params: { email: email, type: "email-verification" },
          });
        }
      } catch (error: any) {
        const backendErrors = error.response?.data;

        if (backendErrors) {
          // Map backend errors to our error state
          const backendErrorState = {
            username: backendErrors.username || backendErrors.detail || "",
            email: backendErrors.email || backendErrors.detail || "",
            password: backendErrors.password || backendErrors.detail || "",
            confirmPassword:
              backendErrors.confirmPassword || backendErrors.detail || "",
          };

          setErrors(backendErrorState);

          // Show alert for general errors
          if (
            backendErrors.detail &&
            !backendErrors.username &&
            !backendErrors.email &&
            !backendErrors.password
          ) {
            Alert.alert("Registration Failed", backendErrors.detail);
          }
        } else {
          Alert.alert(
            "Registration Failed",
            error.message || "An error occurred during registration",
          );
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        "Invalid Input",
        "Please fix the highlighted errors and try again.",
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-blue-lightest"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 40,
          }}
          onScroll={(e) => {
            currentScrollY.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center items-center px-6 py-12">
            {/* Main Card Container */}
            <View className="w-full max-w-sm">
              {/* Card */}
              <View className="rounded-2xl bg-blue-lighter border border-blue-light/60 shadow-lg p-6 mb-6">
                {/* Card Header */}
                <View className="items-center mb-6">
                  <Text className="text-3xl font-extrabold mb-2 text-white">
                    Create Account
                  </Text>
                  <Text className="text-center text-sm text-gray-550">
                    Sign up with your Google account
                  </Text>
                </View>

                {/* Form */}
                <View className="space-y-8">
                  {/* Divider with "Or continue with" */}
                  <View className="relative items-center">
                    <View className="absolute inset-0 flex items-center">
                      <View className="flex-1 border-t border-blue-light/60" />
                    </View>
                    <View className="bg-blue-lighter px-3">
                      <Text className="text-xs uppercase tracking-wide text-gray-650">
                        Or continue with
                      </Text>
                    </View>
                  </View>

                  {/* Form Fields */}
                  <View className="space-y-6">
                    {/* Username Input */}
                    <View>
                      <Text className="text-sm font-semibold uppercase text-gray-550 mb-2">
                        Username
                      </Text>
                      <TextInput
                        className={`border rounded-xl px-4 py-3 text-base bg-blue-lighter text-white mb-2 ${
                          errors.username
                            ? "border-[#EF4444]"
                            : focusedInput === "username"
                              ? "border-blue-dark"
                              : "border-blue-light"
                        }`}
                        placeholder="Enter your username"
                        placeholderTextColor="#6B7280"
                        value={username}
                        onChangeText={setUsername}
                        onFocus={() => handleInputFocus("username")}
                        onBlur={handleInputBlur}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {errors.username && (
                        <Text className="text-sm text-red-500 py-1">
                          {errors.username}
                        </Text>
                      )}
                    </View>

                    {/* Email Input */}
                    <View>
                      <Text className="text-sm font-semibold uppercase text-gray-550 mb-2 mt-2">
                        Email
                      </Text>
                      <TextInput
                        className={`border rounded-xl px-4 py-3 text-base bg-blue-lighter text-white mb-2 ${
                          errors.email
                            ? "border-[#EF4444]"
                            : focusedInput === "email"
                              ? "border-blue-dark"
                              : "border-blue-light"
                        }`}
                        placeholder="m@example.com"
                        placeholderTextColor="#6B7280"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onFocus={() => handleInputFocus("email")}
                        onBlur={handleInputBlur}
                      />
                      {errors.email && (
                        <Text className="text-sm text-red-500 py-1">
                          {errors.email}
                        </Text>
                      )}
                    </View>

                    {/* Password Input */}
                    <View>
                      <Text className="text-sm font-semibold uppercase text-gray-550 mb-2 mt-2">
                        Password
                      </Text>
                      <View className="relative">
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-base bg-blue-lighter text-white mb-2 pr-10 ${
                            errors.password
                              ? "border-[#EF4444]"
                              : focusedInput === "password"
                                ? "border-blue-dark"
                                : "border-blue-light"
                          }`}
                          placeholder="Enter your password"
                          placeholderTextColor="#6B7280"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!isPasswordVisible}
                          onFocus={() => handleInputFocus("password")}
                          onBlur={handleInputBlur}
                        />
                        <TouchableOpacity
                          className="absolute right-3 top-3"
                          onPress={togglePasswordVisibility}
                          activeOpacity={0.7}
                        >
                          {isPasswordVisible ? (
                            <EyeOff size={20} color="#969799" />
                          ) : (
                            <Eye size={20} color="#969799" />
                          )}
                        </TouchableOpacity>
                      </View>
                      {errors.password && (
                        <Text className="text-sm text-red-500 py-1">
                          {errors.password}
                        </Text>
                      )}
                    </View>

                    {/* Confirm Password Input */}
                    <View>
                      <Text className="text-sm font-semibold uppercase text-gray-550 mb-2 mt-2">
                        Confirm Password
                      </Text>
                      <View className="relative">
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-base bg-blue-lighter text-white mb-2 pr-10 ${
                            errors.confirmPassword
                              ? "border-[#EF4444]"
                              : focusedInput === "confirmPassword"
                                ? "border-blue-dark"
                                : "border-blue-light"
                          }`}
                          placeholder="Confirm your password"
                          placeholderTextColor="#6B7280"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!isConfirmPasswordVisible}
                          onFocus={() => handleInputFocus("confirmPassword")}
                          onBlur={handleInputBlur}
                        />
                        <TouchableOpacity
                          className="absolute right-3 top-3"
                          onPress={toggleConfirmPasswordVisibility}
                          activeOpacity={0.7}
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOff size={20} color="#434343" />
                          ) : (
                            <Eye size={20} color="#969799" />
                          )}
                        </TouchableOpacity>
                      </View>
                      {errors.confirmPassword && (
                        <Text className="text-sm text-red-500 py-1">
                          {errors.confirmPassword}
                        </Text>
                      )}
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                      className={`rounded-xl py-3 items-center bg-blue-dark mb-2 mt-2 ${
                        isLoading ? "opacity-70" : ""
                      }`}
                      onPress={handleRegister}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      <Text className="font-semibold text-base text-white">
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login link */}
                  <View className="items-center">
                    <Text className="text-sm text-gray-550">
                      Already have an account?{" "}
                      <Text
                        className="font-semibold text-blue-dark"
                        onPress={() => router.navigate("/(auth)/login")}
                      >
                        Login
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* Terms and Privacy */}
              <View className="items-center">
                <Text className="text-[11px] text-center text-gray-550">
                  By clicking continue, you agree to our{" "}
                  <Text
                    className="font-semibold text-blue-dark"
                    onPress={() => router.replace("/(auth)/login")}
                  >
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text
                    className="font-semibold text-blue-dark"
                    onPress={() => router.replace("/(auth)/login")}
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

export default Register;
