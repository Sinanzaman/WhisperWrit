import React, {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from "./Screens/Home";
import Login from './Screens/Login';
import Singup from './Screens/Singup';
import Forget from './Screens/Forget';
import ChangePassword from "./Screens/ChangePassword";
import DeleteAccount from "./Screens/DeleteAccount";
import Dashboard from "./Screens/Dashboard";
import AdminPanel from "./Screens/AdminPanel";
import AdminLoginScreen from "./Screens/AdminLogin";
import AdminConfirm from "./Screens/AdminConfirm";
import AdminBanned from "./Screens/AdminBanned";
import AdminConfirmed from "./Screens/AdminConfirmed";
import Favorite from "./Screens/Favorite";
import UsersDailies from "./Screens/usersDailies";


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home Screen" component={Home}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="Login" component={Login}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="Singup" component={Singup}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="Forget" component={Forget}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword}  options={{ statusBarHidden:true}}/>
        <Stack.Screen name="DeleteAccount" component={DeleteAccount}  options={{ statusBarHidden:true}}/>
        <Stack.Screen name="Dashboard" component={Dashboard}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AdminPanel" component={AdminPanel}  options={{ statusBarHidden:true}}/>
        <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen}  options={{headerShown:false, statusBarHidden:true}}/>
        <Stack.Screen name="AdminConfirm" component={AdminConfirm}  options={{ statusBarHidden:true}}/>
        <Stack.Screen name="AdminBanned" component={AdminBanned}  options={{ statusBarHidden:true}}/>
        <Stack.Screen name="AdminConfirmed" component={AdminConfirmed}  options={{ statusBarHidden:true}}/>
        <Stack.Screen name="Favorite" component={Favorite}  options={{ statusBarHidden:true}}/>
        <Stack.Screen name="UsersDailies" component={UsersDailies}  options={{ statusBarHidden:true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;