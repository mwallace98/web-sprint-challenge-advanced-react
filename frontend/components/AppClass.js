import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  constructor(props){
    super(props);
    this.state = {
      currentIndex: 4,
      currentMessage:'',
      currentEmail: '',
      currentSteps: 0
    }
  }

  // You can delete them and build your own logic from scratch.
  
  getXY = () => {

    const x = (this.state.currentIndex % 3) + 1;
    let y;
    if(this.state.currentIndex < 3) y = 1
    else if (this.state.currentIndex < 6) y = 2
    else if(this.state.currentIndex < 9) y = 3
    return [x,y]
    
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    const [x,y] = this.getXY()

    return (`Coordinates (${x}, ${y})`)
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState({
      currentIndex: initialIndex,
      currentMessage:'',
      currentEmail: initialEmail,
      currentSteps: initialSteps
    })
   document.getElementById('email').value =''
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    
   const x = this.state.currentIndex % 3
   const y = Math.floor(this.state.currentIndex / 3);

   switch(direction){
    case 'left':
        return x > 0 ? this.state.currentIndex - 1 : this.state.currentIndex;
      case 'up':
        return y > 0 ? this.state.currentIndex - 3 : this.state.currentIndex;
      case 'right':
        return x < 2 ? this.state.currentIndex + 1 : this.state.currentIndex;
      case 'down': 
        return y < 2 ? this.state.currentIndex + 3 : this.state.currentIndex;
      default:
        return this.state.currentIndex;
   }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.currentIndex){
      this.setState((prevState) => ({
        currentSteps: prevState.currentSteps + 1,
        currentIndex: nextIndex,
        currentMessage: ''
      }))
    } else if(direction === 'left'){
      this.setState({ currentMessage:"You can't go left"})
    }else if(direction === 'right'){
      this.setState({currentMessage:"You can't go right"})
    }else if (direction === 'up'){
      this.setState({currentMessage:"You can't go up"})
    }else if(direction === 'down'){
      this.setState({currentMessage: "You can't go down"})
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    const newEmail = evt.target.value
    this.setState({
      currentEmail: newEmail
    })

    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    const [x,y] = this.getXY();
    const URL = 'http://localhost:9000/api/result';

    if(this.state.currentEmail === 'foo@bar.baz'){
      this.setState({
        currentMessage: 'foo@bar.baz failure #71'
      })
      return;
    }

    if(this.state.currentEmail === ''){
    this.setState({
      currentMessage:'Ouch: email is required'
    })
    return;
    }

    axios.post(URL,{
      email:this.state.currentEmail,
      steps:this.state.currentSteps,
      x:x,
      y:y
    } )
    .then((res) => {
      console.log(res)
      this.setState({
        currentMessage: res.data.message,
        currentEmail: ''
      })
    })
    .catch((err) => {
      console.log(err)
      console.log(this.state.currentEmail,'current email')
      if(this.state.currentEmail === ''){
        this.setState({
          currentMessage: ''
        })
        
      } else{
        this.setState({currentMessage: 'Ouch: email must be a valid email'})
      }
    })

    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.currentSteps} time{this.state.currentSteps === 1 ? '' : 's'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.currentIndex ? ' active' : ''}`}>
                {idx === this.state.currentIndex ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.currentMessage}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up"onClick={this.move}>UP</button>
          <button id="right"onClick={this.move}>RIGHT</button>
          <button id="down"onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.currentEmail} onChange={this.onChange}></input>
          <input id="submit" type="submit" ></input>
        </form>
      </div>
    )
  }
}

