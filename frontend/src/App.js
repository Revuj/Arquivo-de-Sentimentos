import React, { useState, Suspense } from 'react';
import './styles/App.css';
import Main from './components/Main';
import Navbar from './components/Navbar';
import About from './components/About';
import ExamplesModal from './components/ExamplesModal';

function App({ t }) {
  const [tab, setTab] = useState('explore');
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [examples, setExamples] = useState([]);

  return (
    <Suspense>
      <div className="App">
        <Navbar
          setTab={setTab}
          tab={tab}
          setShowExamplesModal={setShowExamplesModal}
        />
        {tab === 'explore' && (
          <Main examples={examples} setExamples={setExamples} />
        )}
        {tab === 'about' && <About />}
        {showExamplesModal && (
          <ExamplesModal
            setShowModal={setShowExamplesModal}
            setExamples={setExamples}
            setTab={setTab}
          />
        )}
      </div>
    </Suspense>
  );
}

export default App;
