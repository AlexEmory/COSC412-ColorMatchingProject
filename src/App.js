import React, { Component } from 'react';
import './App.css';

import lab2xyz from 'pure-color/convert/lab2xyz';
import xyz2rgb from 'pure-color/convert/xyz2rgb';
import rgb2cmyk from 'pure-color/convert/rgb2cmyk';
import cmyk2rgb from 'pure-color/convert/cmyk2rgb';

import Value from './components/Value';
import { isEqual } from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      LAB: { l: 0, a: 0, b: 0 },
      CMYK: { c: 0, m: 0, y: 0, k: 0 },
	  Ratio: {cR: 0, mR: 0, yR: 0, kR: 0, wR: 0}
    };

    this.updateOutput = this.updateOutput.bind(this);
  }

  handleInputChange() {

  }

  // lab => xyz => rgb => cmyk
  lab2cmyk(lab) {
	let xyz = lab2xyz(lab)
	let rgb = xyz2rgb(xyz)
	let cmyk = rgb2cmyk(rgb);
	console.log("xyz", xyz)
	console.log("rgb",rgb)
	console.log("cmyk",cmyk)
    return cmyk;
  }
  /*
  lab2xyz(lab){
	let var_Y = ( lab[0] + 16 ) / 116
	let var_X = lab[1] / 500 + var_Y
	let var_Z = var_Y - lab[2] / 200

	if ( Math.pow(var_Y,3)  > 0.008856 )
		var_Y = Math.pow(var_Y,3)
	else
		var_Y = ( var_Y - 16 / 116 ) / 7.787
	if ( Math.pow(var_X,3)  > 0.008856 )
		var_X = Math.pow(var_X,3)
	else
		var_X = ( var_X - 16 / 116 ) / 7.787
	if ( Math.pow(var_Z,3)  > 0.008856 )
		var_Z = Math.pow(var_Z,3)
	else
		var_Z = ( var_Z - 16 / 116 ) / 7.787

	X = var_X * Reference-X
	Y = var_Y * Reference-Y
	Z = var_Z * Reference-Z
	return [X, Y, Z];
	}
  */

  updateOutput() {
    const { l, a, b } = this.state.LAB;//extract lab values from state
    const self = this;
    const cmykOutput = {//initialize an object for our cmykOutput
      c: 0, m: 0, y: 0, k: 0
    };
    const ratioOutput = {//initialize an object for our ratioOutput
      cR: 0, mR: 0, yR: 0, kR: 0, wR: 0
    };

    const cmyk = this.lab2cmyk([l, a, b]).map(n => self.round(n));
    let gcd;
    let black;
    let white;

    cmyk[0] = Math.floor(cmyk[0]);
    cmyk[1] = Math.floor(cmyk[1]);
    cmyk[2] = Math.floor(cmyk[2]);
    cmyk[3] = Math.floor(cmyk[3]);

    cmykOutput.c = Math.floor(cmyk[0]);
    cmykOutput.m = Math.floor(cmyk[1]);
    cmykOutput.y = Math.floor(cmyk[2]);
    cmykOutput.k = Math.floor(cmyk[3]);

    if (cmyk[3] > 50) {
      black = (Math.floor(cmyk[3]) - 50)*2;
      gcd = this.gcd_more_than_two_numbers([...cmyk, black]);
    } else if (cmyk[3] < 50) {
    	white =  100 - Math.ceil(cmyk[3]);
    	gcd = this.gcd_more_than_two_numbers([...cmyk, white]);
    } else {
      white = 1;
      black = 1;
      gcd = this.gcd_more_than_two_numbers([...cmyk, white, black]);
    }

    //gcd = this.gcd_more_than_two_numbers([cmyk[0],cmyk[1],cmyk[2],cmyk[3]]);
    ratioOutput.cR = Math.floor(cmyk[0])/gcd;
    ratioOutput.mR = Math.floor(cmyk[1])/gcd;
    ratioOutput.yR = Math.floor(cmyk[2])/gcd;
    ratioOutput.kR = Math.floor(black)/gcd;
		ratioOutput.wR = Math.floor(white)/gcd;


    this.setState({CMYK: cmykOutput, Ratio: ratioOutput});
  }
  round(a){
	if(a%5 < 3)
		a = a - (a%5);
	else
		a = a + (5 - a%5);
	return a;
  }
  //https://www.w3resource.com/javascript-exercises/javascript-math-exercise-9.php
  gcd_more_than_two_numbers(input) {
  if (toString.call(input) !== "[object Array]")
        return  false;
  var len, a, b;
	len = input.length;
	if ( !len ) {
		return null;
	}
	a = input[ 0 ];
	for ( var i = 1; i < len; i++ ) {
		b = input[ i ];
		a = this.gcd_two_numbers( a, b );
	}
	return a;
}

gcd_two_numbers(x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number'))
    return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
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
    const { cR, mR, yR, kR, wR } = this.state.Ratio;

    //use this to display the color
    const rgb = cmyk2rgb([c, m, y, k]);

    return (
      <div className='App'>
        <header>
          <h1>Color Matcher Prototype</h1>
        </header>
        <div className={'input'}>
          <h3>{'LAB Values'}</h3>
          <div style={{position: 'absolute'}}><div className="color-circle" style={{backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}}/></div>
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
		<div className={'output'}>
          <h3>{'Mix Ratio'}</h3>
          <div>
            {cR>0?<div>{`${cR} part(s) Cyan`}</div>:null}
            {mR>0?<div>{`${mR} part(s) Magenta`}</div>:null}
            {yR>0?<div>{`${yR} part(s) Yellow`}</div>:null}
            {kR>0?<div>{`${kR} part(s) Black`}</div>:null}
            {wR>0?<div>{`${wR} part(s) White`}</div>:null}
          </div>
        </div>
      </div>
    );
  }

}
export default App;
