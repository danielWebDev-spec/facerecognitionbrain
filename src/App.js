import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from "./components/Logo/Logo";
import Rank from './components/Rank/Rank';
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";

import './App.css';

import Particles from "react-particles-js";

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area:500
      }
    },
  }
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: ''
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value)
  }

  onButtonSubmit = () => {
    console.log('click');
  }

  render(){
    return (
      <div className="App">
        <Particles
          className='particles'
          params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange = { this.onInputChange }
          onButtonSubmit = { this.onButtonSubmit }
        />
        {/* <FaceRecognition />         */}
      </div>
    );
  }
}

export default App;
