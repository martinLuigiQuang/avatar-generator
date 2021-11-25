import * as React from 'react';
import Header from './components/Header';
import LanguageSelector from './components/Languages';
import SuperheroName from './components/SuperheroName';
import FacialLandmarks from './components/FacialLandmarks';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';

function App() {
  const [language, setLanguage] = React.useState('english');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [superheroName, setSuperheroName] = React.useState('');

  
  const handleLanguageSelector = (e) => {
    setLanguage(e.target.value);
  };

  const saveNames = (firstName, lastName, superheroName) => {
    setFirstName(firstName.toUpperCase());
    setLastName(lastName.toUpperCase());
    setSuperheroName(superheroName.toUpperCase());
  }

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Header language={language}/>
        <Routes>
          <Route exact path="/" element={
            <LanguageSelector
              language={language}
              handleLanguageSelector={handleLanguageSelector}
            />
          }/> 
          <Route exact path='/enterName' element={
            <SuperheroName
              firstName={firstName}
              lastName={lastName}
              superheroName={superheroName}
              language={language}
              saveNames={saveNames}
            />
          }/>
          <Route exact path="/avatar" element={
            <FacialLandmarks 
              firstName={firstName}
              lastName={lastName}
              superheroName={superheroName}
              language={language}
            />
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
