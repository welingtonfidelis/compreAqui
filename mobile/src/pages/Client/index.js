import React from 'react';
import { View } from 'react-native';

import TabNavigation from '../../components/TabNavigationClient';

import styles from './styles';

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <TabNavigation />
    </View>
  );
}
