const fs = require('node:fs');

const parseLine = function(line){
    const numberMatches = [...line.matchAll(/[0-9]+/g)];
    let numbers = []
    numberMatches.forEach(match => {
        numbers.push(parseInt(match[0]))
    })
    return numbers;
}

const getMinPush = function(time, record){
    let minPushTime = 0
    for(let i = 0; i * (time - i) <= record; i++){
        minPushTime = i + 1;
    }
    return minPushTime;
}

const doTheChallenge = function(data){
    const times = parseLine(data[0]);
    const distances = parseLine(data[1]);
    let accum = 0;

    for(let i = 0; i < times.length; i++){
        const minPush = getMinPush(parseInt(times[i]), distances[i]);
        const maxPush = parseInt(times[i]) - minPush;
        const ways = maxPush - minPush + 1;
        if(accum === 0){
            accum = ways;
        } else {
            accum *=  ways;
        }
    }
    
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