import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// Use a loose any type for the global router to avoid type mismatches
// when referencing navigation from non-component modules.
let globalRouter: any = null;

export const setGlobalRouter = (router: any) => {
  globalRouter = router;
};


const BASE_URL = 'https://cafe.lolskins.gg';


export const axiosInstance = axios.create({
  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },
}); 


// interceptors
//request interceptors
axiosInstance.interceptors.request.use(async (config)=>{
  const accessToken = await AsyncStorage.getItem('access_token');
  if(accessToken){
    config.headers.Authorization= `Bearer ${accessToken}`;
  }

  return config;
}, (error) =>{
  return Promise.reject(error);
});



// response interceptors
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
        if (!storedRefreshToken) throw new Error('No refresh token available');

        const refreshResponse = await axios.post(`${BASE_URL}api/token/refresh/`, {
          refresh: storedRefreshToken,
        } );

        const newAccessToken = refreshResponse.data?.access;

        if (!newAccessToken) throw new Error('No access token in refresh response');

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        await AsyncStorage.removeItem('user');
        try { 
          globalRouter && globalRouter.replace('/(auth)/login'); 
        } catch {}
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
)