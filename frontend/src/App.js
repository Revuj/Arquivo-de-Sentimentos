import './styles/App.css';
import Main from './components/Main';
import Navbar from './components/Navbar';
import {Suspense} from 'react';



function App({t}) {



  return (
    <Suspense>
    <div className="App">
      <Navbar />
      <Main />
    </div>
    </Suspense>
  );
}

export default App;
