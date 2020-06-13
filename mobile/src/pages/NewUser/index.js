import React, { useState, useEffect } from 'react';

import {
  View, Text,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { graphql, fetchQuery } from 'react-relay';
import { ActivityIndicator, TextInput, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import PickerModal from 'react-native-picker-modal-view';
import { TextInputMask } from 'react-native-masked-text'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import OptionBottom from '../../components/OptionBottom';
import Camera from '../../components/Camera';

import environment from '../../services/createRelayEnvironment';
import alert from '../../services/alert';

import globalStyles from '../globalStyles';
import styles from './styles';

import userLogo from '../../assets/images/userLogo.png';
import util from '../../services/util';
import api from '../../services/api';

export default function NewUser({ navigation }) {
  const [load, setLoad] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [show, setShow] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [formData, setFormaData] = useState({});
  const [validateData, setValidateData] = useState({});

  useEffect(() => {
    // handleInputChange('file', Image.resolveAssetSource(userLogo).uri);
    getInfo();
  }, [])

  async function getInfo() {
    setLoad(true)
    try {
      const query = graphql`
        query NewUserstateIndexAndcategoryIndexQuery {
          stateIndex {
            id
            Name: description
            Value: code
          }
          categoryIndex {
            Value: id
            Name: name
          }
        }
      `

      const variables = {}
      const response = await fetchQuery(environment, query, variables)

      if (response.stateIndex) {
        setStateList(response.stateIndex)
      }
      if (response.categoryIndex) {
        setCategoryList(response.categoryIndex)
      }
    } catch (error) {
      console.error(error)
    }
    setLoad(false)
  }

  async function handleSubmit() {
    setLoad(true);
    if (validateInput()) {
      try {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("doc", formData.doc);
        data.append("email", formData.email);
        data.append("phone1", formData.phone1);
        data.append("phone2", formData.phone2 ? formData.phone2 : '');
        data.append("user", formData.user);
        data.append("birth", `${util.stringToDate(formData.birth)}`);
        data.append("password", formData.password);
        data.append("type", formData.type);
        data.append("cep", formData.cep ? formData.cep : '');
        data.append("state", formData.state.Value);
        data.append("city", formData.city);
        data.append("district", formData.district);
        data.append("street", formData.street);
        data.append("number", formData.number);
        data.append("complement", formData.complement ? formData.complement : '');

        if (formData.type === 'comercial') {
          data.append("CategoryId", formData.category.Value);
        }

        if (formData.file) {
          const time = new Date().getTime();
          data.append('file', {
            uri: formData.file,
            type: 'image/jpeg', // or photo.type
            name: `${formData.doc}_${time}.jpeg`
          });
        }

        const query = await api.post("user", data, {
          headers: {
            'Content-Type': 'multipart/form-data;'
          },
        });

        const { status } = query.data;
        if (status) {
          alert.successInform(
            'Usuário',
            'Salvo com sucesso.'
          );
          setLoad(false)
          handleBack();
          return
        } else alert.errorInform(
          'Usuário',
          'Houve um erro ao tentar salvar seus dados. Por favor, tente novamente.'
        );

      } catch (error) {
        console.warn(error)
        alert.errorInform(
          'Usuário',
          'Houve um erro ao tentar salvar seus dados. Por favor, tente novamente.'
        );
      }
    }
    else {
      alert.errorInform(
        'Usuário',
        'Por favor, revise os dados inseridos e atente-se aos campos destacados em VERMELHO'
      );
    }
    setLoad(false);
  }

  function validateInput() {
    let isValid = true;

    for (const el of Object.entries(hasErrors())) {
      if (el[1]) {
        isValid = false;
        break;
      }
    }
    return isValid;
  }

  function hasErrors() {
    return {
      category: formData.type === 'comercial' && !formData.category,
      name: !formData.name || formData.name === '',
      email: !formData.email || (!(/\S+@\S+\.\S+/).test(formData.email) || validateData.email),
      street: !formData.street || formData.street === '',
      number: !formData.number || formData.number === '',
      district: !formData.district || formData.district === '',
      city: !formData.city || formData.city === '',
      doc: !formData.doc || (formData.doc === '' || validateData.doc),
      phone1: !formData.phone1 || formData.phone1 === '',
      user: !formData.user || (formData.user === '' || formData.user.length < 3 || validateData.user),
      password: !formData.password || (formData.password === '' || formData.password.length < 4),
      passwordConfirm: !formData.passwordConfirm || formData.password !== formData.passwordConfirm,
      birth: !formData.birth || formData.birth === '',
      state: !formData.state
    }
  }

  function handleBack() {
    navigation.goBack();
  }

  function SelectTypeUser() {
    return (
      <View style={styles.typeUserContainer}>
        <Text style={styles.cardButtonTitle}>Qual tipo de usuário  você quer ser?</Text>

        <View style={styles.cardButtonContainer}>
          <TouchableOpacity
            onPress={() => handleInputChange('type', 'client')}
            style={styles.cardButton}
          >
            <Icon
              name="cart"
              size={100}
              color="#3F51B5"
            />
            <Text style={styles.cardButtonText}>Cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleInputChange('type', 'comercial')}
            style={styles.cardButton}
          >
            <Icon
              name="store"
              size={100}
              color="#2EB940"
            />
            <Text style={styles.cardButtonText}>Empresa</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function handleInputChange(name, value) {
    setFormaData({ ...formData, [name]: value });
  }

  function handleValidateChange(name, value) {
    setValidateData({ ...validateData, [name]: value });
  }

  function handleChangeUserType() {
    setFormaData({ ...formData, 'type': null });
  }

  async function handlePhoto(type) {
    setShow(!show);

    if (type) {
      setShowCamera(true);
    }
    else {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.images],
        });

        handleInputChange('file', res.uri);

      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }
  }

  async function handleCheckEmail() {
    if (formData.email && formData.email !== "") {
      setLoad(true)
      try {
        const query = graphql`
          query NewUseruserShowByEmailQuery($email: String!) {
            userShowByEmail(email: $email) {
              id
            }
          }
        `

        const variables = { email: formData.email }
        const response = await fetchQuery(environment, query, variables)

        if (response.userShowByEmail) {
          alert.errorInform('Usuário', 'Este e-mail já está sendo utilizado. Por favor, insira outro');
          handleValidateChange('email', true);
        }
        else handleValidateChange('email', false);

      } catch (error) {
        console.error(error)
      }
      setLoad(false)
    }
  }

  async function handleCheckUser() {
    if (formData.user && formData.user !== "") {
      setLoad(true)
      try {
        const query = graphql`
          query NewUseruserShowByUserQuery($user: String!) {
            userShowByUser(user: $user) {
              id
            }
          }
        `

        const variables = { user: formData.user }
        const response = await fetchQuery(environment, query, variables)

        if (response.userShowByUser) {
          alert.errorInform('Usuário', 'Este usuário/login já está sendo utilizado. Por favor, insira outro');
          handleValidateChange('user', true);
        }
        else handleValidateChange('user', false);

      } catch (error) {
        console.error(error)
      }

      setLoad(false)
    }
  }

  async function handleCheckDoc() {
    if (formData.doc && formData.doc !== "") {
      setLoad(true)
      try {
        const query = graphql`
          query NewUseruserShowByDocQuery($doc: String!) {
            userShowByDoc(doc: $doc) {
              id
            }
          }
        `

        const variables = { doc: formData.doc }
        const response = await fetchQuery(environment, query, variables)

        if (response.userShowByDoc) {
          alert.errorInform('Usuário', 'Este documento já está sendo utilizado. Por favor, insira outro');
          handleValidateChange('doc', true);
        }
        else handleValidateChange('doc', false);

      } catch (error) {
        console.error(error)
      }

      setLoad(false)
    }
  }

  async function handleCep() {
    setLoad(true)
    const response = await util.getCep(formData.cep)

    if (response) {
      handleInputChange('street', response.logradouro);
      handleInputChange('complement', response.complemento);
      handleInputChange('district', response.bairro);
      handleInputChange('city', response.localidade);
      handleInputChange('state', { Name: response.uf, Value: response.uf });
    }
    setLoad(false)
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {formData.type ?
          <>
            <TouchableOpacity
              style={styles.containerUserLogo}
              onPress={() => { setShow(true) }}
            >
              {formData.file
                ? <Image style={styles.userLogo} source={{ uri: formData.file }} />
                : <Image style={styles.userLogo} source={userLogo} />
              }
            </TouchableOpacity>

            <OptionBottom show={show} setShow={setShow}>
              <View>
                <Text style={globalStyles.OptionBottomTitle}>Escolher imagem</Text>
              </View>
              <View style={globalStyles.OptionBottomContainer}>
                <View>
                  <IconButton
                    icon={'camera'}
                    color={'#F2BB16'}
                    size={100}
                    onPress={() => { handlePhoto(true) }}
                  />
                  <Text style={globalStyles.OptionBottomText1}>Câmera</Text>
                </View>
                <View>
                  <IconButton
                    icon={'image-multiple'}
                    color={'#F2BB16'}
                    size={100}
                    onPress={() => { handlePhoto(false) }}
                  />
                  <Text style={globalStyles.OptionBottomText1}>Galeria</Text>
                </View>
              </View>
            </OptionBottom>

            <Camera
              setFile={handleInputChange}
              setShowCamera={setShowCamera}
              showCamera={showCamera}
            />

            <Text>{formData.type === 'client' ? 'Cliente' : 'Comercial'}</Text>

            {formData.type === 'comercial' ?
              <PickerModal
                renderSelectView={(disabled, selected, showModal) =>
                  <Text
                    style={[
                      globalStyles.textSelectModal,
                      hasErrors().category ? globalStyles.textError : null
                    ]}
                    disabled={disabled}
                    onPress={showModal}
                  >
                    {formData.company ? formData.company.Name : 'Categoria'}
                  </Text>
                }
                onSelected={(data) => handleInputChange('category', data)}
                items={categoryList}
                searchPlaceholderText={'Procurar'}
                requireSelection={true}
              />
              : null}

            <TextInput
              label={formData.type === 'client' ? 'CPF *' : 'CNPJ *'}
              mode='outlined'
              onBlur={handleCheckDoc}
              keyboardType="numeric"
              onChangeText={(formatted, extracted) => handleInputChange('doc', formatted)}
              error={hasErrors().doc}
              render={props =>
                <TextInputMask
                  {...props}
                  type={formData.type === 'client' ? 'cpf' : 'cnpj'}
                  value={formData.doc}
                />
              }
            />

            <TextInput
              label="Data de nascimento"
              mode='outlined'
              keyboardType="numeric"
              onChangeText={(formatted, extracted) => handleInputChange('birth', formatted)}
              error={hasErrors().birth}
              render={props =>
                <TextInputMask
                  {...props}
                  type="custom"
                  value={formData.birth}
                  options={{ mask: '99/99/9999' }}
                />
              }
            />

            <TextInput
              label="Nome"
              mode="outlined"
              value={formData.name}
              error={hasErrors().name}
              onChangeText={text => handleInputChange('name', text)}
            />

            <TextInput
              label="E-mail"
              mode="outlined"
              autoCapitalize="none"
              onBlur={handleCheckEmail}
              value={formData.email}
              error={hasErrors().email}
              onChangeText={text => handleInputChange('email', text)}
            />

            <TextInput
              label="Telefone 1"
              mode='outlined'
              keyboardType="numeric"
              onChangeText={(formatted, extracted) => handleInputChange('phone1', formatted)}
              error={hasErrors().phone1}
              render={props =>
                <TextInputMask
                  {...props}
                  type="cel-phone"
                  value={formData.phone1}
                />
              }
            />

            <TextInput
              label="Telefone 2"
              mode='outlined'
              keyboardType="numeric"
              onChangeText={(formatted, extracted) => handleInputChange('phone2', formatted)}
              render={props =>
                <TextInputMask
                  {...props}
                  type="cel-phone"
                  value={formData.phone2}
                />
              }
            />

            <TextInput
              label="Usuário/Login"
              mode="outlined"
              onBlur={handleCheckUser}
              value={formData.user}
              autoCapitalize="none"
              error={hasErrors().user}
              onChangeText={text => handleInputChange('user', text)}
            />

            <TextInput
              label="Senha"
              mode="outlined"
              value={formData.password}
              autoCapitalize="none"
              secureTextEntry={true}
              error={hasErrors().password}
              onChangeText={text => handleInputChange('password', text)}
            />

            <TextInput
              label="Confirmar senha"
              mode="outlined"
              value={formData.passwordConfirm}
              autoCapitalize="none"
              secureTextEntry={true}
              error={hasErrors().passwordConfirm}
              onChangeText={text => handleInputChange('passwordConfirm', text)}
            />

            <TextInput
              label="Cep"
              mode='outlined'
              onBlur={handleCep}
              keyboardType="numeric"
              onChangeText={(formatted, extracted) => handleInputChange('cep', formatted)}
              render={props =>
                <TextInputMask
                  {...props}
                  type="zip-code"
                  value={formData.cep}
                />
              }
            />

            <TextInput
              label="Rua"
              mode="outlined"
              value={formData.street}
              error={hasErrors().street}
              onChangeText={text => handleInputChange('street', text)}
            />

            <TextInput
              label="Número"
              mode='outlined'
              keyboardType="numeric"
              onChangeText={(formatted, extracted) => handleInputChange('number', formatted)}
              error={hasErrors().number}
              render={props =>
                <TextInputMask
                  {...props}
                  type="custom"
                  value={formData.number}
                  options={{ mask: '999999999' }}
                />
              }
            />

            <TextInput
              label="Complemento"
              mode="outlined"
              value={formData.complement}
              onChangeText={text => handleInputChange('complement', text)}
            />

            <TextInput
              label="Bairro"
              mode="outlined"
              value={formData.district}
              error={hasErrors().district}
              onChangeText={text => handleInputChange('district', text)}
            />

            <TextInput
              label="Cidade"
              mode="outlined"
              value={formData.city}
              error={hasErrors().city}
              onChangeText={text => handleInputChange('city', text)}
            />

            <PickerModal
              renderSelectView={(disabled, selected, showModal) =>
                <Text
                  style={[
                    globalStyles.textSelectModal,
                    { marginTop: 6 },
                    hasErrors().state ? globalStyles.textError : null
                  ]}
                  disabled={disabled}
                  onPress={showModal}
                >
                  {formData.state ? formData.state.Name : 'Estado'}
                </Text>
              }
              onSelected={(data) => handleInputChange('state', data)}
              items={stateList}
              searchPlaceholderText={'Procurar'}
              requireSelection={true}
            />

            <TouchableOpacity
              style={globalStyles.btnSave2}
              onPress={handleSubmit}
            >
              {load
                ? <ActivityIndicator animating={load} />
                : <Text style={globalStyles.txtSave2}>Cadastrar</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.btnSave1}
              onPress={handleChangeUserType}
            >
              <Text style={globalStyles.txtSave1}>Mudar tipo de usuário</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnReset}
              onPress={handleBack}
            >
              <Text style={styles.txtHaveUser}>Já tenho cadastro</Text>
            </TouchableOpacity>
          </>
          :
          <SelectTypeUser />
        }
      </View>
    </ScrollView>
  );
}
