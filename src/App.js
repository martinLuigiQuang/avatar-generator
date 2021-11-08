import * as React from 'react';
import Header from './components/Header';
import LanguageSelector from './components/Languages';
import FacialLandmarks from './components/FacialLandmarks';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';

function App() {
  const [language, setLanguage] = React.useState('english');

  const handleLanguageSelector = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Header language="english" />
        <Routes>
          <Route exact path="/" element={
            <LanguageSelector
              language={language}
              handleLanguageSelector={handleLanguageSelector}
            />
          }/> 
          <Route exact path="/avatar" element={
            <FacialLandmarks />
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
