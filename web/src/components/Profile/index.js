import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { Button, TextField } from '@material-ui/core';
import { Storefront, ShoppingCart } from '@material-ui/icons';
import NumberFormat from 'react-number-format';
import { fetchQuery, commitMutation } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import swal from '../../services/SweetAlert';
import util from '../../services/util';
import Load from '../Load';

import ImageProfile from '../../assets/images/user.png'
import styles from './styles.scss';

const graphql = require('babel-plugin-relay/macro');

export default function Profile(props) {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [doc, setDoc] = useState('');
    const [docFormat, setDocFormat] = useState({ dsc: 'CPF', mask: '###.###.###-##' })
    const [email, setEmail] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [user, setUser] = useState('');
    const [birth, setBirth] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [type, setType] = useState('');
    const [cep, setCep] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [street, setStreet] = useState('');
    const [complement, setComplement] = useState('');
    const [number, setNumber] = useState('');
    const [showSubmit, setShowSubmit] = useState(true);

    useEffect(() => {
        if (props.type) {
            setType(props.type);
            if (props.type !== 'client') {
                setDocFormat({ dsc: 'CNPJ', mask: '##.###.###/####-##' });
            }

            if (props.showSubmit) setShowSubmit(false);
        };
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        const mutation = graphql`
            mutation ProfileuserStoreMutation(
                $name: String!, $doc: String!, $email: String!,
                $phone1: String!, $phone2: String!, $user: String!,
                $birth: String!, $password: String!, $type: String!,
                $cep: String!, $state: String!, $city: String!,
                $district: String!, $street: String!, $complement: String!,
                $number: Int!
            ) {
                userStore(
                    name: $name doc: $doc email: $email 
                    phone1: $phone1 phone2: $phone2 user: $user
                    birth: $birth password: $password type: $type
                    cep: $cep state: $state city: $city
                    district: $district street: $street
                    complement: $complement number: $number
                    ) {
                        name
                    }
            }
        `;

        const variables = {
            name, doc, email, phone1, phone2, user,
            birth, password, type, cep, state, city,
            district, street, complement, number: parseInt(number),
        };

        commitMutation(environment, {
            mutation, variables,
            onCompleted: (response, errors) => {
                const { userStore } = response;

                if (userStore.name) {
                    swal.swalInform();
                    history.push('/');
                }
                else swal.swalErrorInform();
            },
            onError: err => {
                console.error(err);
                swal.swalErrorInform();
            },
        });

        setLoading(false);
    }

    async function handleCheckEmail() {
        if (email !== '') {
            setLoading(true);
            try {
                const query = graphql`
                query ProfileuserShowByEmailQuery($email: String!) {
                    userShowByEmail(email: $email) {
                        id
                    }
                }`;

                const variables = { email };
                const response = await fetchQuery(environment, query, variables);
                const div = document.getElementById('email');
                if (response.userShowByEmail) {
                    div.setCustomValidity("E-mail já em uso.");
                    div.reportValidity();
                }
                else div.setCustomValidity("");

            } catch (error) {
                console.error(error);
            }

            setLoading(false);
        }
    }

    async function handleCheckUser() {
        if (user !== '') {
            setLoading(true);
            try {
                const query = graphql`
                query ProfileuserShowByUserQuery($user: String!) {
                    userShowByUser(user: $user) {
                        id
                    }
                }`;

                const variables = { user };
                const response = await fetchQuery(environment, query, variables);
                const div = document.getElementById('user');
                if (response.userShowByUser) {
                    div.setCustomValidity("Usuário já em uso.");
                    div.reportValidity();
                }
                else div.setCustomValidity("");

            } catch (error) {
                console.error(error);
            }

            setLoading(false);
        }
    }

    async function handleCheckDoc() {
        if (doc !== '') {
            setLoading(true);
            try {
                const query = graphql`
                query ProfileuserShowByDocQuery($doc: String!) {
                    userShowByDoc(doc: $doc) {
                        id
                    }
                }`;

                const variables = { doc };
                const response = await fetchQuery(environment, query, variables);
                const div = document.getElementById('doc');
                if (response.userShowByDoc) {
                    div.setCustomValidity(`${docFormat.dsc} já em uso.`);
                    div.reportValidity();
                }
                else div.setCustomValidity("");

            } catch (error) {
                console.error(error);
            }

            setLoading(false);
        }
    }

    async function handleCheckConfirmPassword() {
        const div = document.getElementById('passwordConfirm');

        if (password !== passwordConfirm) {
            div.setCustomValidity('As senhas não conferem.');
        }
        else div.setCustomValidity("");
    }

    async function handleCep() {
        setLoading(true);
        const response = await util.getCep(cep);

        if (response) {
            setStreet(response.logradouro);
            setComplement(response.complemento);
            setDistrict(response.bairro);
            setCity(response.localidade);
            setState(response.uf);
        }

        setLoading(false);
    }

    return (
        <form className="flex-col profile-form" autoComplete="off" onSubmit={handleSubmit}>
            <Load loading={loading} />
            <h1 className="title-modal">{type === 'client' ? "Cliente" : "Empresa"}</h1>

            <img className="image-profile-large" src={ImageProfile} alt="Foto perfil" />

            <div className="flex-row-w">
                <div className="input-separator">
                    <NumberFormat
                        required
                        id="doc"
                        value={doc}
                        onChange={event => setDoc(event.target.value)}
                        onBlur={handleCheckDoc}
                        format={docFormat.mask}
                        label="teste"
                        placeholder={docFormat.dsc}
                        mask="_"
                    />

                </div>

                <div className="input-separator">
                    <TextField
                        fullWidth
                        required
                        type="date"
                        id="birth"
                        label="Data de nascimento"
                        variant="outlined"
                        value={birth}
                        onChange={event => setBirth(event.target.value)}
                    />
                </div>
            </div>

            <div className="input-separator">
                <TextField
                    fullWidth
                    required
                    id="name"
                    label="Nome do usuário"
                    variant="outlined"
                    value={name}
                    onChange={event => setName(event.target.value)}
                />
            </div>

            <div className="input-separator">
                <TextField
                    fullWidth
                    required
                    type="email"
                    id="email"
                    label="E-mail do usuário"
                    variant="outlined"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    onBlur={handleCheckEmail}
                />
            </div>

            <div className="flex-row-w">
                <div className="input-separator">
                    <NumberFormat
                        required
                        id="phone1"
                        value={phone1}
                        onChange={event => setPhone1(event.target.value)}
                        format="(##) # ####-####"
                        placeholder="Telefone 1 do usuário"
                        mask="_"
                    />
                </div>

                <div className="input-separator">
                    <NumberFormat
                        id="phone2"
                        value={phone2}
                        onChange={event => setPhone2(event.target.value)}
                        format="(##) # ####-####"
                        placeholder="Telefone 2 do usuário"
                        mask="_"
                    />
                </div>
            </div>

            <div className="input-separator">
                <TextField
                    fullWidth
                    required
                    id="user"
                    label="Usuário"
                    variant="outlined"
                    value={user}
                    onChange={event => setUser(event.target.value)}
                    onBlur={handleCheckUser}
                />
            </div>

            <div className="flex-row-w">
                <div className="input-separator">
                    <TextField
                        fullWidth
                        required
                        type="password"
                        id="password"
                        label="Senha"
                        variant="outlined"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
                </div>

                <div className="input-separator">

                    <TextField
                        fullWidth
                        required
                        type="password"
                        id="passwordConfirm"
                        label="Confirmar senha"
                        variant="outlined"
                        value={passwordConfirm}
                        onChange={event => setPasswordConfirm(event.target.value)}
                        onBlur={handleCheckConfirmPassword}
                    />
                </div>
            </div>

            <div className="input-separator">
                <NumberFormat
                    required
                    id="cep"
                    value={cep}
                    onChange={event => setCep(event.target.value)}
                    format="########"
                    placeholder="Cep"
                    mask="_"
                    onBlur={handleCep}
                />
            </div>

            <div className="input-separator">
                <TextField
                    fullWidth
                    required
                    id="street"
                    label="Rua"
                    variant="outlined"
                    value={street}
                    onChange={event => setStreet(event.target.value)}
                />
            </div>

            <div className="input-separator">
                <NumberFormat
                    required
                    id="number"
                    value={number}
                    onChange={event => setNumber(event.target.value)}
                    placeholder="Número"
                    mask="_"
                />
            </div>

            <div className="input-separator">
                <TextField
                    fullWidth
                    id="complement"
                    label="Complemento"
                    variant="outlined"
                    value={complement}
                    onChange={event => setComplement(event.target.value)}
                />
            </div>

            <div className="input-separator">
                <TextField
                    fullWidth
                    required
                    id="district"
                    label="Bairro"
                    variant="outlined"
                    value={district}
                    onChange={event => setDistrict(event.target.value)}
                />
            </div>

            <div className="input-separator">
                <TextField
                    fullWidth
                    required
                    id="state"
                    label="Estado"
                    variant="outlined"
                    value={state}
                    onChange={event => setState(event.target.value)}
                />
            </div>

            <div className="input-separator">
                <TextField
                    fullWidth
                    required
                    id="city"
                    label="Cidade"
                    variant="outlined"
                    value={city}
                    onChange={event => setCity(event.target.value)}
                />
            </div>

            {
                showSubmit
                    ? <Button type="submit" variant="contained" color="primary"> Salvar </Button>
                    : null
            }
        </form>
    )
}