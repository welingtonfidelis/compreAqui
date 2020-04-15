import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchQuery } from 'react-relay';
import environment from '../../services/RelayEnvironment';
import Load from '../../components/Load';

import './styles.scss';

const graphql = require('babel-plugin-relay/macro');

export default function Login() {
    const ImageLogo = `${process.env.PUBLIC_URL}/logo192.png`;
    const [user, setUser] = useState('');
    const [password, setpassWord] = useState('');
    const [errorLogin, setErrorLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     // async function test() {
    //     //   const query = graphql`
    //     //   query ApptestQuery {
    //     //     test
    //     //   }
    //     // `;

    //     // const variables = { };

    //     // const response = await fetchQuery(environment, query, variables);
    //     // console.log(response);

    //     // }

    //     // test();

    //     async function login() {
    //         const query = graphql`
    //         query LoginsessionSignQuery($user: String!, $password: String!) {
    //         sessionSign(user: $user, password: $password) {
    //           name
    //           token
    //           typeUser
    //         }
    //       }
    //     `;

    //         const variables = {
    //             user: 'comercial1',
    //             password: '1234'
    //         };

    //         const response = await fetchQuery(environment, query, variables);
    //         console.log(response.sessionSign);

    //     }

    //     login();

    // }, []);

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
                }
            }`;

            const variables = {
                user, password
            };

            const response = await fetchQuery(environment, query, variables);
            if(response.sessionSign) {
                console.log(response.sessionSign);

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
                            type="text"
                            id="user"
                            placeholder="seu usuário"
                            value={user}
                            onChange={event => setUser(event.target.value)}
                        />
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="*******"
                            value={password}
                            onChange={event => setpassWord(event.target.value)}
                        />

                        <button type="submit" className="btn-ok">ENTRAR</button>
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