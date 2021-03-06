import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import Login from '../../pages/Login';
import Home from '../../pages/HomeClient';
import Search from '../../pages/SearchClient';
import Profile from '../../pages/Profile';

import Requests from '../../pages/RequestsClient';
import RequestDetail from '../../pages/RequestClientDetail';

import CompanyDetail from '../CompanyDetail';

import PurchaseList from '../../pages/PurchaseList';
import PurchaseProduct from '../../pages/PurchaseProduct';
import PurchaseSend from '../../pages/PurchaseSend';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabNavigationUser() {
    const store = useSelector(state => state.company);

    const [showModal, setShowModal] = useState(false);

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

                {/* <Tab.Screen name="Pesquisar" component={Search} options={{
                    tabBarIcon: ({ color, focused }) =>
                        <Icon name="magnify" color={color} size={focused ? 35 : 28} />,
                }} /> */}

                <Tab.Screen name="Pedidos" component={Requests} options={{
                    tabBarIcon: ({ color, focused }) =>
                        <Icon name="tag-heart" color={color} size={focused ? 35 : 28} />,
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
            {showModal 
                ? <CompanyDetail showModal={showModal} setShowModal={setShowModal} />
                : null
            }

            <Stack.Navigator
                initialRouteName="client"
                screenOptions={{
                    gestureEnabled: false,
                    // headerTitleAlign: 'center',
                    headerTintColor: '#F2BB16',
                    headerTitleStyle: { fontSize: 20 },
                    headerStyle: { elevation: 5, height: 45 },
                    headerRight: () => {
                        return (
                            store.id > 0 ?
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() => setShowModal(true)}
                                >
                                    <Icon
                                        name="store" size={30}
                                        color="#646464"
                                    />
                                </TouchableOpacity>
                                : null
                        )

                    },
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
                <Stack.Screen
                    options={{ headerTitle: store.name }}
                    name="purchaseList"
                    component={PurchaseList}
                />
                <Stack.Screen
                    options={{ headerTitle: store.name }}
                    name="purchaseProduct"
                    component={PurchaseProduct}
                />
                <Stack.Screen
                    options={{ headerTitle: store.name }}
                    name="purchaseSend"
                    component={PurchaseSend}
                />
                <Stack.Screen
                    options={{ headerTitle: store.name }}
                    name="requestClientDetail"
                    component={RequestDetail}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
