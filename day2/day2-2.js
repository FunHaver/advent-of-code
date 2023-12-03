const fs = require('node:fs');

const doTheChallenge = function(dataArray){
    let accum = 0;
    for(let i = 0; i < dataArray.length; i++){
        const game = dataArray[i];
        const gameSplit = game.split(":");
        const id = parseInt(gameSplit[0].match(/[0-9]+/)[0]);
        const roundArray = gameSplit[1].split(";");

        let diceAmount = {
            "red": 1,
            "green": 1,
            "blue": 1
        };

        for(let j = 0; j < roundArray.length; j++){
            const round = roundArray[j];
            const cubes = round.split(",");
            for(let k = 0; k < cubes.length; k++){
                const color = cubes[k].match(/green|blue|red/)[0];
                const amt = parseInt(cubes[k].match(/[0-9]+/)[0]);
                if(amt > diceAmount[color]){
                    diceAmount[color] = amt;
                }
            }
        }
        const power = diceAmount.green * diceAmount.red * diceAmount.blue;
        accum += power;
        
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