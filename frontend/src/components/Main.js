import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { HiPlusCircle } from 'react-icons/hi';
import axios from 'axios';
import YearsRange from './YearsRange';
import SentimentChart from './SentimentChart';

const newsSources = ['Correio da Manhã', 'Jornal de Notícias', 'Público'];

function Main() {
  const [form, setForm] = useState({
    entity: 'André Ventura',
  });
  const [sentimentScores, setSentimentScores] = useState({});
  const [years, setYears] = useState([2010, 2021]);
  const [sources, setSources] = useState(new Set(newsSources));
  const [loadingSources, setLoadingSources] = useState(new Set());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const requestAnalysis = (entity, source) => {
    let params = { entity, source };
    setLoadingSources((prev) => new Set(prev.add(source)));

    axios.get('/analyse', { params }).then((res) => {
      console.log(res.data);
      setSentimentScores((prev) => ({ ...prev, ...res.data }));
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

  return (
    <div id="main-content">
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
                  <li
                    key={source}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSource(source);
                    }}
                  >
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={sources.has(source)}
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
      <div id="output" className="main-card">
        <div className="card-header">
          <h4 className="card-title">Sentiment Analysis</h4>
        </div>
        <SentimentChart
          sentimentScores={sentimentScores}
          firstYearIndex={years[0] - 2000}
          lastYearIndex={years[1] - 2000 + 1}
          sources={sources}
        />
      </div>
    </div>
  );
}

export default Main;
