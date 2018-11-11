var express = require("express");
import colorList from "./colorList.js";
//calculates how far off color 2 is from color 1
//output is the delta e value
function deltaE ({color1}, {color2}){
	try{
		return Math.sqrt(Math.pow(color2.L-color1.L, 2) + Math.pow(color2.A - color1.A, 2) + 
			Math.pow(color2.B - color1.B, 2));
	}
	catch(e){
		console.log("error");
	}
}

//finds color that lowers the delta e value 
//this will be the starting color
function findLowest(desiredColor){
	var min = 1000;
	var tempE = 0;
	for(var i in colorList){
		tempE = deltaE(desiredColor, i);
		if(tempE < min)
			min = tempE;
	}
	
}

//BODY logic for the body where we brute force all the colors to see if it lowers 
//the delta E value
var wantedColor = {l : 25, a : 35, b: 45};//i guess we just ask for the LAB input
//Here, check to see if the color is not obtainable from the set of Testor’s paint


var lowest = findLowest(wantedColor);//this should be a color object
var delta = deltaE(wantedColor, lowest);

var recipe = {lowest};//this is the list of colors to add
var num = 1;//number of 

var ctr = 0; //this is purely for testing to make sure something doesn’t run infinitely
//now we will go through the process of trying to get under delta e = 7
while(delta >= 7 && ctr != 100){


    //average the list of colors that we have.  
	var sumL = 0, sumA = 0, sumB = 0;
	//recipe.forEach(function(i){
	for(var i in colorList){
		SumL += i.L;
		sumA += i.A;
		sumB += i.B;
		num++;
    }
    var currColor = {L:sumL, A:sumA, B:sumB, parts : 0};
    delta = deltaE(wantedColor, currColor);

    //go through color list seeing if something helps lower delta E
    //colorList.forEach(function(c){
	for(var i in colorList){
        var tempL = (sumL + c.L);
        var tempA = (sumA + c.A);
        var tempB = (sumB + c.B);
		
		var tempColor = new Color(tempL/(num + 1), tempA/(num + 1), tempB/(num + 1));
		var tempDelta = deltaE(wantedColor, tempColor);
		
		//if something helps, apply it again
		if(tempDelta < delta){
            recipe.push(c);//add it to the recipe
            ctr++;
            num++;
			var cond = 1;
			while (cond){
				tempL += c.L;
				tempA += c.A;
				tempB += c.B;
				
				tempColor = new Color(tempL/(num + 1), tempA/(num + 1), tempB/(num + 1));
				tempDelta  = deltaE(wantedColor, tempColor);
				//keep applying if it works, else leave loop
				if(tempDelta < delta){
                    recipe.push(c);
                    num++;
                    ctr++;
                }
				else
					cond = 0;
			}
        }
    }



}
//for now, i didn't add the part where we add the base color again after each iteration
//Don't we not have to do this as we add it in through the loops anyway?

//now we will add white or black to see if that helps.  
//i dont know the values of the black or white that we are using so we could add that later
//hopefully, you get the jist of how i test and add a color

//recipe.forEach(function(c){
for(var i in colorList){
    console.log(c.name);
};


