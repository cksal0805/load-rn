import {NavigationProp, useNavigation} from '@react-navigation/native';
import axios, {AxiosError} from 'axios';
import React, {useCallback, useState} from 'react';
import {View, Text, Pressable, StyleSheet, Alert} from 'react-native';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {LoggedInParamList} from '../../AppInner';
import orderSlice, {IOrder} from '../slices/order';
import {RootState} from '../store/reducer';

function EachOrder({item}: {item: IOrder}) {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [detail, setDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const toggleDetail = useCallback(() => {
    setDetail(prev => !prev);
  }, []);

  const onAccept = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post(
        `${Config.API_URL}/accept`,
        {orderId: item.orderId},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      navigation.navigate('Delivery');
    } catch (error) {
      let errorResponse = (error as AxiosError).response;
      if (errorResponse?.status === 400) {
        Alert.alert('알림', errorResponse.data.message);
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, accessToken, navigation, item.orderId]);

  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item.orderId]);

  return (
    <View key={item.orderId} style={styles.wrapper}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={[styles.price, styles.text]}>🍜 {item.price} 원</Text>
        <Text style={[styles.text]}>안양시 동안구</Text>
      </Pressable>
      {detail && (
        <View style={styles.detail}>
          <View style={styles.buttonZone}>
            <Pressable
              style={[styles.button, styles.okButton]}
              onPress={onAccept}
              disabled={loading}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={onReject}
              disabled={loading}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    paddingBottom: 25,
    paddingTop: 25,
    borderWidth: 0.5,
    borderColor: '#717075',
    marginBottom: 10,
    borderRadius: 10,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    color: '#717075',
  },
  price: {
    fontWeight: '700',
  },
  detail: {},
  buttonZone: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#717075',
    width: '45%',
  },
  okButton: {
    backgroundColor: '#29b6b3',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EachOrder;
