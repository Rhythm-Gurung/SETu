import { Stack } from "expo-router";


export default function AuthLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="register"
                    options={{
                        title: 'Create Account',
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="login"
                    options={{
                        title: 'Login',
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="forgetPassword"
                    options={{
                        title: 'Reset Password',
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="verifyEmail"
                    options={{
                        title: 'Verify Email',
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="changePassword"
                    options={{
                        title: 'Change Password',
                        headerShown: false
                    }}
                />
            </Stack>

        </>
    );
}