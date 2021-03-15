import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { HiPlusCircle } from 'react-icons/hi';
import axios from 'axios';
import YearsRange from './YearsRange';

function Main() {
  const [form, setForm] = useState({
    url:
      'https://www.cmjornal.pt/politica/detalhe/andre-ventura-avisa-psd-que-chega-nao-sera-o-cds-do-seculo-xxi',
  });

  const [score, setScore] = useState('');
  const [magnitude, setMagnitude] = useState('');
  const [year, setYear] = useState(2010);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    axios.get('/time').then((res) => {
      setCurrentTime(res.data.time);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    axios.post('/analyse', form).then((res) => {
      console.log(res);
      setScore(res.data.score);
      setMagnitude(res.data.magnitude);
    });
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
              name="url"
              id="source-url"
              className="entity-name"
              placeholder="Write your entity in here"
              value={form.url}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup id="years-range-group">
            <Label for="years-range">Years to Analyse</Label>
            <YearsRange />
          </FormGroup>
          <Button id="search-button" onClick={handleSubmit}>
            Confirm
          </Button>
        </Form>
      </div>
      <div id="output" className="main-card">
        <div className="card-header">
          <h4 className="card-title">Sentiment Analysis</h4>
        </div>
        <p>Score: {score}</p>
        <p>Magnitude: {magnitude}</p>
      </div>
    </div>
  );
}

export default Main;
