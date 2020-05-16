import React, { useState, useEffect } from 'react';

import {
  View, KeyboardAvoidingView, Text,
  TouchableOpacity, Image,
  ImageBackground, StatusBar, Button
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import TabNavigation from '../../components/TabNavigationClient';

import globalStyles from '../globalStyles';
import styles from './styles';

export default function RequestsClient({ navigation }) {
  const [errorLogin, setErroLogin] = useState(false);
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [PlayerId, setPlayerId] = useState('');

  return (
    <View style={styles.container}>
      <Text>Pedidos</Text>
      <Icon name="ios-person" size={30} color="#4F8EF7" />
    </View>
  );
}
