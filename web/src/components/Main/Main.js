import React from 'react';
import { Route } from 'react-router-dom';

import MenuComercial from '../MenuComercial';

import DashboardComercial from '../../pages/DashboardComercial';
import DashboardClient from '../../pages/DashboardClient';
import Products from '../../pages/Products';
import Requests from '../../pages/Requests';

import { isComercial } from '../../services/auth';

import './styles.scss';

export default function Main() {
    
    return (
        <div id="main">
            {isComercial() ? <MenuComercial page={window.location.href} /> : null}
            <Route path="/main/dashboardComercial" component={DashboardComercial} />
            <Route path="/main/dashboardClient" component={DashboardClient} />
            <Route path="/main/products" component={Products} />
            <Route path="/main/requests" component={Requests} />
        </div>
    );
}