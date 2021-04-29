import React from 'react';
import { HiX } from 'react-icons/hi';
import { Button } from 'reactstrap';

const exampleEntities = new Map([
  ['presidents', ['Marcelo Rebelo de Sousa', 'Cavaco Silva', 'Jorge Sampaio']],
  ['prime ministers', ['António Costa', 'Passos Coelho', 'José Sócrates']],
  ['football clubs', ['Benfica', 'Sporting', 'Futebol Clube do Porto']],
]);

const ExamplesModal = ({ setShowModal, setExamples, setTab }) => {
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
          <h5 className="modal-title">Examples</h5>
          <HiX
            size={25}
            className="close-modal-button"
            onClick={() => setShowModal(false)}
          />
        </div>
        <p className="modal-caption">Pick an example to visualise</p>
        <ul id="selected-sources">
          <Button
            type="button"
            className="example-button"
            onClick={() => pickExamples('presidents')}
          >
            Presidentes da República
          </Button>
          <Button
            type="button"
            className="example-button"
            onClick={() => pickExamples('prime ministers')}
          >
            Primeiros Ministros
          </Button>
          <Button
            type="button"
            className="example-button"
            onClick={() => pickExamples('football clubs')}
          >
            Clubes de Futebol
          </Button>
        </ul>
      </div>
    </div>
  );
};

export default ExamplesModal;
