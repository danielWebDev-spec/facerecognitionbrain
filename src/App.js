import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from "./components/Logo/Logo";
import Rank from './components/Rank/Rank';
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import './App.css';

import Clarifai from 'clarifai';

import Particles from "react-particles-js";

const app = new Clarifai.App({
  apiKey: "c076f81521a64d8caa08aeddaedf880f"
});

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

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: new Date()
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: 0,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputImage');
     const width = Number(image.width);
     const height = Number(image.height);
     return {
       leftCol: clarifaiFace.left_col * width,
       topRow: clarifaiFace.top_row * height,
       rightCol: width - (clarifaiFace.right_col * width),
       bottomRow: height - (clarifaiFace.bottom_row * height)
     }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box})
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log('not working'));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    }
    else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render(){
    const { isSignedIn, imageUrl, box, route, user} = this.state;
    const { onRouteChange, onInputChange, onButtonSubmit, loadUser } = this;

    return (
      <div className="App">
        <Particles
          className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
        { route === 'home' ?
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm 
            onInputChange = { onInputChange }
            onButtonSubmit = { onButtonSubmit }
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div> : 
          ( route === 'signin'
            ? <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />
            : <Register  loadUser={loadUser} onRouteChange={onRouteChange} />   
          )
        }      
      </div>
    );
  }
}

export default App;
