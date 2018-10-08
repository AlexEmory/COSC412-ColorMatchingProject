import React, { Component } from 'react';
import './App.css';

import lab2xyz from 'pure-color/convert/lab2xyz';
import xyz2rgb from 'pure-color/convert/xyz2rgb';
import rgb2cmyk from 'pure-color/convert/rgb2cmyk';

import Value from './components/Value';
import { isEqual } from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      LAB: { l: 0, a: 0, b: 0 },
      CMYK: { c: 0, m: 0, y: 0, k: 0 }
    };

    this.updateOutput = this.updateOutput.bind(this);
  }

  handleInputChange() {

  }

  // lab => xyz => rgb => cmyk
  lab2cmyk(lab) {
    return rgb2cmyk(xyz2rgb(lab2xyz(lab)));
  }

  updateOutput() {
    const { l, a, b } = this.state.LAB;//extract lab values from state
    const output = {//initialize an object for our output
      c: 0, m: 0, y: 0, k: 0
    };



    const cmyk = this.lab2cmyk([l, a, b]);

    output.c = cmyk[0];
    output.m = cmyk[1];
    output.y = cmyk[2];
    output.k = cmyk[3];

    this.setState({CMYK: output});
  }

  componentDidUpdate() {
    this.updateOutput();
  }

  shouldComponentUpdate(nextProps, prevState) {
    return !isEqual(this.state, prevState);
  }

  render() {
    const self = this;
    const { c, m, y, k } = this.state.CMYK;

    console.log(this.state.LAB, this.state.CMYK);

    return (
      <div className='App'>
        <header>
          <h1>Color Matcher Prototype</h1>
        </header>
        <div className={'input'}>
          <h3>{'LAB Values'}</h3>
          <div>
            <Value label={'L:'} min={0} max={100} onChange={(value) => self.setState({LAB: Object.assign({}, self.state.LAB, {l: value})})}/>
            <Value label={'A:'} min={-128} max={127} onChange={(value) => self.setState({LAB: Object.assign({}, self.state.LAB, {a: value})})}/>
            <Value label={'B:'} min={-128} max={127} onChange={(value) => self.setState({LAB: Object.assign({}, self.state.LAB, {b: value})})}/>
          </div>
        </div>

        <div className={'output'}>
          <h3>{'CMYK Values'}</h3>
          <div>
            <Value min={0} max={100} label={'Cyan:'} value={c}/>
            <Value min={0} max={100} label={'Magenta:'} value={m}/>
            <Value min={0} max={100} label={'Yellow:'} value={y}/>
            <Value min={0} max={100} label={'Black:'} value={k}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
