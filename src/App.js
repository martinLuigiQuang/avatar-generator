import * as React from 'react';
import Header from './components/Header';
import FacialLandmarks from './components/FacialLandmarks';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Header language="english"/>
      <FacialLandmarks />
    </div>
  );
}

export default App;
