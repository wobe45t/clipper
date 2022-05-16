import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
} from 'native-base';
import {useSignup} from '../actions'
import {useNavigation} from '@react-navigation/native'

export const SignupScreen = () => {

  const [email, setEmail] = useState('michu@michu.com')
  const [password, setPassword] = useState('michu')
  const [confirmPassword, setConfirmPassword] = useState('michu')
  const signup = useSignup()
  const navigation = useNavigation();

  const handleSignup = () => {
    const result = signup(email, password)
    if(result) {
      navigation.navigate('Login')
    }
  }

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} p="2" w="90%" mx="auto" py="8">
        <Heading size="lg" color="coolGray.800" fontWeight="600">
          Welcome
        </Heading>
        <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
          Sign up to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label
              _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
              Email
            </FormControl.Label>
            <Input value={email} onChangeText={(value) => setEmail(value)} />
          </FormControl>
          <FormControl>
            <FormControl.Label
              _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
              Password
            </FormControl.Label>
            <Input type="password" value={password} onChangeText={(value) => setPassword(value)} />
          </FormControl>
          <FormControl>
            <FormControl.Label
              _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
              Confirm Password
            </FormControl.Label>
            <Input type="password" value={confirmPassword} onChangeText={(value) => setConfirmPassword(value)} />
          </FormControl>
          <Button mt="2" colorScheme="indigo" _text={{ color: 'white' }} onPress={handleSignup}>
            Sign up
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}