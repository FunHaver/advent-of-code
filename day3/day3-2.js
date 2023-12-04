const fs = require('node:fs');

const isStar = /\*/

const aboveOrBelow = function(matrix, row, startingPosition, endingPosition){
    const noDiagonalLeft = (startingPosition === 0);
    const noDiagonalRight = (endingPosition >= matrix[row].length - 1);
    let leftBound;
    let rightBound;
    if(noDiagonalLeft && noDiagonalRight) {
        leftBound = startingPosition;
        rightBound = endingPosition;
    } else if(noDiagonalLeft) {
        leftBound = startingPosition;
        rightBound = endingPosition + 1;
    } else if(noDiagonalRight) {
        leftBound = startingPosition - 1;
        rightBound = endingPosition;
    } else {
        leftBound = startingPosition - 1;
        rightBound = endingPosition + 1;
    }

    let rowAbove = null;
    let rowBelow = null;
    if(row === 0 && row === matrix.length - 1){
        return '';
    } else if(row === 0){
        rowBelow = matrix[row + 1];
    } else if(row === matrix.length - 1) {
        rowAbove = matrix[row - 1];
    } else {
        rowAbove = matrix[row - 1];
        rowBelow = matrix[row + 1];
    }

    let starCoords = "";
    if(rowAbove){
        for(let i = leftBound; i <= rightBound; i++) {
            let char = rowAbove[i];
            if(char.match(isStar)){
                starCoords = `${row - 1},${i}`;
                break;
            }
        }
    }

    if(rowBelow){
        for(let i = leftBound; i <= rightBound; i++) {
            let char = rowBelow[i];
            if(char.match(isStar)){
                starCoords = `${row + 1},${i}`;
                break;
            }
        }
    }
    return starCoords;

}

const beside = function(matrix, row, startingPosition, endingPosition){
    const atStart = (startingPosition === 0);
    const atEnd = (endingPosition === matrix[row].length - 1);
    let starCoords = '';
    if(atStart && atEnd){
        return '';
    } else if(atStart){
        //only look right
        matrix[row][endingPosition+1].match(isStar) ? starCoords = `${row},${endingPosition+1}` : '';
        return starCoords;
    } else if(atEnd){
        //only look left
        matrix[row][startingPosition - 1].match(isStar) ? starCoords = `${row},${startingPosition-1}` : '';
        return starCoords;
    } else {
        //look both ways
        if(matrix[row][endingPosition+1].match(isStar) ){
            return `${row},${endingPosition+1}`;
        } else if (matrix[row][startingPosition - 1].match(isStar)){
            return `${row},${startingPosition - 1}`;
        } else {
            return '';
        }
    }
}

const hasAdjacentStar = function(matrix, row, startingPosition, endingPosition){
    let aboveOrBelowCoords = aboveOrBelow(matrix, row, startingPosition, endingPosition);
    let besideCoords = beside(matrix, row, startingPosition, endingPosition);
    if(aboveOrBelowCoords.length > 0) {
        return aboveOrBelowCoords;
    } else if(besideCoords.length > 0) {
        return besideCoords;
    } else {
        return '';
    }
}

const doTheChallenge = function(matrix){
    let accum = 0;
    let starCoordsMap = {};

    for(let i = 0; i < matrix.length; i++){
        let row = matrix[i];
        let numberString = '';
        for(let j = 0; j < row.length; j++){
            let char = row[j];
            if(char.match(/[0-9]/)){
                numberString += char;
            }
                if(numberString.length > 0){
                if(row[j].match(/[^0-9]/)){
                    const starCoords = hasAdjacentStar(matrix, i, j - numberString.length, j - 1);
                    if(starCoords.length > 0){
                        starCoordsMap[starCoords] ? starCoordsMap[starCoords].push(numberString) : starCoordsMap[starCoords] = [numberString];
                    } 
                    numberString = '';
                } else if (j === row.length - 1){
                    const starCoords = hasAdjacentStar(matrix, i, j - numberString.length + 1, j);
                    if(starCoords.length > 0){
                        starCoordsMap[starCoords] ? starCoordsMap[starCoords].push(numberString) : starCoordsMap[starCoords] = [numberString];
                    } 
                    numberString = '';
                }
            }
            
        }
    }

    for(const [key, value] of Object.entries(starCoordsMap)){
        if(starCoordsMap[key].length === 2){
            accum += parseInt(starCoordsMap[key][0]) * parseInt(starCoordsMap[key][1]);
        }
    }
    // console.log(starCoordsMap);
    console.log(accum);
}

fs.readFile('day3.txt', 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	} else {
        const rowStrings = data.split("\n");
        const matrix = [];
        rowStrings.forEach(rowString=> {
            const rowArray = rowString.split("");
            matrix.push(rowArray);
        })
	    doTheChallenge(matrix);
	}
})