import axios from 'axios';
import authHeader from './auth-header';
import logout from '../components/Navbar/index'

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': authHeader()
  },
});

const token = localStorage.getItem('accessToken');

axiosInstance.interceptors.response.use(
  (response: any) => {
    console.log("$$$ intercptor");
    return response;
  },
  async (error: any) => {
    console.log("$$$ intercptor eerrer");
    const {
      config,
      response: { status },
    } = error;
    
    const originalRequest = config;
    
    if (status === 403) {
      // const accessToken = localStorage.getItem('accessToken');
      // const refreshToken = localStorage.getItem('refreshToken');

      try {

        console.log("$$$ logout !!");
        logout;
        // const { data } = await axios({
        //   method: 'post',
        //   url: `/members/reissue`,
        //   data: { accessToken, refreshToken },
        // });
        // const newAccessToken = data.data.accessToken;
        // const newRefreshToken = data.data.refreshToken;
        // originalRequest.headers = {
          // 'Content-Type': 'application/json',
          // 'Authorization': authHeader()
        // };
        // localStorage.setItem('ACCESS_TOKEN', newAccessToken);
        // localStorage.setItem('REFRESH_TOKEN', newRefreshToken);
        // return await axios(originalRequest);
      } catch (err: any) {
        new Error(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;