var a = ['A', '6', 'D', 'B', '9', 'C'];
var b = a.sort();
console.log(numCodeArr(a.sort());

function numCodeArr(codeArr) {
    let result = codeArr.map(function(code) {
        switch(code) {
            case "E":
                return "14";
            case "D":
                return "13";
            case "C":
                return "12";
            case "B":
                return "11";
            case "A":
                return "10";
            default:
                return code;
        }
    })
    return result;
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
