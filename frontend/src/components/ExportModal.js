import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { HiX } from 'react-icons/hi';
import { exportCsv } from '../utils/exportCsv';

const formats = ['csv', 'pdf', 'image'];

const ExportModal = ({ setShowModal, title, data }) => {
  const [selectedFormats, setSelectedFormats] = useState(new Set());

  const handleClick = (e) => {
    if (e.target.classList.contains('backdrop')) setShowModal(false);
  };

  const toggleFormat = (format) => {
    if (selectedFormats.has(format)) {
      setSelectedFormats(
        (prev) => new Set([...prev].filter((x) => x !== format))
      );
    } else {
      setSelectedFormats((prev) => new Set(prev.add(format)));
    }
  };

  const exportPdf = () => {
    console.log('Exporting pdf');
  };

  const exportImage = () => {
    console.log('Exporting image');
  };

  const exportResults = () => {
    console.log('Exporting');
    if (selectedFormats.has('csv')) exportCsv(data, title);
    if (selectedFormats.has('pdf')) exportPdf();
    if (selectedFormats.has('image')) exportImage();
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
          <h5 className="modal-title">Export as</h5>
          <HiX
            size={25}
            className="close-modal-button"
            onClick={() => setShowModal(false)}
          />
        </div>
        <p className="modal-caption">Choose a format to export the results</p>
        <ul id="selected-sources">
          {formats.map((format) => {
            return (
              <li key={format}>
                <label className="container">
                  <input
                    type="checkbox"
                    checked={selectedFormats.has(format)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFormat(format);
                    }}
                    onChange={() => {}}
                    className="radio-source"
                  />
                  <span>{format}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <Button
          type="button"
          id="confirm-export-button"
          onClick={() => exportResults()}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ExportModal;
