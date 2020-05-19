import React from 'react';
import { View, Button, Modal, Text } from 'react-native';
import { useSelector } from 'react-redux';

export default function PurhcaseList() {
    const store = useSelector(state => state.company);

    return (
        <View>
            <Text>Página decompras {store.name}</Text>
        </View>
    );
}
