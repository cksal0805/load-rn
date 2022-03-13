import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

const customAxios = axios.create({
  baseURL: `${Config.API_URL}`,
});

const requestHandler = async (config: any) => {
  const token = await EncryptedStorage.getItem('refreshToken');
  if (!token) {
    return;
  }
  const response = await customAxios.post(
    '/refreshToken',
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  config.headers.authorization = `Bearer ${response.data.data.accessToken}`;
  return config;
};

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

export {customAxios, errorHandler, requestHandler};
