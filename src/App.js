import * as React from 'react';
import axios from 'axios';
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
  const [pngImageUrl, setPngImageUrl] = React.useState('');
  const [isImageDownloaded, setIsImageDownloaded] = React.useState(false);

  React.useEffect(
    () => {
      if (isImageDownloaded) {
        deletePngImage()
      }
    },
    [isImageDownloaded]
  );

  const postData = (requestParams) => {
    axios({
      url: `https://hcti.io/v1/image?${requestParams}`,
      method: 'POST'
    })
    .then(response => {
      if (response && !response.error && response.url) {
        setPngImageUrl(response.url)
      } else {
        console.log(response);
      }
    })
    .catch(error => console.log(error));
  };

  const deletePngImage = () => {
    axios({
      url: pngImageUrl,
      method: 'DELETE'
    }).catch(error => console.log(error));
  };

  const handleLanguageSelector = (e) => {
    setLanguage(e.target.value);
  };

  const saveNames = (firstName, lastName, superheroName) => {
    setFirstName(firstName.toUpperCase());
    setLastName(lastName.toUpperCase());
    setSuperheroName(superheroName.toUpperCase());
  }
  
  const handleCreateImage = (imageUrl) => {
    if (!firstName || !lastName || !superheroName) {
      return null;
    }
    const requestParams = `url=${imageUrl}`;
    postData(requestParams); 
  };

  const handleDownload = () => {
    setIsImageDownloaded(true)
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Header language={language} />
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
              language={language}
              downloadImage={pngImageUrl}
              isImageDownloaded={isImageDownloaded}
              handleCreateImage={handleCreateImage}
              handleDownload={handleDownload}
            />
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
