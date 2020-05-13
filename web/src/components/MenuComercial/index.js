import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
    AppBar, CssBaseline, Divider, Drawer, Hidden, IconButton,
    List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography
} from '@material-ui/core';
import {
    Dashboard, Person, Menu as MenuIcon,
    Storefront, LocalOffer, AspectRatio
} from '@material-ui/icons';

import Swal from '../../services/SweetAlert';

import './styles.scss';
import logo from '../../assets/images/logo.png';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        }
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function Menu({ container, page }) {
    const [userPhoto, setUserPhoto] = useState(`${process.env.PUBLIC_URL}/user.png`);
    const userName = localStorage.getItem('compreAqui@name');
    const [component, setComponent] = useState('');
    const [titleToolbar, setTitleToolbar] = useState();
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const history = useHistory();
    const menuOptions = [
        { text: 'Dashboard', icon: < Dashboard /> }, { text: 'Pedidos', icon: <Person /> },
        { text: 'Produtos', icon: <Storefront /> }, { text: 'Marcas', icon: <LocalOffer /> },
        { text: 'Tamanhos', icon: <AspectRatio /> },
    ];
    
    async function exit() {
        if (await Swal.swalConfirm('Sair do sistema', 'Deseja realmente sair do sistema?')) {
            localStorage.clear();
            history.push('/');

            Swal.swalInform('Até breve.', '');
        }
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const selected = page.split('/');
        setComponent(selected[selected.length - 1]);

        if(localStorage.getItem('compreAqui@photoUrl') !== 'null'){
            setUserPhoto(localStorage.getItem('compreAqui@photoUrl'));
        }
    }, []);

    useEffect(() => {
        setTitleToolbar(component);

        switch (component) {
            case 'Dashboard':
            case 'dashboard':
                setTitleToolbar('Dashboard');
                history.push('/main/dashboardComercial');
                break;

            case 'Produtos':
            case 'products':
            case 'modalProducts':
                setTitleToolbar('Produtos');
                history.push('/main/products');
                break;

            case 'Pedidos':
            case 'requests':
            case 'modalRequests':
                setTitleToolbar('Pedidos');
                history.push('/main/requests');
                break;

            case 'Marcas':
            case 'brands':
            case 'modalBrands':
                setTitleToolbar('Marcas');
                history.push('/main/brands');
                break;
                
            case 'Tamanhos':
            case 'sizes':
            case 'modalSizes':
                setTitleToolbar('Tamanhos');
                history.push('/main/sizes');
                break;

            default:
                break;
        }
    }, [component])

    const drawer = (
        <div className="content-menu">
            <header id="hdr">
                <div id="logo">
                    <img src={logo} alt="Logo do sistema"/>
                </div>
            </header>
            <Divider />
            <List className="content-list">
                {menuOptions.map((el, index) => (
                    <ListItem
                        button key={index}
                        selected={el.text === titleToolbar}
                        onClick={() => {
                            setComponent(el.text);
                        }}
                    >
                        <ListItemIcon
                            style={{ color: el.text === titleToolbar ? '#0e78fa' : '' }}
                        >
                            {el.icon}
                        </ListItemIcon>
                        <ListItemText primary={el.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />

            <footer>
                <div className="content-footer">
                    <div id="image-profile">
                        <img
                            src={userPhoto}
                            alt="Foto perfil"
                        />
                        {/* <ModalEditProfile /> */}
                        <div id="name-profile">
                            {userName}
                        </div>
                    </div>

                    <div id="exit-profile">
                        <button id="mini-button-1" onClick={() => exit()}>SAIR</button>
                    </div>
                </div>
            </footer>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="primary"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon style={{ color: "#fff" }} />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {titleToolbar}
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
}

Menu.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
};

export default Menu;