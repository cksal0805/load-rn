import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!email.trim()) {
      setIsInvalidEmail(true);
    }
    if (!password.trim()) {
      setIsInvalidPassword(true);
    }
    if (email.trim() && password.trim()) {
      setLoading(true);
      try {
        const response = await axios.post(`${Config.API_URL}/login`, {
          email,
          password,
        });
        console.log(response.data);
        Alert.alert('알림', '로그인 되었습니다.');
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          response.data.data.refreshToken,
        );
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
        return;
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch, email, password]);

  const onChangeEmail = useCallback(text => {
    if (text.trim()) {
      setIsInvalidEmail(false);
    }
    setEmail(text);
  }, []);

  const onChangePassword = useCallback(text => {
    if (text.trim()) {
      setIsInvalidPassword(false);
    }
    setPassword(text);
  }, []);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <View style={style.container}>
      <View style={style.inputZone}>
        <View style={style.loginInputWrapper}>
          <TextInput
            style={style.loginInput}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="이메일을 입력하세요"
            importantForAutofill="yes"
            autoComplete="email"
            blurOnSubmit={false}
            textContentType="emailAddress"
            ref={emailRef}
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
          />
          {isInvalidEmail && (
            <Text style={style.errorMessageText}>
              이메일을 입력하지 않으셨어요.
            </Text>
          )}
        </View>
        <View style={style.loginInputWrapper}>
          <TextInput
            onChangeText={onChangePassword}
            value={password}
            style={style.loginInput}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry
            importantForAutofill="yes"
            autoComplete="password"
            textContentType="password"
            ref={passwordRef}
          />
          {isInvalidPassword && (
            <Text style={style.errorMessageText}>
              비밀번호를 입력하지 않으셨어요.
            </Text>
          )}
        </View>
      </View>
      <View style={style.buttonZone}>
        <Pressable
          style={style.loginButton}
          onPress={onSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={style.loginButtonText}>로그인</Text>
          )}
        </Pressable>
        <Pressable style={style.signUpButton} onPress={toSignUp}>
          <Text style={style.signUpButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoImage: {
    width: 50,
    height: 20,
  },
  inputZone: {
    alignItems: 'center',
  },
  loginInputWrapper: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  loginInput: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    fontSize: 20,
    padding: 15,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#5cbebb',
    borderWidth: 1,
    borderColor: '#c0e4e3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signUpButton: {},
  signUpButtonText: {
    color: '#414141',
    fontWeight: '600',
    fontSize: 16,
  },
  errorMessageText: {
    color: 'red',
  },
});

export default SignIn;
