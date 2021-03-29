import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { HiPlusCircle } from 'react-icons/hi';
import axios from 'axios';
import YearsRange from './YearsRange';
import SentimentChart from './SentimentChart';

const newsSources = ['Correio da Manhã', 'Jornal de Notícias'];

function Main() {
  const [form, setForm] = useState({
    entity: 'Andre Ventura',
  });
  const [sentimentScores, setSentimentScores] = useState({});
  const [years, setYears] = useState([2010, 2021]);
  const [sources, setSources] = useState(new Set(newsSources));

  const [checked, setChecked] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    axios.post('/analyse', form).then((res) => {
      setSentimentScores(res.data);
    });
  };

  const toggleSource = (source) => {
    if (sources.has(source)) {
      setSources((prev) => new Set([...prev].filter((x) => x !== source)));
    } else {
      setSources((prev) => new Set(prev.add(source)));
    }
    console.log(source);
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
