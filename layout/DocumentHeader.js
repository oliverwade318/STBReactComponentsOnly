import React from "react";
import { useNavigate } from "@reach/router";
import { Navbar, NavbarBrand } from 'reactstrap';
import logoIcon from '../../logo-icon.svg';

const DocumentHeader = () => {

    const navigate = useNavigate()

    return (
        <Navbar color="light" light fixed="top" expand="md" className="app-navbar">
            <NavbarBrand onClick={() => { navigate('/dashboard') }}>
                <img src={logoIcon} className="navbar-logo" alt={process.env.REACT_APP_READABLE_NAME} />
            </NavbarBrand>
        </Navbar>
    )
};

export default DocumentHeader;
