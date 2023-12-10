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
            cardScores.push(parseInt(card));
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
    let jokerSituation = 0;
    let highestCard = 0;
    console.log(hand)
    for(let i = 0; i < hand.length; i++){
        
        if(hand[i] !== 1){
            let filterArray = hand.filter(item => {
                if(item === hand[i]){
                    return true;
                } else {
                    return false;
                }
            })
            if(filterArray.length > 1){
                matches[hand[i]] = filterArray.length;
            }
        } else {
            jokerSituation++;
        }

        if(hand[i] > highestCard){
            highestCard = hand[i];
        }
    }

    if(jokerSituation > 0){
        let matchKeys = Object.keys(matches);
        if(matchKeys.length >= 1){
            let keyWithMost = "";
            for(let i = 0; i < matchKeys.length; i++){
                console.log(matches[matchKeys[i]])
                if(i === 0){
                    keyWithMost = matchKeys[i]
                } else if(matches[matchKeys[i]] > matches[keyWithMost]){
                    keyWithMost = matchKeys[i]
                }
            }
            matches[keyWithMost] += jokerSituation;
            console.log(matches);
        } else {
            matches[`${highestCard}`] = 1 + jokerSituation;
            console.log(matches);
        }
       
    }

    const singleSuitMatch = function(matchNum){
        
        if(matchNum === 5)
            game[categoryMap["fiveKind"]].push(play);
        else if(matchNum === 4)
            game[categoryMap["fourKind"]].push(play)
        else if(matchNum === 3)
            game[categoryMap["threeKind"]].push(play);
        else if(matchNum === 2)
            game[categoryMap["onePair"]].push(play);
        else {
            console.error(`ERROR, CANNOT CLASSIFY. matchNum: ${matchNum}`)
            console.error(play);
        }
    }

    const multiSuitMatch = function(firstMatchNum, secondMatchNum){
        if(firstMatchNum === 2 && secondMatchNum === 2){
            game[categoryMap["twoPair"]].push(play);
        } else if(firstMatchNum === 3 || secondMatchNum === 3){
            if(firstMatchNum === 2 || secondMatchNum === 2){
                game[categoryMap["fullHouse"]].push(play);
            } else {
                if(firstMatchNum > secondMatchNum){
                    singleSuitMatch(firstMatchNum);
                } else {
                    singleSuitMatch(secondMatchNum);
                }
            } 
        } else {
            if(firstMatchNum > secondMatchNum){
                singleSuitMatch(firstMatchNum);
            } else {
                singleSuitMatch(secondMatchNum);
            }
        }
    }

    const matchKeys = Object.keys(matches);
    if(matchKeys.length === 0){
        game[categoryMap["highCard"]].push(play);
    } else if(matchKeys.length === 1){
        singleSuitMatch(matches[matchKeys[0]]);
        
    } else if(matchKeys.length === 2){
        multiSuitMatch(matches[matchKeys[0]], matches[matchKeys[1]])
        
    } else {
        let highestMatchNum = 0;
        let secondHighestMatchNum = 0;
        for(let i = 0; i < matchKeys.length; i++){
            if(matches[matchKeys[i]] > highestMatchNum){
                highestMatchNum = matches[matchKeys[i]];
            } else if(matches[matchKeys[i]] > secondHighestMatchNum){
                secondHighestMatchNum = matches[matchKeys[i]]
            }
        }
        multiSuitMatch(highestMatchNum, secondHighestMatchNum);
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