import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch} from 'react-redux';
import userSlice from '../slices/user';

const customAxios = axios.create({
  baseURL: `${Config.API_URL}`,
});

const errorHandler = async (
  error: any,
  callback?: (accessToken: string) => void,
) => {
  const {config, response} = error;
  if (response?.status === 419) {
    if (error.response?.data.code === 'expired') {
      const originalRequest = config;
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      const {data} = await axios.post(
        `${Config.API_URL}/refreshToken`,
        {},
        {headers: {authorization: `Bearer ${refreshToken}`}},
      );
      originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
      callback && callback(data.data.accessToken);
      return axios(originalRequest);
    }
  }
  return Promise.reject(error);
};

export {customAxios, errorHandler};
