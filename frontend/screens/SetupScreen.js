import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {Spinner} from 'native-base';
import {
  checkTokenValid,
  useDestroyPlayer,
  useSetupPlayer,
  useGetUserSession,
} from '../core';
import {useNavigation} from '@react-navigation/native';

export const SetupScreen = () => {
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const destroyPlayer = useDestroyPlayer()
  const setupPlayer = useSetupPlayer()
  const getUserSession = useGetUserSession()

  const initSession = async () => {
    try {
      const session = await getUserSession();
      if (session && session.access_token) {
        if (checkTokenValid(session.access_token)) {
          navigation.navigate('App', {screen: 'Home'});
          return true;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const initPlayer = async () => {
    const result = await initSession();
    if(!result) {
      navigation.navigate('Login');
    }
    await setupPlayer();
    //TODO critical problem - close app if player setup fails
  };

  useEffect(() => {
    initPlayer();
    return () => {
      destroyPlayer();
    };
  }, []);

  return (
    <View>
      {loading && (
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Spinner size="lg" />
          <Text
            style={{
              fontSize: 18,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
           Loading 
          </Text>
        </View>
      )}
    </View>
  );
};
