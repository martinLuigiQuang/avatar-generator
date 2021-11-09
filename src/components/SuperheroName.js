import * as React from 'react';
import { Link } from 'react-router-dom';
import locale from '../data/locales.json';
import './SuperheroName.scss';
import Bubble from '../assets/speech_bubble_4.png';


function SuperheroName(props) {
  const { firstName, lastName, superheroName, language, saveNames } = props;

  const [currentFirstName, setCurrentFirstName] = React.useState(firstName);
  const [currentLastName, setCurrentLastName] = React.useState(lastName);
  const [currentSuperheroName, setCurrentSuperheroName] = React.useState(superheroName);
  const isNextButtonDisabled = !currentFirstName || !currentLastName || !currentSuperheroName;

  const handleClick = () => {
    saveNames(currentFirstName, currentLastName, currentSuperheroName)
  }

  return (
    <div className="superhero-name-container">
      <div>
        <img className="name-burst" src={Bubble} alt="" />
      </div>
      <div className="instructions">
        <h2>Please enter your name and superhero name</h2>
      </div>
      <label htmlFor="firstName">
        <input 
          type="text"
          id="firstName"
          value={currentFirstName}
          onChange={(e) => {setCurrentFirstName(e.target.value)}}
          placeholder={locale[language]['FIRST NAME']} 
        />
      </label>
      <label htmlFor="lastName">
        <input
          type="text"
          id="lastName"
          value={currentLastName}
          onChange={(e) => { setCurrentLastName(e.target.value) }}
          placeholder={locale[language]['LAST NAME']}
         
        />
      </label>
      <div className="aka">
        <p>AKA</p>
      </div>
      <label htmlFor="superheroName">
        <input
          type="text"
          id="superheroName"
          value={currentSuperheroName}
          onChange={(e) => { setCurrentSuperheroName(e.target.value) }}
          // placeholder={locale[language]['SUPERHERO NAME']}
          placeholder='SUPERHERO NAME'
        />
      </label>
      
      <div className="next-button">
        <Link 
          className={`${isNextButtonDisabled ? "next-disabled" : ""}`}
          to={`${isNextButtonDisabled ? "/enterName" : "/avatar" }`}
          onClick={handleClick}>{`${locale[language]['NEXT']} >`}
        </Link>
      </div> 
    </div>
  )

}
export default SuperheroName;
