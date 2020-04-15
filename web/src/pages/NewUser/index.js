import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel, Button, Typography } from '@material-ui/core';
import { Storefront, ShoppingCart } from '@material-ui/icons';

import Profile from '../../components/Profile';

import './styles.scss';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Tipo de usuário', 'Informações'];
}

export default function NewUser({ history }) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const [type, setType] = useState('');

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function MountHtml() {
        let html = null;

        switch (activeStep) {
            case 0:
                html = (
                    <div className="card-type-container">
                        <h2>Qual tipo de usuário você vai ser?</h2>

                        <div className="flex-row">
                            <div
                                className={`card-type-user ${type === 'client' ? "card-type-user-selected" : ''}`}
                                onClick={() => setType('client')}
                            >
                                <ShoppingCart className="icon-client" />
                                <span>Cliente</span>
                            </div>

                            <div
                                className={`card-type-user ${type === 'comercial' ? "card-type-user-selected" : ''}`}
                                onClick={() => setType('comercial')}
                            >
                                <Storefront className="icon-provider" />
                                <span>Empresa</span>
                            </div>
                        </div>
                    </div>
                )
                break;

            case 1:
                html = <Profile type={type} />
                break;

            default:
                break;
        }

        return html;
    }

    return (
        <div className="body-new-user">

            <div className="box-info">
                <MountHtml />
            </div>

            <div className={classes.root}>
                <div>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>All steps completed</Typography>
                            <Button onClick={handleReset}>Reset</Button>
                        </div>
                    ) : (
                            <div className="btn-steps">
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.backButton}
                                >
                                    Voltar
                                    </Button>

                                <Button 
                                    variant="contained" color="primary" 
                                    disabled={activeStep === steps.length - 1 || type === ''} 
                                    onClick={handleNext}
                                >
                                    {activeStep === steps.length - 1 ? 'Enviar' : 'Próximo'}
                                </Button>
                            </div>
                        )}
                </div>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
        </div >
    )
}