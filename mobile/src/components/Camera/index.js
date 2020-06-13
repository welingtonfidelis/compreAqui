import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';
import globalStyles from '../../pages/globalStyles';

export default function Camera({ setShowCamera, showCamera, setFile }) {
    const [typeCamera, setTypeCamera] = useState('back');
    const [changeType, setChangeType] = useState(false);

    async function takePicture(camera) {
        const options = {
            quality: 0.5,
            base64: true,
            forceUpOrientation: true,
            fixOrientation: true,
        };
        const data = await camera.takePictureAsync(options);

        await setFile('file', `${data.uri}`);

        setShowCamera(false);
    }

    useEffect(() => {
        if (changeType) setTypeCamera('front');
        else setTypeCamera('back');
    }, [changeType]);

    return (
        <Modal
            transparent={false}
            visible={showCamera}
            animationType="slide"
            onRequestClose={() => setShowCamera(false)}>

            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    type={typeCamera}
                    captureAudio={false}
                    androidCameraPermissionOptions={{
                        title: 'Permissão para Camera',
                        message: 'Precisamos usar sua camera!',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    mirrorImage={true}
                    fixOrientation={true}
                >
                    {({ camera, status }) => {
                        return (
                            <>
                                <IconButton
                                    style={styles.backButton}
                                    icon={'arrow-left'}
                                    color={'#F2BB16'}
                                    size={30}
                                    onPress={() => setShowCamera(false)}
                                />
                                <View style={[globalStyles.flexRow, { alignItems: 'center' }]}>
                                    <View style={{ flex: 1 }} />

                                    <View style={styles.iconCamera}>
                                        <TouchableOpacity
                                            onPress={() => takePicture(camera)}
                                            style={styles.capture}
                                        >
                                            <Icon
                                                name={'camera'}
                                                size={80}
                                                color="#F2BB16"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.iconChangeType}>
                                        <TouchableOpacity
                                            onPress={() => setChangeType(!changeType)}
                                            style={styles.capture}
                                        >
                                            <Icon
                                                name={changeType ? 'camera-rear-variant' : 'camera-front-variant'}
                                                size={50}
                                                color="#F2BB16"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        );
                    }}
                </RNCamera>
            </View>
        </Modal>
    )
}