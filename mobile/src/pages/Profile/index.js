import React, { useState, useEffect } from 'react';

import {
  View, KeyboardAvoidingView, Text,
  TouchableOpacity, Image,
  ImageBackground, StatusBar, Button
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import TabNavigation from '../../components/TabNavigationClient';

import globalStyles from '../globalStyles';
import styles from './styles';

export default function Profile({ navigation }) {
  const [errorLogin, setErroLogin] = useState(false);
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [PlayerId, setPlayerId] = useState('');
  // const store = useSelector(state => state);
  
  function handleLogout() {
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [ { name: 'login' } ],
    //   })
    // );
    navigation.navigate('login');
  }

  return (
    <View style={styles.container}>
      <Text>Perfil</Text>
      <Icon.Button
        name="ios-person"
        size={30}
        color="#4F8EF7"
        onPress={handleLogout}
      >
        <Text>Sair</Text>
      </Icon.Button>
    </View>
  );
}
