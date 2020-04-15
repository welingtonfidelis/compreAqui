import React from 'react';
import { Route } from 'react-router-dom';

// import Menu from '../../components/Menu/Menu';

import DashboardComercial from '../../pages/DashboardComercial';

import './styles.scss';

export default function Main() {
    return (
        <div id="main">
            {/* <Menu page={window.location.href} /> */}
            <Route path="/main/dashboard" component={DashboardComercial} />

        </div>
    );
}