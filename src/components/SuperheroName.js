import * as React from 'react';
import { Link } from 'react-router-dom';
import Locales from '../data/locales.json';
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
        <h2>{Locales[language]["PLEASE ENTER YOUR NAME AND SUPERHERO IDENTITY PREVIOUSLY CREATED"]}</h2>
      </div>
      <label htmlFor="firstName">
        <input 
          type="text"
          id="firstName"
          value={currentFirstName}
          onChange={(e) => {setCurrentFirstName(e.target.value)}}
          placeholder={Locales[language]['FIRST NAME']} 
        />
      </label>
      <label htmlFor="lastName">
        <input
          type="text"
          id="lastName"
          value={currentLastName}
          onChange={(e) => { setCurrentLastName(e.target.value) }}
          placeholder={Locales[language]['LAST NAME']}
         
        />
      </label>
      <label htmlFor="superheroName">
        <input
          type="text"
          id="superheroName"
          value={currentSuperheroName}
          onChange={(e) => { setCurrentSuperheroName(e.target.value) }}
          placeholder={Locales[language]['SUPERHERO NAME']}
        />
      </label>
      
      <div className="next-button">
        <Link 
          className={`${isNextButtonDisabled ? "next-disabled" : ""}`}
          to={`${isNextButtonDisabled ? "/enterName" : "/avatar" }`}
          onClick={handleClick}>{`${Locales[language]['NEXT']} >`}
        </Link>
      </div> 
    </div>
  )

}
export default SuperheroName;
