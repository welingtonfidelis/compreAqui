import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchQuery } from 'react-relay';
import environment from '../../services/RelayEnvironment';
import { Button } from '@material-ui/core';

import Load from '../../components/Load';

import swal from '../../services/SweetAlert';

import './styles.scss';

const graphql = require('babel-plugin-relay/macro');

export default function Login({ history }) {
    const ImageLogo = `${process.env.PUBLIC_URL}/logo.png`;
    const [user, setUser] = useState('');
    const [password, setpassWord] = useState('');
    const [errorLogin, setErrorLogin] = useState(false);
    const [loading, setLoading] = useState(false);    

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const query = graphql`
            query LoginsessionSignQuery($user: String!, $password: String!) {
                sessionSign(user: $user, password: $password) {
                    name
                    token
                    typeUser
                    typeUserEncript
                    photoUrl
                }
            }`;

            const variables = {
                user, password
            };

            const response = await fetchQuery(environment, query, variables);

            if (response.sessionSign) {
                const { name, token, typeUserEncript, typeUser, photoUrl } = response.sessionSign;
                localStorage.setItem('compreAqui@name', name);
                localStorage.setItem('compreAqui@token', token);
                localStorage.setItem('compreAqui@photoUrl', photoUrl);
                localStorage.setItem('compreAqui@typeUser', typeUserEncript);

                if (typeUser === 'comercial') {
                    history.push('/main/dashboardComercial');
                    return;
                }
                else swal.swalInform(
                    'Querido cliente', 
                    'Nosso sistema ainda está em construção. Por favor, ' + 
                    'use nosso aplicativo até que tenhamos finalizado o perfil ' + 
                    'de CLIENTE nesta plataforma.',
                    'info');
            }
            else {
                setErrorLogin(true);
            }


        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    }

    return (
        <div className="body-login">
            <div className="container-login">
                <div className="content-login" id="box-login">
                    <Load loading={loading} />
                    <img className="logo-login" src={ImageLogo} alt="Logo" />

                    <p>
                        Por favor, insira seu <strong>usuário</strong> e <strong>senha</strong> abaixo.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="user">Usuário</label>
                        <input
                            required
                            type="text"
                            id="user"
                            placeholder="seu usuário"
                            value={user}
                            onChange={event => setUser(event.target.value)}
                        />
                        <label htmlFor="password">Senha</label>
                        <input
                            required
                            autoComplete="on"
                            type="password"
                            id="password"
                            placeholder="*******"
                            value={password}
                            onChange={event => setpassWord(event.target.value)}
                        />

                        <Button type="submit" variant="contained" color="primary"> Entrar </Button>

                        {errorLogin ?
                            <span
                                className="invalid-login"
                                title="Por favor, vefique seus dados e tente novamente.">
                                Usuário ou senha inválidos
                        </span>
                            : ''
                        }
                    </form>

                    <div className="back-link">
                        <Link to='#'>Esqueci minha senha</Link>
                    </div>

                    <div className="new-user-link">
                        <Link to='/newUser'>Cadastre-se</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}