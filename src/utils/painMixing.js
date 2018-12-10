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
<<<<<<< HEAD:src/painMixing.js
	}
	
	return lowest;
=======

		tempE = deltaE(desiredColor, gloss[i]);
		//console.log("MIN/TempE: "+ min+ "/" + tempE);

		if(tempE < min){
			//console.log("TRUE");
			color = gloss[i];
			min = tempE;

		}

	}

	return color;

}/*

//BODY logic for the body where we brute force all the colors to see if it lowers

//the delta E value

//var wantedColor = {L : 56, A : -40, B: 35, parts:0};//i guess we just ask for the LAB input

//var wantedColor = {L : 62.82, A : -5.01, B : 20.12, parts : 0};//GIVES SOMETHING

//var wantedColor = {L : 32.82, A : 60.01, B : 20.12, parts : 0};//delta  102 to 100

var wantedColor = {L : 72.98, A : -36.06, B : 49.12, parts : 0};

//Here, check to see if the color is not obtainable from the set of Testor’s paint

//for(var color in gloss){

	//console.log("Color: " + color + " : " + deltaE(wantedColor,gloss[color] ) + "\n");

	//}

var lowest = findLowest(wantedColor);//this should be a color object
lowest.parts++;

var delta = deltaE(wantedColor, lowest);
console.log("\nStarting dE: " + delta);


var sumL = lowest.L, sumA = lowest.A, sumB = lowest.B;

var num = 1;//number of



var currColor = {L:(sumL/num), A:(sumA/num), B:(sumB/num), parts : 0};

var ctr = 0; //this is purely for testing to make sure something doesn’t run infinitely

//now we will go through the process of trying to get under delta e = 7

do{

	delta = deltaE(wantedColor, currColor);

    //go through color list seeing if something helps lower delta E
	for(var c in gloss){

        var tempL = (sumL + gloss[c].L);

        var tempA = (sumA + gloss[c].A);

        var tempB = (sumB + gloss[c].B);



		let tempColor = {L:(tempL/(num + 1)), A:(tempA/(num + 1)), B:(tempB/(num + 1)), parts:0};

		var tempDelta = deltaE(wantedColor, tempColor);


		//if something helps, apply it again
		if(tempDelta < delta){

			gloss[c].parts++;

			sumL += gloss[c].L;

			sumA += gloss[c].A;

			sumB += gloss[c].B;

			ctr++;

            num++;

			var cond = 1;

			delta = tempDelta;

			while (cond){

				tempL += gloss[c].L;

				tempA += gloss[c].A;

				tempB += gloss[c].B;

				tempColor = {L:(tempL/(num + 1)), A:(tempA/(num + 1)), B:(tempB/(num + 1)), parts:0};

				var tempDelta2  = deltaE(wantedColor, tempColor);

				//keep applying if it works, else leave loop

				if(tempDelta2 < tempDelta){//tempDelta < delta

					gloss[c].parts++;

					sumL += gloss[c].L;

					sumA += gloss[c].A;

					sumB += gloss[c].B;

					num++;

					ctr++;

					tempDelta = tempDelta2;

					delta = tempDelta2;

                }

				else

					cond = 0;
>>>>>>> master:src/utils/painMixing.js

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

<<<<<<< HEAD:src/painMixing.js

export function sameSign(num1, num2){
	return ((num1 < 0.0) === (num2 < 0.0));
}
=======


    }

	ctr++;





}while(delta >= 7 && ctr < 10000);

console.log("Run Count: " + ctr );

//for now, i didn't add the part where we add the base color again after each iteration

//Don't we not have to do this as we add it in through the loops anyway?



//now we will add white or black to see if that helps.

//i dont know the values of the black or white that we are using so we could add that later

//hopefully, you get the jist of how i test and add a color


console.log("Current Color: " + currColor.L + " " + currColor.A + " " + currColor.B);
console.log("dE: " + deltaE(wantedColor, currColor));

	for(var color in gloss){

		if(gloss[color].parts > 0){

			console.log("parts: " + color + " : " + gloss[color].parts + "\n");

		}

	}
*/
>>>>>>> master:src/utils/painMixing.js
