const Swal = require('sweetalert2');
const userName = localStorage.getItem('compreAqui@userName') ? 
    localStorage.getItem('compreAqui@userName') : 
    'Usuário';

module.exports = {
    swalInform(title = null, text = null, icon = null) {
        title = title ? title : userName;
        text = text ? text : 'Salvo com sucesso.';
        icon = icon ? icon : 'success';
    
        return Swal.fire(
            {
                title,
                text,
                icon,
            }
        )
    },

    swalErrorInform(title = null, text = null, icon = null) {
        title = title ? title : userName;
        text = text ? text : 'Parece que algo deu errado. Por favor, ' +
            'revise os dados inseridos e tente novamente.';
        icon = icon ? icon : 'error';

        return Swal.fire(
            {
                title,
                text,
                icon,
            }
        )
    },
    
    swalConfirm(title = '', text = '') {
        return Swal.fire({
            type: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText: 'SIM',
            cancelButtonText: 'NÃO',
            reverseButtons: true
        }).then((result) => {
            return (result.value)
        })
    },

}
