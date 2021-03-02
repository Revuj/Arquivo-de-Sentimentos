import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';

function Main() {
  const [form, setForm] = useState({
    url:
      'https://www.cmjornal.pt/politica/detalhe/andre-ventura-avisa-psd-que-chega-nao-sera-o-cds-do-seculo-xxi',
  });

  const [score, setScore] = useState('');
  const [magnitude, setMagnitude] = useState('');

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
      <p>The curdawdawrent time is {currentTime}.</p>
      <Form>
        <FormGroup>
          <Label for="source-url">
            <h3>Insert your source here!</h3>
          </Label>
          <Input
            type="text"
            name="url"
            id="source-url"
            placeholder="..."
            value={form.url}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>Sentiment Analysis</Button>
      </Form>
      <div id="output">
        <h5>Output</h5>
        <p>Score: {score}</p>
        <p>Magnitude: {magnitude}</p>
      </div>
    </div>
  );
}

export default Main;
