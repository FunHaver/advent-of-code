#!/bin/node

const fs = require('node:fs');
let sillyStrings = '';

let numberMap = {
	"one": "1",
	"1": "1",
	"two": "2",
	"2": "2",
	"three": "3",
	"3":"3",
	"four": "4",
	"4": "4",
	"five": "5",
	"5": "5",
	"six": "6",
	"6": "6",
	"seven": "7",
	"7": "7",
	"eight": "8",
	"8": "8",
	"nine": "9",
	"9": "9"
}
let doTheChallenge = function(input) {
	let accum = 0;
	for(let i = 0; i < input.length; i++) {
		let line = input[i];
		let numbersFound = [];
		for(let key in numberMap){
			const occurances = [...line.matchAll(new RegExp(key, 'g'))];
				for(let i = 0; i < occurances.length; i++) {
					numbersFound.push({string: key, position: occurances[i].index});
				}
		}
		if(numbersFound.length === 0)
			continue;

		let smallestPos = 1000;
		let largestPos = 0;
		let first;
		let last;
		for(let i = 0; i < numbersFound.length; i++) {
			if(numbersFound[i].position >= largestPos) {
				largestPos = numbersFound[i].position;
				last = numbersFound[i].string;
			}

			if(numbersFound[i].position <= smallestPos) {
				smallestPos = numbersFound[i].position;
				first = numbersFound[i].string;
			}
		}

		
		if(numbersFound.length === 1) {
			accum += parseInt(numberMap[first] + numberMap[first]);
		} else {
			accum += parseInt(numberMap[first] + numberMap[last]);
		}

	}
	console.log(accum);
}


fs.readFile('day1.txt', 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	} else {
		sillyStrings = data;
	doTheChallenge(data.split("\n"));
	//doTheChallenge(["six7fivenbljxg6onesevenzmknhdfive"]);
	}
})

