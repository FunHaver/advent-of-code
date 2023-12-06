const fs = require('node:fs');

let cardMap = {};
let cardArray = [];

const getCardValue = function(entries, winners, justMatchNum){
    let matches = 0;
    
    for(let i = 0; i < entries.length; i++){
        for(let j = 0; j < winners.length; j++){
            if(entries[i] === winners[j]){
                matches++;
            }
        }
    }

    if(justMatchNum){
        return matches;
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

const calculateCopyCards = function(cardName, value){
    const cardNum = parseInt(cardName);
    let copyCards = [];
    for(let i = 1; i <= value; i++){
        const copyCardName = `${cardNum + i}`
        copyCards.push(cardMap[copyCardName]);
    }
    return copyCards;
}

const doTheChallenge = function(cards) {
    let pileWorth = 0;

    for(let i = 0; i < cards.length; i++){
        const colonSplit = cards[i].split(":");
        const cardName = colonSplit[0].match(/[0-9]+/)[0];
        const numberSets = colonSplit[1].split("|");
        const winners = numberSets[0].split(" ").filter(numString => numString.length > 0);
        const entries = numberSets[1].split(" ").filter(numString => numString.length > 0);
        cardMap[cardName] = {
            name: cardName,
            entries: entries,
            winners: winners,
            value: getCardValue(entries, winners, true)
        }
        cardArray.push(cardMap[cardName])
    }


    for(let i = 0; i < cardArray.length; i++){
        let copies = calculateCopyCards(cardArray[i].name, cardMap[cardArray[i].name].value);
        copies.forEach(copy => cardArray.push(copy));
    }

    console.log(cardArray.length);
}

fs.readFile('day4.txt', 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	} else {
	    doTheChallenge(data.split("\n"));
	}
})