import React, { Component } from 'react';
import './App.css';

import lab2xyz from 'pure-color/convert/lab2xyz';
import xyz2rgb from 'pure-color/convert/xyz2rgb';
import {deltaE , findLowest, isBetter, sameSign} from './utils/painMixing';
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
  
  updateOutput() {//V2
    const { l, a, b } = this.state.LAB;//extract lab values from state
	const {limit} = this.state.eLimit;//extract deltaE limit from state
	let wantedColor = {L: l || 0, A: a || 0, B: b || 0, parts : 0};
	let partsCount = {};
	let eLimit = limit;
	//wantedColor = {L : 72.98, A : -36.06, B : 49.12, parts : 0};//sublime green
	//wantedColor = {L : 69.23, A : -29.71, B : 39.76, parts : 0};//1 - Turquoise : 1 - yellow
	//wantedColor = {L : 60.28, A : 42.92, B : 46.78, parts : 0};//1 - Magenta : 1 - Yellow
	//wantedColor = {L : 53.72, A : 12.69, B : -13.04, parts : 0};//1 - Magenta : 1 - Turquoise
	let lowest = findLowest(wantedColor);//this should be a color object
	partsCount[lowest.name] = 1;
	let delta = deltaE(wantedColor, lowest);
	console.log("\nStarting Color: " + lowest.name);
	console.log("Starting dE: " + delta);	
	
	let sumL = lowest.L, sumA = lowest.A, sumB = lowest.B;
	let currColor = {L:(sumL), A:(sumA), B:(sumB), parts : 0};	
	let ctr = 0; //this is purely for testing to make sure something doesn’t run infinitely
	let tempColor, tempL, tempA, tempB;
	
	//do{	//V2
		delta = deltaE(wantedColor, currColor);
		
		//go through color list seeing if something helps lower delta E
		for(let color in gloss){
			tempL = (sumL + gloss[color].L);	
			tempA = (sumA + gloss[color].A);	
			tempB = (sumB + gloss[color].B);	
			tempColor = {L:(tempL/2), A:(tempA/2), B:(tempB/2), parts:0};
	
			//if something helps, apply it again
			if(!(delta <= eLimit) && isBetter(wantedColor, tempColor, currColor)){
				if(partsCount.hasOwnProperty(gloss[color].name)){
					partsCount[gloss[color].name]++;
				}else{
					partsCount[gloss[color].name] = 1;
				}				
				sumL = (gloss[color].L + sumL)/2;	
				sumA = (gloss[color].A + sumA)/2;	
				sumB = (gloss[color].B + sumB)/2;
				currColor = {L:(sumL), A:(sumA), B:(sumB), parts : 0};
				delta = deltaE(wantedColor, currColor);
				let cond = 1;	
				while (!(delta <= eLimit) && cond){
					tempL += gloss[color].L;	
					tempA += gloss[color].A;	
					tempB += gloss[color].B;		
					tempColor = {L:(tempL/2), A:(tempA/2), B:(tempB/2), parts:0};
					//keep applying if it works, else leave loop	
					if(isBetter(wantedColor, tempColor, currColor)){
						if(partsCount.hasOwnProperty(gloss[color].name)){
							partsCount[gloss[color].name]++;
						}else{
							partsCount[gloss[color].name] = 1;
						}	
						sumL = (gloss[color].L + sumL)/2;	
						sumA = (gloss[color].A + sumA)/2;	
						sumB = (gloss[color].B + sumB)/2;
						currColor = {L:(sumL), A:(sumA), B:(sumB), parts : 0};
						delta = deltaE(wantedColor, currColor);	
					}else	
						cond = 0;	
				}	
			}	
		}
	//}while((delta >= eLimit) && ctr < 1);
	
	console.log("secondary mixer");
	if(delta > eLimit){//V1
		partsCount = {};
		let tempCount = {};
		let mix;
		let tempMix;
		let firstB = 1;
		for(let A in gloss){
			for(let B in gloss){
				if(firstB){
					mix  = {L:(gloss[A].L+gloss[B].L)/2, 
						A:(gloss[A].A+gloss[B].A)/2, 
						B:(gloss[A].B+gloss[B].B)/2};
					if(deltaE(wantedColor, mix) < delta){					
						if(sameSign(wantedColor.L, mix.L) 
							&& sameSign(wantedColor.A, mix.A) 
							&& sameSign(wantedColor.B, mix.B)){
							if(partsCount.hasOwnProperty(gloss[A].name)){
								partsCount[gloss[A].name]++;
							}else{
								partsCount[gloss[A].name] = 1;
							}
							if(partsCount.hasOwnProperty(gloss[B].name)){
								partsCount[gloss[B].name]++;
							}else{
								partsCount[gloss[B].name] = 1;
							}
							currColor = mix;
							delta = deltaE(wantedColor, mix);
							firstB = 0;
						}
					}
				}else if(!firstB){
					tempMix  = {L:(gloss[A].L+gloss[B].L)/2, 
						A:(gloss[A].A+gloss[B].A)/2, 
						B:(gloss[A].B+gloss[B].B)/2};
					if(deltaE(wantedColor, tempMix) < delta){					
						if(sameSign(wantedColor.L, tempMix.L) 
							&& sameSign(wantedColor.A, tempMix.A) 
							&& sameSign(wantedColor.B, tempMix.B)){
							if(tempCount.hasOwnProperty(gloss[A].name)){
								tempCount[gloss[A].name]++;
							}else{
								tempCount[gloss[A].name] = 1;
							}
							if(tempCount.hasOwnProperty(gloss[B].name)){
								tempCount[gloss[B].name]++;
							}else{
								tempCount[gloss[B].name] = 1;
							}
							if(deltaE(wantedColor, tempMix) < deltaE(wantedColor, mix)){
								partsCount = tempCount;
								currColor = tempMix;
								delta = deltaE(wantedColor, tempMix);
							}
						}
					}	
				}
				ctr++;
				if(delta < eLimit)
					break;
			}
		}
	}
	
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
