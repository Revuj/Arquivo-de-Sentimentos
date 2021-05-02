import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import '../styles/Navbar.css';
import Logo from '../assets/logo.svg';
import { withTranslation } from 'react-i18next';

const MainNavbar = ({ t, i18n, setTab, tab, setShowExamplesModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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
            <NavItem
              onClick={() => {
                setTab('explore');
              }}
              className={tab === 'explore' ? 'nav-item selected' : 'nav-item'}
            >
              {t('explore')}
            </NavItem>
            <NavItem
              onClick={() => {
                setTab('about');
              }}
              className={tab === 'about' ? 'nav-item selected' : 'nav-item'}
            >
              {t('about')}
            </NavItem>
          </Nav>
          <NavItem
            onClick={() => {
              setShowExamplesModal(true);
            }}
            className="nav-item"
          >
            {t('examples')}
          </NavItem>
          <div className="header-divider"></div>
          <UncontrolledDropdown nav inNavbar id="language-dropdown">
            <DropdownToggle nav caret>
              {t('language')}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                onClick={() => {
                  changeLanguage('pt');
                }}
              >
                PT
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  changeLanguage('en');
                }}
              >
                EN
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default withTranslation()(MainNavbar);
