// navigation/MainStackNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ApiTestPage from '../screens/ApiTestPage';
import CardSwiperScreen from '../screens/CardSwiperScreen';
import ManageCardsScreen from '../screens/ManageCardsScreen';
import EditCardScreen from '../screens/EditCardScreen';
import ViewCardScreen from '../screens/ViewCardScreen';
import MainScreen from '../screens/MainScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ApiTestPage" component={ApiTestPage} />
        <Stack.Screen name="CardSwiper" component={CardSwiperScreen} />
        <Stack.Screen name="ManageCards" component={ManageCardsScreen} />
        <Stack.Screen name="EditCard" component={EditCardScreen} />
        <Stack.Screen name="ViewCard" component={ViewCardScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
      </Stack.Navigator>
    
  );
};

export default MainStackNavigator;