import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Button, Modal, Text, RefreshControl,
    FlatList, TouchableOpacity, Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { graphql, fetchQuery } from 'react-relay';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import environment from '../../services/createRelayEnvironment';

import alert from '../../services/alert';
import util from '../../services/util';

import globalStyles from '../../pages/globalStyles';
import styles from './styles';

export default function ModalDefault({ showModal, closeModal, children }) {

    return (
        <Modal
            transparent={false}
            visible={showModal}
            animationType="slide"
            onRequestClose={() => close()}
        >
            <View style={styles.container}>
                <Icon
                    name="arrow-back"
                    size={30}
                    color="#000"
                    backgroundColor="#fff"
                    onPress={() => closeModal(false)}
                >
                </Icon>

                <View>
                    {children}
                    {/* <FlatList
                        data={photos}
                        keyExtractor={(item, index) => `${index}`}
                        numColumns={1}
                        horizontal={true}
                        renderItem={({ item }) => {
                            return (
                                <Image
                                    source={{ uri: item.foto_url }}
                                    style={styles.image} />
                            );
                        }}
                    /> */}
                </View>
            </View>
        </Modal>
    )
}