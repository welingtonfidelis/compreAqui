import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/Login';

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
            headerStyle: { elevation: 0 }
          }
        } >
        <Stack.Screen
          name="login" component={Login}
          options={{
            headerShown: false
          }}
        />    
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;