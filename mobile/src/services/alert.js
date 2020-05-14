import { Alert } from 'react-native';

export default {
    successInform(title, msg) {
        title = title ? title : 'Sucesso!';
        msg = msg ? msg : 'Salvo com sucesso!';

        return Alert.alert(title, msg);
    },
    errorInform(title, msg) {
        title = title ? title : 'Erro!';
        msg = msg ? msg : 'Houve um erro ao salvar, por favor, tente novamente!';

        return Alert.alert(title, msg);
    },
    async confirm(functionConfirm, title, msg) {
        title = title ? title : 'Atenção!';
        msg = msg ? msg : 'Gostaria realmente de executar esta ação?';

        return await Alert.alert(title, msg,
            [
                {
                    text: 'Não', onPress: async () => { },
                },
                {
                    text: 'Sim', onPress: async () => { functionConfirm(); },
                },
            ]);
    },
};
