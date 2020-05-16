import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Login from '../../pages/Login';
import Home from '../../pages/HomeClient';
import Search from '../../pages/SearchClient';
import Requests from '../../pages/RequestsClient';
import Profile from '../../pages/Profile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabNavigationUser() {
    function MainTabNavigator() {
        return (
            <Tab.Navigator tabBarOptions={{
                activeTintColor: '#F2BB16', inactiveTintColor: '#646464',
                showIcon: true, showLabel: true, tabStyle: { backgroundColor: '#000' },
            }} >

                <Tab.Screen name="Home" component={Home} options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) =>
                        <Icon name="home" color={color} size={focused ? 35 : 28} />,
                }} />

                <Tab.Screen name="Pesquisar" component={Search} options={{
                    tabBarIcon: ({ color, focused }) =>
                    <Icon name="search" color={color} size={focused ? 35 : 28} />,
                }} />

                <Tab.Screen name="Pedidos" component={Requests} options={{
                    tabBarIcon: ({ color, focused }) =>
                    <Icon name="loyalty" color={color} size={focused ? 35 : 28} />,
                }} />
                <Tab.Screen name="Perfil" component={Profile} options={{
                    tabBarIcon: ({ color, focused }) =>
                    <Icon name="face" color={color} size={focused ? 35 : 28} />,
                }} />
            </Tab.Navigator>
        );
    }

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                initialRouteName="client"
                screenOptions={{
                    gestureEnabled: true,
                    headerTitleAlign: 'center',
                    headerTintColor: '#008CF0',
                    headerTitleStyle: { fontSize: 24 },
                    headerStyle: { elevation: 0 },
                }}
                headerMode="float">
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="home"
                    component={MainTabNavigator}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="login"
                    component={Login}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
