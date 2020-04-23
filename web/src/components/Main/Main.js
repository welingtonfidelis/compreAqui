import React from 'react';
import { Route } from 'react-router-dom';

import MenuComercial from '../MenuComercial';

import DashboardComercial from '../../pages/DashboardComercial';
import DashboardClient from '../../pages/DashboardClient';

import { isComercial } from '../../services/auth';

import './styles.scss';

export default function Main() {
    return (
        <div id="main">
            {isComercial() ? <MenuComercial page={window.location.href} /> : null}
            <Route path="/main/dashboardComercial" component={DashboardComercial} />
            <Route path="/main/dashboardClient" component={DashboardClient} />
        </div>
    );
}