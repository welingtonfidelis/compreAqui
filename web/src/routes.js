import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../src/services/auth';

import Login from './pages/Login';
import NewUser from './pages/NewUser';
import Main from './components/Main/Main';

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route { ... rest } render={props => (
        isAuthenticated() ? (
            <Component { ... props} />
        ) : (
            <Redirect to={{pathname: '/', state: { from: props.location }}} />
        )
    )}/>
)

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/newUser" exact component={NewUser} />
                <PrivateRoute path="/main" component={Main} />

            </Switch>
        </BrowserRouter>
    )
}