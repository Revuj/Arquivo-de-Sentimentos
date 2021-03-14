import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';
import '../styles/Navbar.css';
import Logo from '../assets/logo.svg';

const MainNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" id="navbar" light expand="md">
        <NavbarBrand id="brand" href="/">
          <img src={Logo} alt="Arquivo de Sentimentos Logo" />
          <span id="app-name">
            <p>Arquivo de</p>
            <p>Sentimentos</p>
          </span>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <div className="header-divider"></div>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem className="nav-item">Explore</NavItem>
            <NavItem className="nav-item">About</NavItem>
          </Nav>
          <NavItem className="nav-item">Examples</NavItem>
          <div class="header-divider"></div>
          <UncontrolledDropdown nav inNavbar id="language-dropdown">
            <DropdownToggle nav caret>
              EN
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>EN</DropdownItem>
              <DropdownItem>PT</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default MainNavbar;
