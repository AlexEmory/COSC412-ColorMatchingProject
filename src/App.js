import React, { Component } from 'react';
import './App.css';

import Value from './components/Value';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      l: 0,
      a: 0,
      b: 0,

      r: 0,
      y: 0,
      b: 0
    };
  }

  handleInputChange() {

  }

  updateOutput() {
    const { l, a, b } = this.state;//extract lab values from states
    const output = {//initialize an object for our output
      r: 0, y: 0, b: 0
    };

    /**
     * Do some work here to calculate the r, y and b values
     * based on the l, a, and b values,
     * then store them into the output object.

     * Once setState(output) is called, the app will rerender,
     * and the output values will be updated in the UI
     */

    this.setState(output);
  }

  render() {
    const self = this;
    const { r, y, b } = this.state;

    return (
      <div className='App'>
        <header>
          <h1>Color Matcher Prototype</h1>
        </header>
        <div className={'input'}>
          <h3>{'LAB Values'}</h3>
          <div>
            <Value label={'L:'} onChange={(value) => this.setState({l: value})}/>
            <Value label={'A:'} onChange={(value) => this.setState({a: value})}/>
            <Value label={'B:'} onChange={(value) => this.setState({b: value})}/>
          </div>
        </div>

        <div className={'output'}>
          <h3>{'RYB Values'}</h3>
          <div>
            <Value label={'Red:'} value={r}/>
            <Value label={'Yellow:'} value={y}/>
            <Value label={'Blue:'} value={b}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
