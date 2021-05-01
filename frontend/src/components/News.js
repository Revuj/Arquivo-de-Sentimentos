import React, { useState, useEffect } from 'react';
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { ImNewspaper } from 'react-icons/im';
import '../styles/News.css';

const News = ({ t, previews }) => {
  const [hidden, setHidden] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    previews && (
      <>
        <div id="news-column-container" className={hidden ? 'hidden' : ''}>
          <div id="news-column">
            <ul id="news-list">
              {previews &&
                [...previews.previews].map((preview) => {
                  return (
                    <li className="news-item">
                      <span className="news-source">{preview.site_name}</span>
                      <h5 className="news-title">{preview.title}</h5>
                      <p className="news-description">{preview.description}</p>
                      <img className="news-image" src={preview.image} />
                    </li>
                  );
                })}
            </ul>
          </div>
          <Dropdown id="news-dropdown" isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>{t('entity')}</DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>pénis</DropdownItem>
              <DropdownItem>vagina</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Button
          type="button"
          className={!hidden ? 'open example-button' : 'example-button'}
          id="show-news-button"
          onClick={() => setHidden(!hidden)}
        >
          <ImNewspaper size={30} />
        </Button>
      </>
    )
  );
};

export default withTranslation()(News);
