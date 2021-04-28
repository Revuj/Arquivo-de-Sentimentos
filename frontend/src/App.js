import React, { useState, Suspense } from 'react';
import './styles/App.css';
import Main from './components/Main';
import Navbar from './components/Navbar';
import About from './components/About';

function App({ t }) {
  const [tab, setTab] = useState('explore');

  return (
    <Suspense>
      <div className="App">
        <Navbar setTab={setTab} tab={tab} />
        {tab === 'explore' && <Main />}
        {tab === 'about' && <About />}
      </div>
    </Suspense>
  );
}

export default App;
