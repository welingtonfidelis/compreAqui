import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

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
                <TouchableOpacity 
                    onPress={() => closeModal(false)} 
                    style={styles.btnBack}
                >
                    <Icon
                        name="arrow-back"
                        size={30}
                        color="#F2BB16"
                    />
                </TouchableOpacity>

                <View>
                    {children}
                </View>
            </View>
        </Modal>
    )
}