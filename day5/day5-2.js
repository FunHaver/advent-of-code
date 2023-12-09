const fs = require('node:fs');

//Wow this ran for like 20 mins

const parseAlmanac = function(lines){
    let currentMap = ''
    let alm = {};
    lines.forEach(line => {
        if(line.match(/seeds:/)){
            const seedNums = line.split(":")[1].split(" ").filter(seed => seed.length > 0)
            currentMap = "seeds"
            alm[currentMap] = [];
            for(let i = 0; i < seedNums.length; i++){
                if(i % 2 === 0){
                    alm[currentMap].push({
                        initialSeed: parseInt(seedNums[i]),
                        range: 0
                    });
                } else {
                    alm[currentMap][Math.floor(i / 2)]["range"] = parseInt(seedNums[i]);
                }
            }
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

const calculateSeedRangeToLowestLocation = function(seedRange, almanac){
    let lowestInRange = null;
    for(let i = 0; i < seedRange.range; i++){
        const seed = seedRange.initialSeed + i;
        // console.log(seed);
        const soilNum = getAlmanacNumber(seed, almanac["seed-to-soil"]);
        const fertNum = getAlmanacNumber(soilNum, almanac["soil-to-fertilizer"]);
        const waterNum = getAlmanacNumber(fertNum, almanac["fertilizer-to-water"]);
        const lightNum = getAlmanacNumber(waterNum, almanac["water-to-light"]);
        const tempNum = getAlmanacNumber(lightNum, almanac["light-to-temperature"]);
        const humNum = getAlmanacNumber(tempNum, almanac["temperature-to-humidity"]);
        const locNum = getAlmanacNumber(humNum, almanac["humidity-to-location"]);

        if(lowestInRange === null || locNum < lowestInRange){
            lowestInRange = locNum;
        }

        if(i % 1000000 === 0){
            process.stdout.write(". ");
        }
    }
    console.log("Finished seedRange")
    console.log(seedRange)
    return lowestInRange;
}

const doTheChallenge = function(data) {
    let almanac = parseAlmanac(data);
    let lowestLocNum = null;
    for(let i = 0; i < almanac["seeds"].length; i++){
        const locNum = calculateSeedRangeToLowestLocation(almanac["seeds"][i], almanac);
        if(lowestLocNum === null){
            lowestLocNum = locNum;
        } else if (lowestLocNum > locNum){
            lowestLocNum = locNum
        }
    }
    // console.log(almanac);
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