import React, { Component } from 'react';
import './App.css';

import lab2xyz from 'pure-color/convert/lab2xyz';
import xyz2rgb from 'pure-color/convert/xyz2rgb';
import {deltaE , findLowest} from './utils/painMixing';
import {gloss} from './utils/colorList';

import Value from './components/Value';
import { isEqual } from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      LAB: { l: 0, a: 0, b: 0 },
  	  parts: [],
  	  eLimit: {limit: 2},
  	  finalDE: { DE: 0}
    };

    this.updateOutput = this.updateOutput.bind(this);
  }

  updateOutput() {
    const { l, a, b } = this.state.LAB;//extract lab values from state
  	const {limit} = this.state.eLimit;//extract deltaE limit from state
  	let wantedColor = {L: l || 0, A: a || 0, B: b || 0, parts : 0};
  	let partsCount = {};
  	let eLimit = limit;
  	//wantedColor = {L : 72.98, A : -36.06, B : 49.12, parts : 0};
  	let lowest = findLowest(wantedColor);//this should be a color object
  	partsCount[lowest.name] = 1;
  	let delta = deltaE(wantedColor, lowest);
  	console.log("\nStarting dE: " + delta);

  	let sumL = lowest.L, sumA = lowest.A, sumB = lowest.B;
  	let num = 1;//number of
  	let currColor = {L:(sumL/num), A:(sumA/num), B:(sumB/num), parts : 0};
  	let ctr = 0; //this is purely for testing to make sure something doesn’t run infinitely

  	do {
  		delta = deltaE(wantedColor, currColor);

  		//go through color list seeing if something helps lower delta E
  		for(let c in gloss){
  			let tempL = (sumL + gloss[c].L);
  			let tempA = (sumA + gloss[c].A);
  			let tempB = (sumB + gloss[c].B);
  			let tempColor = {L:(tempL/(num + 1)), A:(tempA/(num + 1)), B:(tempB/(num + 1)), parts:0};
  			let tempDelta = deltaE(wantedColor, tempColor);

  			//if something helps, apply it again
  			if(!(delta <= eLimit) && tempDelta < delta){
  				if(partsCount.hasOwnProperty(gloss[c].name)){
  					partsCount[gloss[c].name]++;
  				}else{
  					partsCount[gloss[c].name] = 1;
  				}
  				sumL += gloss[c].L;
  				sumA += gloss[c].A;
  				sumB += gloss[c].B;
  				ctr++;
  				num++;
  				let cond = 1;
  				delta = tempDelta;

  				while (cond){
  					tempL += gloss[c].L;
  					tempA += gloss[c].A;
  					tempB += gloss[c].B;
  					tempColor = {L:(tempL/(num + 1)), A:(tempA/(num + 1)), B:(tempB/(num + 1)), parts:0};
  					let tempDelta2  = deltaE(wantedColor, tempColor);

  					//keep applying if it works, else leave loop
  					if(tempDelta2 < tempDelta){//tempDelta < delta
  						if(partsCount.hasOwnProperty(gloss[c].name)){
  							partsCount[gloss[c].name]++;
  						}else{
  							partsCount[gloss[c].name] = 1;
  						}
  						sumL += gloss[c].L;
  						sumA += gloss[c].A;
  						sumB += gloss[c].B;
  						num++;
  						ctr++;
  						tempDelta = tempDelta2;
  						delta = tempDelta2;
  					}else
  						cond = 0;
  				}
  			}
  		}
  		ctr++;
  	} while((delta >= eLimit) && ctr < 100);

  	console.log("Run Count: " + ctr );

  	console.log("Current Color: " + currColor.L + " " + currColor.A + " " + currColor.B);
  	console.log("dE: " + deltaE(wantedColor, currColor));

  	let parts = [];
  	for(let name in partsCount){
  		parts.push({name, parts:partsCount[name]});
  	};
  	this.setState({parts});

  	let finalDE = {DE: delta};
  	this.setState({finalDE});
  }

  componentDidUpdate() {
    this.updateOutput();
  }

  shouldComponentUpdate(nextProps, prevState) {
    return !isEqual(this.state, prevState);
  }

  render() {
    const self = this;
    //use this to display the color
  	const {l, a, b} = this.state.LAB;
  	const rgb = xyz2rgb(lab2xyz([l, a, b]));
  	const finalDE = this.state.finalDE.DE;

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
		  <div>
			<Value label={'dE limit:'} min={0} onChange={(value) => self.setState({eLimit: Object.assign({}, self.state.eLimit, {limit: value})})}/>
		  </div>
        </div>

		<div className={'output'}>
          <h3>{'Mix Ratio'}</h3>
			dE of mixture: {finalDE}
		  <div>
			{this.state.parts.map(color => {
          return (
		  <span key={color.name}>
            {color.parts} part(s) - {color.name}<br/>
          </span>)
			})}
		  </div>
        </div>
      </div>
    );
  }

}
export default App;
