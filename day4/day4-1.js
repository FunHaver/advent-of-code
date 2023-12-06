const fs = require('node:fs');

const getCardValue = function(winners, entires){
    let matches = 0;
    for(let i = 0; i < entires.length; i++){
        for(let j = 0; j < winners.length; j++){
            if(entires[i] === winners[j]){
                matches++;
            }
        }
    }
    
    if(matches === 0){
        return 0;
    } else {
        let value = 0;
        for(let i = 0; i < matches; i++){
            if(i === 0){
                value = 1;
            } else {
                value *= 2;
            }
        }

        return value;
    }
    
}

const doTheChallenge = function(cards) {
    let pileWorth = 0;

    for(let i = 0; i < cards.length; i++){
        const colonSplit = cards[i].split(":");
        const cardName = colonSplit[0];
        const numberSets = colonSplit[1].split("|");
        const winners = numberSets[0].split(" ").filter(numString => numString.length > 0);
        const entries = numberSets[1].split(" ").filter(numString => numString.length > 0);
        console.log(`${cardName}: ${getCardValue(winners, entries)}`);
        pileWorth += getCardValue(winners, entries);

    }
    console.log(pileWorth);
}

fs.readFile('day4.txt', 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	} else {
	    doTheChallenge(data.split("\n"));
	}
})