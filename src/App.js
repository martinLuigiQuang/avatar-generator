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

  const postData = async (requestParams) => {
    console.log(JSON.stringify(requestParams))
    const payload = { html: requestParams };
    const headers = {
      auth: {
        username: '6cd82c97-fdae-4c6f-a169-f08a3b0d65ad',
        password: '1db2ceaa-852f-4204-9488-0ac37cb88ca6',
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // try {
    //   const response = await axios.post('https://hcti.io/v1/image', JSON.stringify(payload), headers);
    //   setPngImageUrl(response.data.url);
    // } catch (error) {
    //   console.log(error);
    // }
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
    // if (!firstName || !lastName || !superheroName) {
    //   return null;
    // }
    postData(imageUrl); 
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
              firstName={firstName}
              lastName={lastName}
              superheroName={superheroName}
              language={language}
              pngImage={pngImageUrl}
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
