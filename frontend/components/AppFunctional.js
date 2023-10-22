import React from 'react'
import { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at



export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
const [steps,setSteps] = useState(0)
const [email,setEmail] = useState('')
const [currentIndex,setCurrentIndex] = useState(4)
const [initialMessage,setInitialMessage] = useState('')


  function getXY() {
    const x = (currentIndex % 3) + 1
    let y
    if(currentIndex < 3) y = 1
    else if (currentIndex < 6) y = 2
    else if(currentIndex < 9) y = 3

    return [x,y]
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    const [x,y] = getXY()

    return `Coordinates (${x}, ${y})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    setSteps(initialSteps)
    setEmail(initialEmail)
    setCurrentIndex(initialIndex)
    setInitialMessage('')
    
    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
      
    const x = currentIndex % 3;
    const y =Math.floor(currentIndex / 3);

    switch(direction){
      case 'left':
        return x > 0 ? currentIndex - 1 : currentIndex;
        case 'up':
          return y > 0 ? currentIndex - 3 : currentIndex;
        case'right':
          return x < 2 ? currentIndex + 1 : currentIndex;
        case 'down':
          return y < 2 ? currentIndex + 3 : currentIndex;
        default:
          return currentIndex
    }
    
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

  }

  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    if (nextIndex !== currentIndex){
      setSteps(steps + 1);
      setCurrentIndex(nextIndex);
      setInitialMessage('')
    } else if(direction === 'left'){
      setInitialMessage("You can't go left")
    }else if(direction === 'right'){
      setInitialMessage("You can't go right")
    }else if (direction === 'up'){
      setInitialMessage("You can't go up")
    }else if(direction === 'down'){
      setInitialMessage("You can't go down")
    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    const newEmail = evt.target.value
    setEmail(newEmail)
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault();
    reset();
    const [x,y] = getXY();
    const URL = 'http://localhost:9000/api/result';

    axios.post(URL, {
      email: email,
      steps: steps,
      x: x,
      y: y
    })
    .then(res => {
      console.log(res)
      setInitialMessage(res.data.message)
    })
    .catch(err => {
      console.log(err)
      setInitialMessage("Ouch: email is required")
      
    })
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === currentIndex ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{initialMessage}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" value ={email} onChange={onChange}></input>
        <input id="submit" type="submit" onClick={onSubmit}  ></input>
      </form>
    </div>
  )
}


