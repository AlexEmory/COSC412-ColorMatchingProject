//let colorList = require("./colorList.js");
import {colorList} from "./colorList.js";
//calculates how far off color 2 is from color 1
//output is the delta e value
function deltaE (color1, color2){
	//console.log(color2.L);
	return (Math.sqrt(Math.pow(color2.L - color1.L, 2) + Math.pow(color2.A - color1.A, 2) + 
		Math.pow(color2.B - color1.B, 2))).toFixed(2);
}

//finds color that lowers the delta e value 
//this will be the starting color
function findLowest(desiredColor){
	var min = 1000;
	var tempE = 0;
	let clr = {L:30, A:20, B:30, parts:0};
	for(var i in colorList){
		tempE = deltaE(desiredColor, colorList[i]);
		//console.log(tempE);//test
		if(tempE < min){
			min = tempE;
			clr = colorList[i];
		}
	}
	//console.log(clr.name);
	return clr;
	
}

//BODY logic for the body where we brute force all the colors to see if it lowers 
//the delta E value
//var wantedColor = {L : 69.48, A : -32.09, B: 14.8, parts:0};//i guess we just ask for the LAB input
//var wantedColor = {L : 62.82, A : -5.01, B : 20.12, parts : 0};//GIVES SOMETHING
//var wantedColor = {L : 32.82, A : 60.01, B : 20.12, parts : 0};//delta  102 to 100
var wantedColor = {L : 32.00, A : -32.00, B : 32.00, parts : 0};
//Here, check to see if the color is not obtainable from the set of Testor’s paint

//console.log(colorList);
// for(let x in colorList){
// 	//let color = colorList[x];
// 	console.log(colorList[x].L);
// }

var lowest = findLowest(wantedColor);//this should be a color object
lowest.parts++;
var delta = deltaE(wantedColor, lowest);
console.log(delta);

var recipe = {lowest};//this is the list of colors to add
var sumL = lowest.L, sumA = lowest.A, sumB = lowest.B;
var num = 1;//number of 

var ctr = 0; //this is purely for testing to make sure something doesn’t run infinitely
//now we will go through the process of trying to get under delta e = 7
while(delta >= 7 && ctr < 10000){
	//console.log("test");

    //average the list of colors that we have.  
	//var sumL = 0, sumA = 0, sumB = 0;
	//recipe.forEach(function(i){
	// for(var i in recipe){
	// 	sumL += i.L;
	// 	sumA += i.A;
	// 	sumB += i.B;
	// 	//num++;
    // }
    var currColor = {L:(sumL/num), A:(sumA/num), B:(sumB/num), parts : 0};
	delta = deltaE(wantedColor, currColor);
	//console.log(delta);

    //go through color list seeing if something helps lower delta E
    //colorList.forEach(function(c){
	for(var c in colorList){
        var tempL = (sumL + colorList[c].L);
        var tempA = (sumA + colorList[c].A);
        var tempB = (sumB + colorList[c].B);
		
		let tempColor = {L:(tempL/(num + 1)), A:(tempA/(num + 1)), B:(tempB/(num + 1)), parts:0};
		var tempDelta = deltaE(wantedColor, tempColor);
		
		//console.log(tempDelta);
		//if something helps, apply it again
		if(tempDelta < delta){
			//console.log(tempDelta + "temp1");
			//recipe.push(c);//add it to the recipe
			colorList[c].parts++;
			sumL += colorList[c].L;
			sumA += colorList[c].A;
			sumB += colorList[c].B;
			ctr++;
            num++;
			var cond = 1;
			delta = tempDelta;
			while (cond){
				tempL += colorList[c].L;
				tempA += colorList[c].A;
				tempB += colorList[c].B;
				
				tempColor = {L:(tempL/(num + 1)), A:(tempA/(num + 1)), B:(tempB/(num + 1)), parts:0};
				var tempDelta2  = deltaE(wantedColor, tempColor);
				//keep applying if it works, else leave loop
				if(tempDelta2 < tempDelta){//tempDelta < delta
					//recipe.push(c);
					//console.log("delta2 test");
					colorList[c].parts++;
					sumL += colorList[c].L;
					sumA += colorList[c].A;
					sumB += colorList[c].B;
					num++;
					ctr++;
					tempDelta = tempDelta2;
                }
				else
					cond = 0;
			}
		}
		
    }
	ctr++;


}
console.log(ctr);
//for now, i didn't add the part where we add the base color again after each iteration
//Don't we not have to do this as we add it in through the loops anyway?

//now we will add white or black to see if that helps.  
//i dont know the values of the black or white that we are using so we could add that later
//hopefully, you get the jist of how i test and add a color

console.log(deltaE(wantedColor, currColor));
//recipe.forEach(function(c){
if(ctr == 100){
	console.log("cannot create color");
}
	else {
	for(var clr in colorList){
		if(colorList[clr].parts > 0){
			console.log(clr + " : " + colorList[clr].parts);
		}
	};
}

