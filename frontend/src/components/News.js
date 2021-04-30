import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { ImNewspaper } from 'react-icons/im';
import '../styles/News.css';

const News = ({ t }) => {
  const [hidden, setHidden] = useState(true);

  return (
    <>
      <div id="news-column-container" className={hidden ? 'hidden' : ''}>
        <div id="news-column">
          <ul id="news-list">
            <li className="news-item">
              <span className="news-source">Publico</span>
              <h5 className="news-title">Nice News Tile</h5>
              <p className="news-description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum
                obcaecati quasi illum harum aliquam.
              </p>
              <img
                className="news-image"
                src="https://imagens.publico.pt/imagens.aspx/1578726?tp=UH&db=IMAGENS&type=JPG&share=1&o=BarraFacebook_Publico.png"
              />
            </li>
            <li className="news-item">
              <span className="news-source">Publico</span>
              <h5 className="news-title">Nice News Tile</h5>
              <p className="news-description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum
                obcaecati quasi illum harum aliquam.
              </p>
              <img
                className="news-image"
                src="https://imagens.publico.pt/imagens.aspx/1578726?tp=UH&db=IMAGENS&type=JPG&share=1&o=BarraFacebook_Publico.png"
              />
            </li>
            <li className="news-item">
              <span className="news-source">Publico</span>
              <h5 className="news-title">Nice News Tile</h5>
              <p className="news-description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum
                obcaecati quasi illum harum aliquam.
              </p>
              <img
                className="news-image"
                src="https://imagens.publico.pt/imagens.aspx/1578726?tp=UH&db=IMAGENS&type=JPG&share=1&o=BarraFacebook_Publico.png"
              />
            </li>
            <li className="news-item">
              <span className="news-source">Publico</span>
              <h5 className="news-title">Nice News Tile</h5>
              <p className="news-description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum
                obcaecati quasi illum harum aliquam.
              </p>
              <img
                className="news-image"
                src="https://imagens.publico.pt/imagens.aspx/1578726?tp=UH&db=IMAGENS&type=JPG&share=1&o=BarraFacebook_Publico.png"
              />
            </li>
          </ul>
        </div>
      </div>
      {!hidden && (
        <Button
          type="button"
          className="example-button"
          id="hide-news-button"
          onClick={() => setHidden(!hidden)}
        >
          {t('hide')}
        </Button>
      )}
      {hidden && (
        <Button
          type="button"
          className="example-button"
          id="show-news-button"
          onClick={() => setHidden(!hidden)}
        >
          <ImNewspaper size={30} />
        </Button>
      )}
    </>
  );
};

export default withTranslation()(News);
