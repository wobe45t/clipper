import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  useToast,
  Spinner,
} from 'native-base';
import {View} from 'react-native';
import {checkTokenValid} from '../core/auth';
import {useNavigation} from '@react-navigation/core';
import {useLogin} from '../actions';
import {useRecoilValue} from 'recoil';
import {userAtom} from '../state';
import {useGetUserSession, useDestroyPlayer, useSetupPlayer} from '../core';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const login = useLogin();
  const user = useRecoilValue(userAtom);
  const getUserSession = useGetUserSession();
  const setupPlayer = useSetupPlayer();
  const destroyPlayer = useDestroyPlayer();

  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('michu@michu.com');
  const [password, setPassword] = useState('michu');

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result) {
      navigation.navigate('App', {screen: 'Home'});
      setLoading(false);
    } else {
      if (!toast.isActive(1)) {
        toast.show({
          id: 1,
          title: 'error',
          duration: 3000,
        });
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await setupPlayer();
      } catch (err) {
        console.error('setup player failed');
      }
      try {
        const session = await getUserSession();
        if (session && session.access_token) {
          if (checkTokenValid(session.access_token)) {
            navigation.navigate('App', {screen: 'Home'});
            setLoading(false);
            return true;
          } else {
            setLoading(false);
            console.log('token invalid');
          }
        } else {
          console.log('no access token ');
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
    return () => {
      destroyPlayer();
    };
  }, []);

  return (
    <>
      {loading ? (
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
      ) : (
        <NativeBaseProvider>
          <Box safeArea flex={1} p="2" py="8" w="90%" mx="auto">
            <Heading size="lg" fontWeight="600" color="coolGray.800">
              Welcome
            </Heading>
            <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
              Sign in to continue!
            </Heading>
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'coolGray.800',
                    fontSize: 'xs',
                    fontWeight: 500,
                  }}>
                  Email ID
                </FormControl.Label>
                <Input onChangeText={value => setEmail(value)} value={email} />
              </FormControl>
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'coolGray.800',
                    fontSize: 'xs',
                    fontWeight: 500,
                  }}>
                  Password
                </FormControl.Label>
                <Input
                  type="password"
                  onChangeText={value => setPassword(value)}
                  value={password}
                />
                <Link
                  _text={{
                    fontSize: 'xs',
                    fontWeight: '500',
                    color: 'indigo.500',
                  }}
                  alignSelf="flex-end"
                  mt="1">
                  Forget Password?
                </Link>
              </FormControl>
              <Button
                mt="2"
                colorScheme="indigo"
                _text={{color: 'white'}}
                onPress={() => handleLogin(email, password)}>
                Sign in
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text fontSize="sm" color="muted.700" fontWeight={400}>
                  I'm a new user.{' '}
                </Text>
                <Text onPress={() => navigation.navigate('Signup')}>
                  Sign Up
                </Text>
              </HStack>
            </VStack>
          </Box>
        </NativeBaseProvider>
      )}
    </>
  );
};
