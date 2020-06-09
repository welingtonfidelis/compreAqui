import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/Login';
import Client from './pages/Client';
import NewUser from './pages/NewUser';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={
          {
            // gestureEnabled: true,
            headerTitleAlign: 'center',
            headerTintColor: '#008CF0',
            headerTitleStyle: { fontSize: 24 },
            headerStyle: { elevation: 0 },
            gestureEnabled: false,
            // headerTitleAlign: 'center',
            headerTintColor: '#F2BB16',
            headerTitleStyle: { fontSize: 20 },
            headerStyle: { elevation: 5, height: 45 },
          }
        } >
        <Stack.Screen
          name="login" component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="client" component={Client}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="newUser" component={NewUser}
          options={{ title: 'Novo usuário' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
