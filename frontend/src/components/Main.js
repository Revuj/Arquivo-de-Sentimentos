import React, { useState, useEffect, createRef } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
} from 'react-component-export-image';
import { HiPlusCircle } from 'react-icons/hi';
import { BiDownload } from 'react-icons/bi';
import axios from 'axios';
import YearsRange from './YearsRange';
import SentimentChart from './SentimentChart';
import ExportModal from './ExportModal';

const newsSources = ['Correio da Manhã', 'Jornal de Notícias', 'Público'];

function Main() {
  const [form, setForm] = useState({
    entity: 'André Ventura',
  });
  const [sentimentScores, setSentimentScores] = useState({});
  const [magnitudeScores, setMagnitudeScores] = useState({});
  const [years, setYears] = useState([2010, 2021]);
  const [sources, setSources] = useState(new Set(newsSources));
  const [loadingSources, setLoadingSources] = useState(new Set());
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTitle, setExportTitle] = useState('');
  const [exportData, setExportData] = useState({});

  const scoreCardRef = createRef();
  const magnitudeCardRef = createRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const requestAnalysis = (entity, source) => {
    let params = { entity, source };
    setLoadingSources((prev) => new Set(prev.add(source)));

    axios.get('/analyse', { params }).then((res) => {
      console.log(res.data);
      setSentimentScores((prev) => ({ ...prev, ...res.data.sentiment }));
      setMagnitudeScores((prev) => ({ ...prev, ...res.data.magnitude }));
      setLoadingSources(
        (prev) => new Set([...prev].filter((x) => x !== source))
      );
    });
  };

  const handleSubmit = () => {
    // load first checked sources
    sources.forEach((source) => {
      requestAnalysis(form.entity, source);
    });

    // then the rest
    // commented for test purposes
    // newsSources.forEach((source) => {
    //   if (!sources.has(source)) {
    //     requestAnalysis(form.entity, source);
    //   }
    // });
  };

  const toggleSource = (source) => {
    if (sources.has(source)) {
      setSources((prev) => new Set([...prev].filter((x) => x !== source)));
    } else {
      setSources((prev) => new Set(prev.add(source)));
    }
  };

  const inputSection = () => {
    return (
      <div id="input" className="main-card">
        <div className="card-header">
          <h4 className="card-title">Search Personality</h4>
          <HiPlusCircle size={30} id="add-entity-button" />
        </div>
        <Form>
          <FormGroup>
            <Input
              type="text"
              name="entity"
              id="source-url"
              className="entity-name"
              placeholder="Write your entity in here"
              value={form.entity}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup id="years-range-group">
            <Label for="years-range">Years to Analyse</Label>
            <YearsRange values={years} setValues={setYears} />
          </FormGroup>
          <ul id="selected-sources">
            {sources &&
              newsSources.map((source) => {
                return (
                  <li key={source}>
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={sources.has(source)}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSource(source);
                        }}
                        onChange={() => {}}
                        className="radio-source"
                      />
                      <span>{source}</span>
                    </label>
                    {loadingSources.has(source) && (
                      <div className="loader"></div>
                    )}
                  </li>
                );
              })}
          </ul>
          <Button id="search-button" onClick={handleSubmit}>
            Confirm
          </Button>
        </Form>
      </div>
    );
  };

  const exportPdf = (fileName) => {
    exportComponentAsPDF('sentiment_score' ? scoreCardRef : magnitudeCardRef, {
      fileName,
      pdfOptions: { w: 760, h: 458, unit: 'pt', orientation: 'p' },
    });
  };

  const exportImage = (fileName) => {
    exportComponentAsJPEG('sentiment_score' ? scoreCardRef : magnitudeCardRef, {
      fileName: `${fileName}.jpg`,
    });
  };

  const outputSection = () => {
    return (
      <div id="output">
        <div className="main-card" ref={scoreCardRef}>
          <div className="card-header">
            <h4 className="card-title">Sentiment Score</h4>
            {!showExportModal && (
              <button
                type="button"
                className="export-button"
                onClick={() => {
                  setShowExportModal(true);
                  setExportTitle('sentiment_score');
                  setExportData(sentimentScores);
                }}
              >
                <BiDownload size={16} className="export-icon" />
                Export
              </button>
            )}
          </div>
          <SentimentChart
            sentimentScores={sentimentScores}
            firstYearIndex={years[0] - 2000}
            lastYearIndex={years[1] - 2000 + 1}
            sources={sources}
          />
        </div>
        <div className="main-card" ref={magnitudeCardRef}>
          <div className="card-header">
            <h4 className="card-title">Sentiment Magnitude</h4>
            {!showExportModal && (
              <button
                type="button"
                className="export-button"
                onClick={() => {
                  setShowExportModal(true);
                  setExportTitle('magnitude_score');
                  setExportData(magnitudeScores);
                }}
              >
                <BiDownload size={16} className="export-icon" />
                Export
              </button>
            )}
          </div>
          <SentimentChart
            sentimentScores={magnitudeScores}
            firstYearIndex={years[0] - 2000}
            lastYearIndex={years[1] - 2000 + 1}
            sources={sources}
          />
        </div>
      </div>
    );
  };

  const exportModal = () => {
    return (
      <ExportModal
        setShowModal={setShowExportModal}
        title={exportTitle}
        data={exportData}
        exportPdf={exportPdf}
        exportImage={exportImage}
      />
    );
  };

  return (
    <div id="main-content">
      {inputSection()}
      {outputSection()}
      {showExportModal && exportModal()}
    </div>
  );
}

export default Main;
