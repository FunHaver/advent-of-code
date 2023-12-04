const fs = require('node:fs');

const notNumberOrPeriod = /[^0-9\.]/

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
        return false;
    } else if(row === 0){
        rowBelow = matrix[row + 1];
    } else if(row === matrix.length - 1) {
        rowAbove = matrix[row - 1];
    } else {
        rowAbove = matrix[row - 1];
        rowBelow = matrix[row + 1];
    }

    let charFound = null;
    if(rowAbove){
        for(let i = leftBound; i <= rightBound; i++) {
            let char = rowAbove[i];
            if(char.match(notNumberOrPeriod)){
                charFound = true;
                break;
            }
        }
    }

    if(rowBelow){
        for(let i = leftBound; i <= rightBound; i++) {
            let char = rowBelow[i];
            if(char.match(notNumberOrPeriod)){
                charFound = true;
                break;
            }
        }
    }
    return charFound;

}

const beside = function(matrix, row, startingPosition, endingPosition){
    const atStart = (startingPosition === 0);
    const atEnd = (endingPosition === matrix[row].length - 1);
    if(atStart && atEnd){
        return false;
    } else if(atStart){
        //only look right
        return matrix[row][endingPosition+1].match(notNumberOrPeriod);
    } else if(atEnd){
        //only look left
        return matrix[row][startingPosition - 1].match(notNumberOrPeriod);
    } else {
        //look both ways
        return matrix[row][endingPosition+1].match(notNumberOrPeriod) || matrix[row][startingPosition - 1].match(notNumberOrPeriod);
    }
}

const hasAdjacentChar = function(matrix, row, startingPosition, endingPosition){
    if(aboveOrBelow(matrix, row, startingPosition, endingPosition)) {
        return true;
    } else if(beside(matrix, row, startingPosition, endingPosition)) {
        return true;
    } else {
        return false;
    }
}

const doTheChallenge = function(matrix){
    let accum = 0;
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
                    if(hasAdjacentChar(matrix, i, j - numberString.length, j - 1)){
                        accum += parseInt(numberString);
                    } 
                    numberString = '';
                } else if (j === row.length - 1){
                    if(hasAdjacentChar(matrix, i, j - numberString.length + 1, j)){
                        accum += parseInt(numberString);
                    }
                    numberString = '';
                }
            }
            
        }
    }
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