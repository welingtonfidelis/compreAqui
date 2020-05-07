import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { AccessibleForward } from '@material-ui/icons';
import { fetchQuery } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import './styles.scss';

const graphql = require('babel-plugin-relay/macro');

export default function DashboardComercial() {
   

    return (
        <div className="App">

        <h1>Dash comercial</h1>
        <h2>teste</h2>
        OOOOI
        <Button variant="contained" color="primary">
          <AccessibleForward/>
          Hello World
        </Button>
      </div>
    )
}