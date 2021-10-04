import * as React from 'react';
import Header from './components/Header';
import FacialLandmarks from './components/FacialLandmarks';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <FacialLandmarks />
    </div>
  );
}

export default App;
