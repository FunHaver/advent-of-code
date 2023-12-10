const fs = require('node:fs');

let categoryMap = {
    "highCard": 0,
    "onePair": 1,
    "twoPair": 2,
    "threeKind":3,
    "fullHouse": 4,
    "fourKind": 5,
    "fiveKind": 6

}
let game = [[],[],[],[],[],[],[]];

const parseHand = function(line){
    let splitPlay = line.split(" ");
    let cardScores = [];
    for(let i = 0; i < splitPlay[0].length; i++){
        let card = splitPlay[0][i];
        if(card === "A")
            cardScores.push(14);
        else if(card === "K")
            cardScores.push(13);
        else if(card === "Q")
            cardScores.push(12);
        else if(card === "J")
            cardScores.push(1);
        else if(card === "T")
            cardScores.push(10);
        else
            cardScores.push(parseInt(card))
    }
    return {
        hand: cardScores,
        bid: parseInt(splitPlay[1])
    }
}

const rankCategory = function(category){
    let sortedCat = category.sort((a, b) => {
        for(let i = 0 ; i < a.hand.length; i++){      
            if(a.hand[i] > b.hand[i]){
                return 1
            } else if (a.hand[i] < b.hand[i]){
                return -1
            } else {
                continue;
            }
        }
    })
    return sortedCat;
}

const classifyHand = function(play){
    const hand = play.hand;
    let matches = {};
    let jokerCounter = 0;
    let highestCard = 0;
    for(let i = 0; i < hand.length; i++){
        if(hand[i] > 1){
            let filterArray = hand.filter(item => item === hand[i]);
            if(filterArray.length > 1){
                matches[hand[i]] = filterArray.length;
            }
        } else {
            jokerCounter++;
        }

        if(hand[i] > highestCard){
            highestCard = hand[i];
        }
    }

    if(jokerCounter > 0){
        const matchKeys = Object.keys(matches);
        if(matchKeys.length === 1){
            matches[matchKeys[0]] += jokerCounter;
        } else if (matchKeys.length === 0 && highestCard > 1){
            matches[`${highestCard}`] = jokerCounter + 1;
        } else if(matchKeys.length === 0 && highestCard === 1){
            matches[`${highestCard}`] = jokerCounter;
        } else {
            let mostMatchKeys = "";
            for(let i = 0; i < matchKeys.length; i++){
                if(mostMatchKeys.length === 0){
                    mostMatchKeys = matchKeys[i];
                } else if(matches[matchKeys[i]] > matches[mostMatchKeys]) {
                    mostMatchKeys = matchKeys[i];
                }
            }

            matches[mostMatchKeys] += jokerCounter;
        }
    }

    const matchKeys = Object.keys(matches);
    if(matchKeys.length === 0){
        game[categoryMap["highCard"]].push(play);
    } else if(matchKeys.length === 1){
        let matchNum = matches[matchKeys[0]];
        if(matchNum === 5)
            game[categoryMap["fiveKind"]].push(play);
        else if(matchNum === 4)
            game[categoryMap["fourKind"]].push(play)
        else if(matchNum === 3)
            game[categoryMap["threeKind"]].push(play);
        else if(matchNum === 2)
            game[categoryMap["onePair"]].push(play);
        else {
            console.error(`ERROR, CANNOT CLASSIFY:`)
            console.error(play);
            console.error(matches)
        }
    } else if(matchKeys.length === 2){
        let firstMatchNum = matches[matchKeys[0]];
        let secondMatchNum = matches[matchKeys[1]];

        if(firstMatchNum === 2 && secondMatchNum === 2)
            game[categoryMap["twoPair"]].push(play);
        else if(firstMatchNum === 3 || secondMatchNum === 3){
            if(firstMatchNum === 2 || secondMatchNum === 2){
                game[categoryMap["fullHouse"]].push(play);
            } else {
                console.error(`ERROR, CANNOT CLASSIFY:`)
                console.error(play);
                console.error(matches)
            }
        }
    } else {
        console.error(`ERROR, CANNOT CLASSIFY:`)
        console.error(play);
        console.error(matches)
    }    
}

const doTheChallenge = function(data){
    data.forEach(line => {
        let play = parseHand(line);
        classifyHand(play);
    })
    let rank = 1;

    for(let i = 0; i < game.length; i++){
        const temp = rankCategory(game[i]);
        game[i] = temp;
    }
    let score = 0;

    for(let i = 0; i < game.length; i++){
        const category = game[i];
        for(let j = 0; j < category.length; j++){
            score += category[j].bid * rank;
            rank++;
        }
    }

    console.log(score);

    
}

fs.readFile('day7.txt', 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	} else {
	    doTheChallenge(data.split("\n"));
	}
})