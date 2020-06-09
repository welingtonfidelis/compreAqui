import React, { useState, useEffect } from 'react';

import {
  View, KeyboardAvoidingView, Text,
  TouchableOpacity, Image,
  ImageBackground, StatusBar, Button
} from 'react-native';
import { graphql, fetchQuery } from 'react-relay';
import { ActivityIndicator, TextInput, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';

import OptionBottom from '../../components/OptionBottom';
import Camera from '../../components/Camera';

import environment from '../../services/createRelayEnvironment';

import globalStyles from '../globalStyles';
import styles from './styles';

import userLogo from '../../assets/images/userLogo.png';

export default function NewUser({ navigation }) {
  const [load, setLoad] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [show, setShow] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [formData, setFormaData] = useState({});

  useEffect(() => {
    handleInputChange('file', Image.resolveAssetSource(userLogo).uri);
    getInfo();
  }, [])

  async function getInfo() {
    setLoad(true)
    try {
      const query = graphql`
        query NewUserstateIndexAndcategoryIndexQuery {
          stateIndex {
            id
            description
            code
          }
          categoryIndex {
            id
            name
          }
        }
      `

      const variables = {}
      const response = await fetchQuery(environment, query, variables)

      console.log(response);

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

  function handleBack() {
    navigation.goBack();
  }

  function SelectTypeUser() {
    return (
      <>
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
      </>
    )
  }

  function handleInputChange(name, value) {
    setFormaData({ ...formData, [name]: value });
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

        console.log(res.uri);

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

  return (
    <View style={styles.container}>
      {formData.type ?
        <>
          <TouchableOpacity
            style={styles.containerUserLogo}
            onPress={() => { setShow(true) }}
          >
            <Image style={styles.userLogo} source={{ uri: formData.file }} />
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

          <TextInput
            label="Teste"
            mode="outlined"
            onChangeText={text => handleInputChange('name', text)}
          />

          <TouchableOpacity
            style={globalStyles.btnSave2}
            onPress={handleChangeUserType}
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
  );
}
