var a = ['4', '6', '7', '8', '9', '12'];
var b = checkStraight(a);
console.log(b);

function checkStraight(acearr, count = 1, index = acearr.length - 1) {
    let currIndex = index - count;
    if (parseInt(acearr[currIndex + 1]) - parseInt(acearr[currIndex]) === 1) {
        count++;
    } else {
        count = 1;
        index = currIndex;
    }

    if (count === 5) {
        let resultArr = acearr.slice(currIndex, index + 1).reverse();
        return [4, resultArr];
    }

    if (currIndex === 0) {
        return [0, []];
    }
    
    return checkStraight(acearr, count, index);
}

// var a = {
//     '12': 2,
//     '10': 1,
//     '8': 1,
//     '11': 2,
//     '9':1,
//     '13':1
// }
// if (!0) {
//     console.log(checkStraight(Object.keys(a)));
// }
// function checkStraight(acearr, count = 1, index = acearr.length - 1) {
//     let currIndex = index - count;
//     if (parseInt(acearr[currIndex + 1]) - parseInt(acearr[currIndex]) === 1) {
//         count++;
//     } else {
//         count = 1;
//         index = currIndex;
//     }

//     if (count === 5) {
//         let resultArr = acearr.slice(currIndex, index + 1).reverse();
//         return [4, resultArr];
//     }

//     if (currIndex === 0) {
//         return [0, []];
//     }
    
//     return checkStraight(acearr, count, index);
