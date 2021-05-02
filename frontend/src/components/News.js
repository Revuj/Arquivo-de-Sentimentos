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

const News = ({ t, previews, sources, selectedEntity, setSelectedEntity }) => {
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
                selectedEntity &&
                previews[selectedEntity].map((preview, i) => {
                  if (sources.has(preview.website)) {
                    return (
                      <li className="news-item" key={i}>
                        <span className="news-source">{preview.site_name}</span>
                        <h5 className="news-title">
                          <a href={preview.link}>{preview.title}</a>
                        </h5>
                        <p className="news-description">
                          {preview.description}
                        </p>
                        <img className="news-image" src={preview.image} />
                      </li>
                    );
                  }
                })}
            </ul>
          </div>
          <Dropdown id="news-dropdown" isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
              {selectedEntity || t('entity')}
            </DropdownToggle>
            <DropdownMenu right>
              {previews &&
                Object.keys(previews).map((entity) => {
                  return (
                    <DropdownItem onClick={() => setSelectedEntity(entity)}>
                      {entity}
                    </DropdownItem>
                  );
                })}
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
