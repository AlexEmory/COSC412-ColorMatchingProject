import {gloss} from "./colorList.js";

//calculates how far off color 2 is from color 1
//output is the delta e value
export function deltaE (color1, color2) {//color1 desired, color2 compared color
	return (Math.sqrt(Math.pow((color2.L - color1.L), 2) + Math.pow((color2.A - color1.A), 2) +
					Math.pow((color2.B - color1.B), 2))).toFixed(2);
}

//finds color that lowers the delta e value

//this will be the starting color
export function findLowest(target){//V2
	//console.log("findLowest: desired" , desiredColor);

	let lowest;
	let first = 1;

	for(var i in gloss){
		if(first){
			lowest = gloss[i];
			first = 0;
		}else if(isBetter(target, gloss[i], lowest)){			
			lowest = gloss[i];
		}
	}	
	return lowest;
}

export function sameSign(num1, num2){
	return ((num1 < 0.0) === (num2 < 0.0));
}

export function isBetter(target, next, old){
	if((Math.abs(target.L - next.L)) 
					< (Math.abs(target.L - old.L))){
			if((Math.abs(target.A - next.A)) 
					< (Math.abs(target.A - old.A))){
				if((Math.abs(target.B - next.B)) 
					< (Math.abs(target.B - old.B))){
						return true;
				}
			}
		}
	return false;
}







