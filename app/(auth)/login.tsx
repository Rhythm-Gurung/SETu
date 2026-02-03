import { useAuth } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useRef, useState } from "react";
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
import Animated, {
  SlideInDown
} from "react-native-reanimated";

interface LoginErrors {
  email: string;
  password: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({
    email: "",
    password: "",
  });
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);

  const { onLogin } = useAuth();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const currentScrollY = useRef(0);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    const newErrors: LoginErrors = { email: "", password: "" };

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      try {
        //Csole.log('Attempting login with1:', { email, password });

        setIsLoading(true);
        // removing old tokens
        await AsyncStorage?.multiRemove?.(["access_token", "refresh_token"]);
        const emailClean = email.trim().toLowerCase();
        const result = await onLogin!(emailClean, password);

        if (result) {
          Alert.alert("Success", "Login successful!");
          router.replace("/(tabs)/home");
        }
      } catch (error: any) {
        Alert.alert(
          "Login Failed",
          error.response?.data?.detail || "Invalid email or password",
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Error", "Please fill the requirements before submitting.");
    }
  };

  const registerRedirect = () => {
    router.navigate("/(auth)/register");
  };

  const ForgotPasswordRedirect = () => {
    router.navigate("/(auth)/forgetPassword");
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
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          onScroll={(e) => {
            currentScrollY.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
                entering={SlideInDown.springify()
                  .damping(12)
                  .duration(600)
                  .delay(100)}
                 className="flex-1 justify-center items-center px-6 py-12">
            <View className="w-full max-w-sm">
              <View
                className="rounded-2xl bg-blue-lighter border border-blue-light/60 shadow-lg p-6 mb-6"
              >
                <View className="items-center mb-6">
                  <Text className="text-center text-3xl font-extrabold mb-2 text-white">
                    Welcome back
                  </Text>
                  <Text className="text-center text-sm text-gray-550">
                    Login with your Google account
                  </Text>
                </View>

                {/* Form */}
                <View className="space-y-8">
                  {/* Divider with "Or continue with" */}
                  <View className="relative items-center">
                    <View className="absolute inset-0 flex items-center">
                      <View />
                    </View>
                    <View className="bg-blue-lighter px-3">
                      <Text className="text-xs uppercase tracking-wide text-gray-650">
                        Or continue with
                      </Text>
                    </View>
                  </View>

                  <View className="space-y-8">
                    <View>
                      <Text className="text-sm font-semibold uppercase text-gray-550 mb-2">
                        Email
                      </Text>
                      <TextInput
                        className={`border rounded-xl px-4 py-3 text-base bg-blue-lighter text-white mb-2 ${
                          errors.email
                            ? "border-[#EF4444]"
                            : isEmailFocused
                              ? "border-blue-dark"
                              : "border-blue-light"
                        }`}
                        placeholder="example@example.com"
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
                        <Text className="text-sm text-red-500 py-1">
                          {errors.email}
                        </Text>
                      )}
                    </View>

                    <View>
                      <View className="flex-row items-center justify-between mb-2 mt-2">
                        <Text className="text-sm font-semibold uppercase text-gray-550">
                          Password
                        </Text>
                        <TouchableOpacity onPress={ForgotPasswordRedirect}>
                          <Text className="text-xs font-semibold text-blue-dark">
                            Forgot your password?
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View className="relative">
                        <TextInput
                          className={`border rounded-xl px-4 py-3 text-base bg-blue-lighter text-white pr-12 mb-2 ${
                            errors.password
                              ? "border-[#EF4444]"
                              : isPasswordFocused
                                ? "border-blue-dark"
                                : "border-blue-light"
                          }`}
                          placeholder="Enter your password"
                          placeholderTextColor="#6B7280"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!isPasswordVisible}
                          onFocus={() => {
                            setIsPasswordFocused(true);
                            setTimeout(() => {
                              scrollViewRef.current?.scrollTo({
                                y: currentScrollY.current + 100,
                                animated: true,
                              });
                            }, Platform.OS === "ios" ? 50 : 100);
                          }}
                          onBlur={() => setIsPasswordFocused(false)}
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
                      {errors.password && (
                        <Text className="text-sm text-red-500 py-1">
                          {errors.password}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      className={`rounded-xl py-3 bg-blue-dark items-center mb-2 mt-2 ${
                        isLoading ? "opacity-70" : ""
                      }`}
                      onPress={handleLogin}
                      disabled={isLoading}
                    >
                      <Text className="font-semibold text-sm text-white">
                        {isLoading ? "Logging in..." : "Login"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="items-center">
                    <Text className="text-sm text-gray-550">
                      Don&apos;t have an account?{" "}
                      <Text
                        className="font-semibold text-blue-dark"
                        onPress={registerRedirect}
                      >
                        Sign up
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
                    onPress={() => router.replace("/(auth)/login")} //TermsOfService'
                  >
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text
                    className="font-semibold text-blue-dark"
                    onPress={() => router.replace("/(auth)/login")} //PrivacyPolicy
                  >
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
