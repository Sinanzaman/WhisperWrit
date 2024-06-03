import React, { useState } from "react";
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Profile from "./Profile";
import WriteDaily from "./writeDaily";
import Explore from "./Explore";
import { auth, createAnonymousid, db } from "../firebase";

const user = auth.currentUser;

const Tab = createBottomTabNavigator();

const Dashboard = ({navigation}) => {

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Çıkış Yap',
                    'Uygulamadan çıkmak istediğinize emin misiniz?',
                    [
                        { text: 'Hayır', style: 'cancel' },
                        { text: 'Evet', onPress: homeNavigate }
                    ]
                );
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const homeNavigate = () => {
        navigation.navigate('Home Screen');
    }

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Günlük Yaz"
                component={WriteDaily}
                options={{
                    tabBarLabel: 'Günlük Yaz',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="reader" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={Explore}
                options={{
                    tabBarLabel: 'Keşfet',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="explore" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="User"
                component={Profile}
                options={{
                    tabBarLabel: 'Kullanıcı',
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#ADD8E6', // Header'ın arka plan rengi
                    },
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default Dashboard;
