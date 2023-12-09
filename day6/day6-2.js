const fs = require('node:fs');

const parseLine = function(line){
    const numberMatches = [...line.matchAll(/[0-9]+/g)];
    let numberString = ''
    numberMatches.forEach(match => {
        numberString += match;
    })
    return parseInt(numberString);
}

const getMinPush = function(time, record){
    let minPushTime = 0
    for(let i = 0; i * (time - i) <= record; i++){
        minPushTime = i + 1;
    }
    return minPushTime;
}

const doTheChallenge = function(data){
    const time = parseLine(data[0]);
    const distance = parseLine(data[1]);

    const minPush = getMinPush(time, distance);
    const maxPush = time - minPush;
    const accum = maxPush - minPush + 1;
    console.log(accum);
}

fs.readFile('day6.txt', 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	} else {
	    doTheChallenge(data.split("\n"));
	}
})