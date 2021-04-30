import React from 'react';
import { HiX } from 'react-icons/hi';
import { Button } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const exampleEntities = new Map([
  ['presidents', ['Marcelo Rebelo de Sousa', 'Cavaco Silva', 'Jorge Sampaio']],
  ['prime ministers', ['António Costa', 'Passos Coelho', 'José Sócrates']],
  ['football clubs', ['Benfica', 'Sporting', 'Futebol Clube do Porto']],
]);

const ExamplesModal = ({ t, setShowModal, setExamples, setTab }) => {
  const handleClick = (e) => {
    if (e.target.classList.contains('backdrop')) setShowModal(false);
  };

  const pickExamples = (example) => {
    setTab('explore');
    setExamples(exampleEntities.get(example));
    setShowModal(false);
  };

  return (
    <div
      className="backdrop"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <div className="modal-form main-card">
        <div className="card-header">
          <h5 className="modal-title">{t('examples_title')}</h5>
          <HiX
            size={25}
            className="close-modal-button"
            onClick={() => setShowModal(false)}
          />
        </div>
        <p className="modal-caption">{t('examples_description')}</p>
        <ul id="selected-sources">
          <Button
            type="button"
            className="example-button"
            onClick={() => pickExamples('presidents')}
          >
            {t('presidents')}
          </Button>
          <Button
            type="button"
            className="example-button"
            onClick={() => pickExamples('prime ministers')}
          >
            {t('ministers')}
          </Button>
          <Button
            type="button"
            className="example-button"
            onClick={() => pickExamples('football clubs')}
          >
            {t('football_clubs')}
          </Button>
        </ul>
      </div>
    </div>
  );
};

export default withTranslation()(ExamplesModal);
