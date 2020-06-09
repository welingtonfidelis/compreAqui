import React, { useState, useEffect } from 'react';

import { View, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { graphql, fetchQuery } from 'react-relay';
import environment from '../../services/createRelayEnvironment';
import OneSignal from 'react-native-onesignal';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import alert from '../../services/alert';

import globalStyles from '../globalStyles';
import styles from './styles';

import logo from '../../assets/images/logo.png';

export default function Login({ navigation }) {
  const [errorLogin, setErroLogin] = useState(false);
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState('user1');
  const [password, setPassword] = useState('1234');
  const [PlayerId, setPlayerId] = useState('');
  const dispatch = useDispatch();
  const position = useSelector(state => state);

  useEffect(() => {
    async function init() {
      OneSignal.init('69aed868-64cd-46d5-ad07-77b54a508408');
      OneSignal.getPermissionSubscriptionState((resp) => {
        if (resp.userId) { setPlayerId(resp.userId); }
      });
    }

    init();
  }, []);

  async function handleSubmit() {
    setLoad(true);
    try {
      const query = graphql`
            query LoginsessionSignQuery($user: String!, $password: String!, $PlayerId: String) {
                sessionSign(user: $user, password: $password, playId: $PlayerId) {
                    name
                    token
                    typeUser
                    photoUrl
                }
            }`;

      const variables = { user, password, PlayerId };
      const response = await fetchQuery(environment, query, variables);

      const { sessionSign } = response;
      if (sessionSign) {
        const { name, typeUser, photoUrl, token } = sessionSign;
        if (typeUser === 'client') {
          OneSignal.sendTag('user_type', 'client');
          dispatch({ type: 'UPDATE_USER', user: { name, typeUser, token, photoUrl } });
          await AsyncStorage.setItem('compreAqui@token', token);

          navigation.navigate('client');
          setLoad(false);
          return;
        }
        else {
          OneSignal.sendTag('user_type', 'commercial');
          alert.successInform(
            'Comerciante',
            'O aplicativo ainda está em desenvolvimento para o seu perfil. Por favor, utilize a plataforma web.');
        }

      }
      else { setErroLogin(true); }

    } catch (error) {
      console.error(error);
      alert.errorInform(
        null,
        'Houve um erro ao tentar logar em sua conta. Por favor, tente novamente'
      );
    }
    setLoad(false);
  }

  function handleNewUser() {
    navigation.push('newUser');
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <View style={styles.containerWelcome}>
        <Text style={styles.txtWelcome}>Seja bem vindo.</Text>
        <Text style={styles.txtWelcome}>
          Por favor, insira seu usuário e senha a baixo para começarmos.
        </Text>
      </View>

      <TextInput
        label="Usuário"
        value={user}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={text => setUser(text)}
      />
      <TextInput
        label="Senha"
        value={password}
        autoCapitalize="none"
        secureTextEntry={true}
        mode="outlined"
        onChangeText={text => setPassword(text)}
      />

      {errorLogin
        ? <Text style={styles.txtInvalid}>Usuário ou senha inválidos</Text>
        : null
      }

      <TouchableOpacity
        style={globalStyles.btnSave1}
        onPress={handleSubmit}
      >
        {load
          ? <ActivityIndicator animating={load} />
          : <Text style={globalStyles.txtSave1}>Entrar</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnReset}
        onPress={() => console.log('reset password')}
      >
        <Text style={styles.txtReset}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.btnSave2, styles.btnRegister]}
        onPress={handleNewUser}
      >
        <Text style={globalStyles.txtSave2}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
