import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeScreen,
  PlaylistTagEditScreen,
  CreateTagScreen,
  SetupScreen,
  ClipDetailsScreen,
  LoginScreen,
  SignupScreen,
  TrackScreen,
  ClipScreen,
  TagScreen,
  UpdateEmailScreen,
  UpdatePasswordScreen,
  TestScreen,
  ProfileScreen,
  PlaylistClips,
  ServerAddressScreen
} from './screens';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeBaseProvider, Stack as BStack} from 'native-base';
import {CustomTabBar, PlayerModal} from './components';
import {colors} from './constants/theme';
import {RecoilRoot} from 'recoil';

const Stack = createBottomTabNavigator();

const AppStack = createNativeStackNavigator();

const AppStackNavigation = () => {
  return (
    <Stack.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Main') {
            return (
              <MIcon name="playlist-music-outline" size={40} color={color} />
            );
          } else if (route.name === 'Profile') {
            return <MIcon name="account-cog" size={35} color={color} />;
          } else if (route.name === 'Bookmarks') {
            return (
              <MIcon name="bookmark-multiple-outline" size={30} color={color} />
            );
          }
        },
        tabBarHideOnKeyboard: true,
      })}>
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen name="Bookmarks" component={PlaylistClips} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <NativeBaseProvider>
        <NavigationContainer>
          <AppStack.Navigator
            screenOptions={{headerShown: false, initialRouteName: 'Login'}}>
            <AppStack.Screen name="Login" component={LoginScreen} />
            <AppStack.Screen name="App" component={AppStackNavigation} />
            <AppStack.Screen name="Signup" component={SignupScreen} />
            <AppStack.Screen name="Track" component={TrackScreen} />
            <AppStack.Screen name="Clip" component={ClipScreen} />
            <AppStack.Screen name="Test" component={TestScreen} />
            <AppStack.Screen name="ServerAddress" component={ServerAddressScreen} />
            <AppStack.Screen
              name="PlaylistTagEdit"
              component={PlaylistTagEditScreen}
            />
            <AppStack.Screen name="CreateTag" component={CreateTagScreen} />
            <AppStack.Screen name="ClipDetails" component={ClipDetailsScreen} />
            <AppStack.Screen name="UpdateEmail" component={UpdateEmailScreen} />
            <AppStack.Screen
              name="UpdatePassword"
              component={UpdatePasswordScreen}
            />
          </AppStack.Navigator>
          <PlayerModal />
        </NavigationContainer>
      </NativeBaseProvider>
    </RecoilRoot>
  );
};

export default App;
