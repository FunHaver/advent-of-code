const fs = require('node:fs');

const diceAmount = {
    "red": 12,
    "green": 13,
    "blue": 14
}

const doTheChallenge = function(dataArray){
    let accum = 0;
    for(let i = 0; i < dataArray.length; i++){
        const game = dataArray[i];
        const gameSplit = game.split(":");
        const id = parseInt(gameSplit[0].match(/[0-9]+/)[0]);
        const roundArray = gameSplit[1].split(";");

        let badRound = false;
        for(let j = 0; j < roundArray.length; j++){
            const round = roundArray[j];
            const cubes = round.split(",");
            for(let k = 0; k < cubes.length; k++){
                if(parseInt(cubes[k].match(/[0-9]+/)[0]) > diceAmount[cubes[k].match(/green|blue|red/)[0]]){
                    badRound = true;
                }
            }
        }
        if(!badRound){
            accum += id;
        }
        
    }
    console.log(accum);
}

fs.readFile('day2.txt', 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	} else {
	    doTheChallenge(data.split("\n"));
	}
})