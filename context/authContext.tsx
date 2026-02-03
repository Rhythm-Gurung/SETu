import { axiosInstance } from '@/api/api';
// import { UserData } from '@/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';


interface AuthProps {
    authState?: { token: string | null, authenticated: boolean | null };
    onLogin?: (email: string, password: string) => Promise<any>
    onLogout?: () => Promise<any>
    onRegister?: (email: string, username: string, password: string, confirm_password: string) => Promise<any>
    onForgetPassword?: (email:string) => Promise<any>
    onVerifyOtp?: (email:string, code:string) => Promise<any>
    onResendOTP?: (email:string) => Promise<any>
    onVerifyEmail?: (email:string, verification_code:string) => Promise<any>
    onVerifyForgotPassword?: (email:string, verification_code:string) => Promise<any>
    onChangePassword?: (new_password:string, confirm_new_password:string, reset_token:string) => Promise<any>
    getProfile?: () => Promise<any>
    loading?: boolean
}


const AuthContext = createContext<AuthProps>({})


export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null,
        authenticated: boolean | null
    }>({
        token: null,
        authenticated: null
    })
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('access_token')
                if (token) {
                    setAuthState({
                        token: token,
                        authenticated: true
                    }
                    )
                }
            } catch (error) {
                // console.error('Failed to Load Tokens:', error)
                throw error;
            }
            finally {
                setLoading(false)
            }
        }
        loadToken();
    }, [])

    const onRegister = async (email: string, username: string, password: string, confirm_password: string) => {
        try {
            const Response = await axiosInstance.post('/api/system/auth/register/', {
                email: email.trim().toLocaleLowerCase(),
                username: username.trim(), 
                password: password.trim(), 
                confirm_password: confirm_password.trim(),
            });
            return Response.data
        } catch (error) {
            console.error("Register Fail:", error)
            throw error;
        }
    }

    const onForgetPassword = async (email: string) => {
        try {
            const Response = await axiosInstance.post('/api/system/auth/forgot-password/', {
                email: email.trim().toLocaleLowerCase(),
            });
            return Response.data
        } catch (error) {
            console.error("Forget Password Fail:", error)
            throw error;
        }
    }

    const onVerifyEmail = async (email: string, verification_code: string) => {
        try{
            const Response = await axiosInstance.post('/api/system/auth/verify-email/', {
                email: email.trim().toLocaleLowerCase(),
                verification_code: verification_code.trim(),
            });
            return Response.data

        }catch(error){
            console.error("Email Verification Fail:", error)
            throw error;
        }
    }

    const onResendOTP = async (email: string) => {
        try {
            const Response = await axiosInstance.post('/api/system/auth/resend-verification-code/', { 
                email: email.trim().toLocaleLowerCase(),
            });
            return Response.data
        } catch (error) {            
            console.error("Resend OTP Fail:", error)    
            throw error;
        }
    }   

    // for login
    const onLogin = async (email: string, password: string) => {
        try {
            console.log('Attempting login with:', { email, password });

            const Response = await axiosInstance.post('api/system/auth/login/', {
                email,
                password
            });
                const { tokens, user } = Response.data;
                const { access, refresh } = tokens;

            // storing tokens in async storage
            await AsyncStorage.setItem('access_token', access)
            await AsyncStorage.setItem('refresh_token', refresh)
            await AsyncStorage.setItem('user', JSON.stringify(user)) 


            // updating authstate
            setAuthState({
                token: access,
                authenticated: true,
            })  


            return Response.data
        } catch (error) {
            // console.error('Login Failed:', error);
            throw error;
        }
    }

    const onVerifyForgotPassword = async (email: string, verification_code: string) => {
        try{
            const Response = await axiosInstance.post('/api/system/auth/verify-forgot-password/', { 
                email: email.trim().toLocaleLowerCase(),
                verification_code: verification_code.trim(),
            });
            return Response.data         
        } catch(error){
            console.error("Verify Forgot Password Fail:", error)
            throw error;
        }
    }

    // logout
    const onLogout = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            
            if (!accessToken) {
                console.warn('No access token found during logout');
                // Still proceed with local cleanup
                await clearAuthData();
                setAuthState({
                    token: null,
                    authenticated: false
                });
                return { success: true, message: 'Logged out locally' };
            }

            console.log('Logging out with token');
            
            // Call logout endpoint with token in header
            const response = await axiosInstance.get('/api/system/auth/logout/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Clear all auth data after successful API call
            await clearAuthData();
            
            // Update auth state
            setAuthState({
                token: null,
                authenticated: false
            });

            console.log('Logout successful');
            return response.data || { success: true, message: 'Logged out successfully' };

        } catch (error: any) {
            console.error('Logout API error:', error?.response?.data || error?.message || error);
            
            // Even if API fails, clear local data
            await clearAuthData();
            setAuthState({
                token: null,
                authenticated: false
            });
            
            // Return success for local cleanup even if API failed
            return { success: true, message: 'Logged out locally (API error)' };
        }
    };

    // Helper function to clear all auth data
    const clearAuthData = async () => {
        try {
            await AsyncStorage.multiRemove([
                "access_token",
                "refresh_token",
                "user"
            ]);
            console.log('Auth data cleared from storage');
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    };

    const onChangePassword = async (new_password: string, confirm_new_password: string, reset_token: string) => {
        try {
            const Response = await axiosInstance.post('/api/system/auth/change-password/', {
                new_password: new_password.trim(),  
                confirm_new_password: confirm_new_password.trim(),
                reset_token: reset_token.trim(),
            });
            return Response.data
        }                       
        catch (error) {
            console.error("Change Password Fail:", error)
            throw error;
        }                   
    }


    // get profile
    const getProfile = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("access_token");
            
            if (!accessToken) {
                console.warn('No access token found, returning cached user or null');
                // Try to return cached user data
                const cachedUser = await AsyncStorage.getItem('user');
                if (cachedUser) {
                    return JSON.parse(cachedUser);
                }
                throw new Error('No access token found and no cached user data');
            }

            console.log('Fetching user profile from API');
            
            const response = await axiosInstance.get('/api/system/auth/whoami/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Handle token refresh if provided in response
            if (response.data.token || response.data.tokens) {
                const tokenData = response.data.token || response.data.tokens;
                const { access, refresh, access_new } = tokenData;
                
                // Store updated tokens
                const newAccessToken = access_new || access;
                if (newAccessToken) {
                    await AsyncStorage.setItem("access_token", newAccessToken);
                    console.log('Access token updated from profile response');
                }
                if (refresh) {
                    await AsyncStorage.setItem("refresh_token", refresh);
                    console.log('Refresh token updated from profile response');
                }
                
                // Update auth state with new token
                if (newAccessToken) {
                    setAuthState({
                        token: newAccessToken,
                        authenticated: true
                    });
                }
            }

            // Extract user data from response
            let userData = null;
            if (response.data.user) {
                userData = response.data.user;
            } else if (response.data.data) {
                userData = response.data.data;
            } else {
                // Assume response.data itself contains user info
                userData = response.data;
            }

            // Store user data in AsyncStorage for offline access
            if (userData) {
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                console.log('User profile fetched and stored successfully');
            }

            return userData;

        } catch (error: any) {
            console.error('GetProfile API error:', error?.response?.data || error?.message || error);
            
            // Try to return cached user as fallback
            const cachedUser = await AsyncStorage.getItem('user');
            if (cachedUser) {
                console.log('Returning cached user data due to API error');
                return JSON.parse(cachedUser);
            }
            
            throw error;
        }
    }

    const value = {
        onLogin: onLogin,
        onLogout: onLogout,
        getProfile: getProfile,
        onRegister: onRegister,
        onForgetPassword: onForgetPassword,
        onResendOTP: onResendOTP,
        onVerifyEmail: onVerifyEmail,
        onVerifyForgotPassword: onVerifyForgotPassword, 
        onChangePassword: onChangePassword,
        authState,
        loading,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


// export { UserData };