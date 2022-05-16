import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, SafeAreaView, Pressable, Text} from 'react-native';
import {Input} from 'native-base';
import {default as MIcon} from 'react-native-vector-icons/MaterialCommunityIcons';
import {default as Icon} from 'react-native-vector-icons/MaterialIcons';
import {colors, sizes} from '../constants/theme';
import {useToast} from 'native-base';
import {styles as androidStyles} from '../constants/safeArea';
import {CustomSafeAreaView} from '../components'
import { userAtom } from '../state';
import {useRecoilState} from 'recoil'

export const UpdatePasswordScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const user = useRecoilState(userAtom)
  const toast = useToast();
  const [password, setPassword] = useState('test');
  const [confirmPassword, setConfirmPassword] = useState('test');

  const handleSubmit = () => {
    if (password != confirmPassword) {
      if (!toast.isActive(1)) {
        toast.show({
          id: 1,
          title: 'Passwords do not match',
          duration: 3000,
        });
      }
    }
  };

  return (
    <CustomSafeAreaView>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}>
        {/* ===HEADER=== */}
        <View
          style={{
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{flexGrow: 1}} />
          <View
            style={{
              flexGrow: 4,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontSize: 24,
                textAlign: 'center',
              }}>
              Update password
            </Text>
          </View>
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
            }}
          />
        </View>
        {/* ===BODY=== */}
        <View
          style={{
            flexGrow: 9,
            width: '90%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
          }}>
          <View
            style={{
              borderColor: colors.sea,
              margin: 10,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
            Type in new password
          </Text>
          <View>
            <Input
              size="lg"
              type="password"
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <Input
              size="lg"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
            />
          </View>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};
