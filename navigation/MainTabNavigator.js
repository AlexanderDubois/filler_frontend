import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import CreateReviewScreen from '../screens/CreateReviewScreen'
import PractitionerProfileScreen from '../screens/PractitionerProfileScreen'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'

const HomeStack = createStackNavigator({
  Home: {screen: HomeScreen},
  PractitionerProfile: {screen: PractitionerProfileScreen},
  CreateReview: {screen: CreateReviewScreen},
  Login: {screen: LoginScreen},
  SignUp: {screen: SignUpScreen},
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-home'
          : 'md-home'
      }
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
});
