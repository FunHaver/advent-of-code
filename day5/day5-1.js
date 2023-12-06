const fs = require('node:fs');

const parseAlmanac = function(lines){
    let currentMap = ''
    let alm = {};
    lines.forEach(line => {
        if(line.match(/seeds:/)){
            const seedNums = line.split(":")[1].split(" ");
            currentMap = "seeds"
            alm[currentMap] = [];
            seedNums.forEach(seedNum => {
                if(seedNum.length > 0){
                    alm[currentMap].push(parseInt(seedNum));
                }
            })
        } else if(line.match(/[a-z]+-to-[a-z]+/)){
            currentMap = line.match(/[a-z]+-to-[a-z]+/)[0];
            alm[currentMap] = [];
        } else if(line.match(/[0-9]+ [0-9]+ [0-9]/)){
            let mapValues = line.split(" ");
            let mapLineObj = {
                destNum: parseInt(mapValues[0]),
                sourceNum: parseInt(mapValues[1]),
                range: parseInt(mapValues[2])
            }
            alm[currentMap].push(mapLineObj);
        }
    })
    return alm;
}

const getAlmanacNumber = function(value, maps){
    let mappedNumber = null;
    for(let i = 0; i < maps.length; i++){
        //first check for abnormal mapping
        const lowerBound = maps[i].sourceNum;
        const upperBound = maps[i].sourceNum + maps[i].range - 1;
        if(value >= lowerBound && value <= upperBound){
            const distanceFromLowerBound = value - lowerBound;
            mappedNumber = maps[i].destNum + distanceFromLowerBound;
        }
    }

    if(mappedNumber === null){
        return value;
    } else {
        return mappedNumber;
    }
}

const calculateSeedToLocation = function(seed, almanac){
    let soilNum = getAlmanacNumber(seed, almanac["seed-to-soil"]);
    let fertNum = getAlmanacNumber(soilNum, almanac["soil-to-fertilizer"]);
    let waterNum = getAlmanacNumber(fertNum, almanac["fertilizer-to-water"]);
    let lightNum = getAlmanacNumber(waterNum, almanac["water-to-light"]);
    let tempNum = getAlmanacNumber(lightNum, almanac["light-to-temperature"]);
    let humNum = getAlmanacNumber(tempNum, almanac["temperature-to-humidity"]);
    return getAlmanacNumber(humNum, almanac["humidity-to-location"]);
}

const doTheChallenge = function(data) {
    let almanac = parseAlmanac(data);
    let lowestLocNum = null;
    for(let i = 0; i < almanac["seeds"].length; i++){
        const locNum = calculateSeedToLocation(almanac["seeds"][i], almanac);
        if(lowestLocNum === null){
            lowestLocNum = locNum;
        } else if (lowestLocNum > locNum){
            lowestLocNum = locNum
        }
    }

    console.log(lowestLocNum);
}

fs.readFile('day5.txt', 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	} else {
	    doTheChallenge(data.split("\n"));
	}
})