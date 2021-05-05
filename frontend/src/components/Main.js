import React, { useState, useEffect, createRef } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
} from 'react-component-export-image';
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import { BiDownload, BiInfoCircle } from 'react-icons/bi';
import axios from 'axios';
import YearsRange from './YearsRange';
import SentimentChart from './SentimentChart';
import ExportModal from './ExportModal';
import { withTranslation } from 'react-i18next';
import News from './News';
import { Set } from 'immutable';

const newsSources = ['Correio da Manhã', 'Jornal de Notícias', 'Público'];

function Main({ t, examples, setExamples }) {
  const [form, setForm] = useState({
    entities: ['André Ventura'],
  });
  const [sentimentScores, setSentimentScores] = useState({});
  const [magnitudeScores, setMagnitudeScores] = useState({});
  const [previews, setPreviews] = useState(null);
  const [years, setYears] = useState([2010, 2021]);
  const [sources, setSources] = useState(new Set(newsSources));
  const [loadingSources, setLoadingSources] = useState({
    'Correio da Manhã': 0,
    'Jornal de Notícias': 0,
    'Público': 0,
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTitle, setExportTitle] = useState('');
  const [exportData, setExportData] = useState({});
  const [showToolTip, setShowToolTip] = useState(true);

  const [queryEntities, setQueryEntities] = useState(new Set());

  const [selectedEntity, setSelectedEntity] = useState(null);

  const scoreCardRef = createRef();
  const magnitudeCardRef = createRef();

  useEffect(() => {
    if (examples.length > 0) {
      clearOutputs();
      setForm({ ...form, entities: examples });
    }
  }, [examples]);

  useEffect(() => {
    if (
      examples.length > 0 &&
      JSON.stringify(examples) == JSON.stringify(form.entities)
    ) {
      handleSubmit();
      setExamples([]);
    }
  }, [form]);

  const handleChange = (e, i) => {
    setForm({
      entities: form.entities.map((el, elI) =>
        elI === i ? e.target.value : el
      ),
    });
  };

  const handleAdd = () => {
    setForm({
      entities: form.entities.concat(''),
    });
  };

  const handleRemove = (i) => {
    if (form.entities.length <= 1) return;
    setQueryEntities(
      new Set([...form.entities.filter((el, elI) => elI !== i)])
    );
    setForm({
      entities: form.entities.filter((el, elI) => elI !== i),
    });
  };

  const requestNews = (entity, source) => {
    axios
      .get(`${process.env.REACT_APP_PROXY}/previews`, {
        params: { entity, source },
      })
      .then((res) => {
        setPreviews((prev) => {
          let current = Object.assign({}, prev);
          if (!current) {
            current = {};
            current[entity] = new Set();
          } else if (entity in current) {
            current[entity] = new Set([
              ...current[entity],
              ...res.data.previews,
            ]);
          } else {
            current[entity] = new Set([...res.data.previews]);
          }
          return current;
        });
        setSelectedEntity((curEntity) => {
          if (!curEntity) return entity;
          return curEntity;
        });
      });
  };

  const requestAnalysis = (entity, source) => {
    let params = { entity, source };
    setLoadingSources((prev) => {
      let current = Object.assign({}, prev);
      current[source] += 1;
      return current;
    });

    axios
      .get(`${process.env.REACT_APP_PROXY}/results`, { params })
      .then((res) => {
        if (res.data.status == 'ON_CACHE') {

          setSentimentScores((current) => {
            let st = { ...current };
            let st_en = { ...st[entity] };
            st_en[source] = res.data.content.sentiment[source];
            st[entity] = st_en;
  
            return st;
          });
  
          setMagnitudeScores((current) => {
            let st = { ...current };
            let st_en = { ...st[entity] };
            st_en[source] = res.data.content.magnitude[source];
            st[entity] = st_en;
            return st;
          });
  
          setLoadingSources((prev) => {
            let current = Object.assign({}, prev);
            current[source] -= 1;
            return current;
          });
          requestNews(entity, source);
        } else if (res.data.status == 'NOT_ON_CACHE'){
          console.log("NOT ON CACHE")
        }
      });
  };

  const clearOutputs = () => {
    setSentimentScores({});
    setMagnitudeScores({});
    setPreviews((cur) => {
      return null;
    });
    setSelectedEntity(null);
    setLoadingSources({
      'Correio da Manhã': 0,
      'Jornal de Notícias': 0,
      'Público': 0,
    });
  };

  const handleSubmit = () => {
    clearOutputs();
    setQueryEntities(new Set([...form.entities]));

    form.entities.forEach((entity) => {
      sources.forEach((source) => {
        requestAnalysis(entity, source);
      });
    });
  };

  const toggleSource = (source) => {
    if (sources.has(source)) {
      setSources((prev) => new Set([...prev].filter((x) => x !== source)));
    } else {
      setSources((prev) => new Set(prev.add(source)));
    }
  };

  const exportPdf = (fileName) => {
    exportComponentAsPDF(
      exportTitle === 'sentiment_score' ? scoreCardRef : magnitudeCardRef,
      {
        fileName,
        pdfOptions: { w: 760, h: 458, unit: 'pt', orientation: 'p' },
      }
    );
  };

  const exportImage = (fileName) => {
    exportComponentAsJPEG(
      exportTitle === 'sentiment_score' ? scoreCardRef : magnitudeCardRef,
      {
        fileName: `${fileName}.jpg`,
      }
    );
  };

  const entitiesInput = () => {
    const entitiesElements = [];
    form.entities.forEach((value, i) => {
      entitiesElements.push(
        <div className="d-flex" key={i}>
          <Input
            type="text"
            name="entity"
            className="entity-name"
            placeholder="Write your entity in here"
            value={value}
            onChange={(e) => {
              handleChange(e, i);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <HiMinusCircle
            size={30}
            id="minus-entity-button"
            className={form.entities.length === 1 ? 'disabled' : ''}
            onClick={() => {
              handleRemove(i);
            }}
          />
        </div>
      );
    });
    return entitiesElements;
  };

  const inputSection = () => {
    return (
      <div id="input" className="main-card">
        <div className="card-header">
          <h4 className="card-title">{t('search_personality')}</h4>
          <HiPlusCircle size={30} id="add-entity-button" onClick={handleAdd} />
        </div>
        <Form>
          <FormGroup>{entitiesInput()}</FormGroup>
          <FormGroup id="years-range-group">
            <Label for="years-range">{t('year_analyse')}</Label>
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
                    {loadingSources[source] > 0 && (
                      <div className="loader"></div>
                    )}
                  </li>
                );
              })}
          </ul>
          <Button id="search-button" onClick={handleSubmit}>
            {t('confirm')}
          </Button>
        </Form>
      </div>
    );
  };

  const sentimentScore = () => {
    return (
      <div className="main-card" ref={scoreCardRef}>
        <div className="card-header">
          <span className="card-title-container">
            <h4 className="card-title">{t('sentiment_score')}</h4>
            <span
              className="tooltip-container"
              onMouseEnter={() => setShowToolTip('score')}
              onMouseLeave={() => setShowToolTip(false)}
            >
              <BiInfoCircle size={20} className="tooltip-icon" />
              <span
                className="tooltip-text"
                style={{
                  visibility: showToolTip === 'score' ? 'visible' : 'hidden',
                }}
              >
                <p>
                  <strong>{t('sentiment_card_score')}</strong>{' '}
                  {t('sentiment_card_part1')}{' '}
                  <strong>{t('sentiment_card_strong')}</strong>{' '}
                  {t('sentiment_card_part2')}.
                </p>
                <p
                  className="gotit"
                  onClick={() => {
                    setShowToolTip(false);
                  }}
                >
                  {t('got_it')}
                </p>
              </span>
            </span>
          </span>
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
              {t('export')}
            </button>
          )}
        </div>
        <SentimentChart
          sentimentScores={sentimentScores}
          firstYearIndex={years[0] - 2000}
          lastYearIndex={years[1] - 2000 + 1}
          sources={sources}
          entities={queryEntities}
          groupSources={queryEntities.size > 1}
        />
      </div>
    );
  };

  const sentimentMagnitude = () => {
    return (
      <div className="main-card" ref={magnitudeCardRef}>
        <div className="card-header">
          <span className="card-title-container">
            <h4 className="card-title">{t('sentiment_magnitude')}</h4>
            <span
              className="tooltip-container"
              onMouseEnter={() => setShowToolTip('magnitude')}
              onMouseLeave={() => setShowToolTip(false)}
            >
              <BiInfoCircle size={20} className="tooltip-icon" />
              <span
                className="tooltip-text"
                style={{
                  visibility:
                    showToolTip === 'magnitude' ? 'visible' : 'hidden',
                }}
              >
                <p>
                  <strong>{t('magnitude_card_magnitude')}</strong>{' '}
                  {t('magnitude_card_part1')}{' '}
                  <strong>{t('magnitude_card_strong')}</strong>{' '}
                  {t('magnitude_card_part2')}.
                </p>
                <p
                  className="gotit"
                  onClick={() => {
                    setShowToolTip(false);
                  }}
                >
                  {t('got_it')}
                </p>
              </span>
            </span>
          </span>
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
              {t('export')}
            </button>
          )}
        </div>
        <SentimentChart
          sentimentScores={magnitudeScores}
          firstYearIndex={years[0] - 2000}
          lastYearIndex={years[1] - 2000 + 1}
          sources={sources}
          entities={queryEntities}
          groupSources={queryEntities.size > 1}
        />
      </div>
    );
  };

  const outputSection = () => {
    return (
      <div id="output">
        {sentimentScore()}
        {sentimentMagnitude()}
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
    <div id="main-content-container">
      <div id="main-content">
        {inputSection()}
        {outputSection()}
        {showExportModal && exportModal()}
      </div>
      <News
        previews={previews}
        sources={sources}
        selectedEntity={selectedEntity}
        setSelectedEntity={setSelectedEntity}
      />
    </div>
  );
}

export default withTranslation()(Main);
