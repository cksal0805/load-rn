import React, {useCallback, useEffect} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';

function Settings() {
  const name = useSelector((state: RootState) => state.user.name);
  const money = useSelector((state: RootState) => state.user.money);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();
  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/logout`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    async function getMoney() {
      const response = await axios.get<{data: {data: number}}>(
        `${Config.API_URL}/showmethemoney`,
        {
          headers: {authorization: `Bearer ${accessToken}`},
        },
      );
      dispatch(userSlice.actions.setMoney(response.data.data));
    }
    getMoney();
  }, [accessToken, dispatch]);
  return (
    <View style={styles.wrapper}>
      <View style={styles.infoZone}>
        <View style={styles.infoInnerZone}>
          <Text style={styles.infoText}>👸🏻 {name} 님</Text>
        </View>
        <View style={styles.infoInnerZone}>
          <Text style={styles.infoText}>💸 현재 수익금: {money}원</Text>
        </View>
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={StyleSheet.compose(
            styles.loginOutButton,
            styles.loginOutButtonActive,
          )}
          onPress={onLogout}>
          <Text style={styles.loginOutButtonText}>로그아웃</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    backgroundColor: '#fff',
    height: '100%',
    marginTop: 10,
  },
  infoText: {
    fontSize: 20,
    fontWeight: '600',
  },
  infoInnerZone: {
    marginBottom: 20,
    padding: 10,
    paddingBottom: 20,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: '#d8d6d6',
    borderRadius: 10,
  },
  infoZone: {},
  buttonZone: {
    alignItems: 'center',
    paddingTop: 20,
  },
  loginOutButton: {
    width: '90%',
    backgroundColor: '#5cbebb',
    borderWidth: 1,
    borderColor: '#c0e4e3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  loginOutButtonActive: {
    backgroundColor: '#5cbebb',
  },
  loginOutButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Settings;
