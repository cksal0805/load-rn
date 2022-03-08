import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import DismissKeyBoardView from '../components/DismissKeyBoardView';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const onSubmit = useCallback(() => {
    if (!email.trim()) {
      setIsInvalidEmail(true);
    }
    if (!password.trim()) {
      setIsInvalidPassword(true);
    }
    if (!name.trim()) {
      setIsInvalidName(true);
    }
    if (email.trim() && password.trim() && name.trim()) {
      Alert.alert('알림', '회원 가입');
    }
  }, [email, password, name]);

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

  const onChangeName = useCallback(text => {
    if (text.trim()) {
      setIsInvalidName(false);
    }
    setName(text);
  }, []);
  return (
    <DismissKeyBoardView style={style.container}>
      <View>
        <View style={style.inputZone}>
          <View style={style.signUpInputWrapper}>
            <TextInput
              style={style.signUpInput}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="이메일을 입력하세요"
              importantForAutofill="yes"
              autoComplete="email"
              blurOnSubmit={false}
              textContentType="emailAddress"
              ref={emailRef}
              onSubmitEditing={() => {
                nameRef.current?.focus();
              }}
            />
            {isInvalidEmail && (
              <Text style={style.errorMessageText}>
                이메일을 입력하지 않으셨거나 올바른 이메일 형식이 아닙니다.
              </Text>
            )}
          </View>
          <View style={style.signUpInputWrapper}>
            <TextInput
              style={style.signUpInput}
              onChangeText={onChangeName}
              value={name}
              placeholder="이름을 입력하세요"
              importantForAutofill="yes"
              autoComplete="name"
              blurOnSubmit={false}
              textContentType="name"
              ref={nameRef}
              onSubmitEditing={() => {
                passwordRef.current?.focus();
              }}
            />
            {isInvalidName && (
              <Text style={style.errorMessageText}>
                닉네임을 입력하지 않으셨어요.
              </Text>
            )}
          </View>
          <View style={style.signUpInputWrapper}>
            <TextInput
              onChangeText={onChangePassword}
              value={password}
              style={style.signUpInput}
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
          <Pressable style={style.signUpButton} onPress={onSubmit}>
            <Text style={style.signUpButtonText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </DismissKeyBoardView>
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
  signUpInputWrapper: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  signUpInput: {
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
  signUpButton: {
    width: '80%',
    backgroundColor: '#5cbebb',
    borderWidth: 1,
    borderColor: '#c0e4e3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessageText: {
    color: 'red',
  },
});

export default SignUp;
