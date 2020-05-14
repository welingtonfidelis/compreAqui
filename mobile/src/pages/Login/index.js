import React, { useState, useEffect } from 'react';

import {
  View, KeyboardAvoidingView, Text,
  TouchableOpacity, Image,
  ImageBackground, StatusBar, Button
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { graphql, fetchQuery } from 'react-relay';
import environment from '../../services/createRelayEnvironment';
import OneSignal from 'react-native-onesignal';

import alert from '../../services/alert';

import globalStyles from '../globalStyles';
import styles from './styles';

import logo from '../../assets/images/logo.png';

export default function Login({ navigation }) {
  const [errorLogin, setErroLogin] = useState(false);
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [PlayerId, setPlayerId] = useState('');

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
    console.log(PlayerId);

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
        if (sessionSign.typeUser === 'client') {
          console.log(sessionSign);

        }
        else { alert.successInform(
          'Comerciante',
          'O aplicativo ainda está em desenvolvimento para o seu perfil. Por favor, utilize a plataforma web.');
        }

      }
      else { setErroLogin(true); }

    } catch (error) {
      console.error(error);
      alert.errorInform(null, 'teste');
    }
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
        <Text style={globalStyles.txtSave1}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnReset}
        onPress={() => console.log('reset password')}
      >
        <Text style={styles.txtReset}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.btnSave2, styles.btnRegister]}
        onPress={() => console.log('register')}
      >
        <Text style={globalStyles.txtSave2}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
