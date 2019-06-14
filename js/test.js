//?string comparison
var cards= [
    {
    code: "AD",
    suit: "DIAMONDS",
    value: "ACE",
    },
    {
    code: "0D",
    suit: "DIAMONDS",
    value: "10",
    },
    {
    code: "AD",
    suit: "SPADE",
    value: "JACK",
    },
    {
    code: "3D",
    suit: "DIAMONDS",
    value: "3",
    },
    {
    code: "KD",
    suit: "DIAMONDS",
    value: "KING",
    },
    {
    code: "8H",
    suit: "HEARTS",
    value: "8",
    },
    {
    code: "QD",
    suit: "DIAMONDS",
    value: "QUEEN",
    }
    ];

[suitcount, numcount] = getHandStat(cards)
console.log(suitcount);
console.log(numcount);
var result = getHandRank(cards);
console.log(result);

function getHandRank(hand) {
    let suitcount = {};
    let numbercount = {};
    let numKeys = [];
    let fullArr = []; 
    let fk = [0,[]]; //todo four kind: 7
    let fh = [0,[]]; //todo full house:6
    let tk = [0,[]]; //todo three kind
    let pair = [0,[]]; //todo tp: 2, one pair: 1
    let straight;
    let flush;
    let sf;
    let temp;

    [suitcount, numbercount] = getHandStat(hand); //* numArr

    //? check fk, fh, tk, pair
    for (let key in numbercount) {
        switch (numbercount[key]) {
            case 1:
                fullArr.push(key);
                break;
            case 2:
                fullArr.push(key, key);
                pair[0] = true;
                pair[1].push(key);
                break;
            case 3:
                fullArr.push(key, key, key); //! 2 3cards.
                tk[0] = true;
                tk[1].push(key);
                break;
            case 4:
                //* no need push to resultArray
                fk[0] = true;
                fk[1].push(key)
        }

    }
 

    numKeys = Object.keys(numbercount); //*sorted, numArr
    let codeKeys = CodifyNumArr(numKeys); //*sorted, codeArr
    straight = checkStraight(numKeys); //*decent, numArr passed
    flush = checkFlush(suitcount); //* passed, unsorted numArr;
    //? sort flush[1]
    let flusharry = CodifyNumArr(flush[1]).sort();
    flusharry = flusharry.map(NamCode)

    sf = checkStraight(flush[1].sort()); //* passed;

    if (sf[0]) {
        if (sf[1][4] === 'E') {
            return [9, CodifyNumArr(sf[1].reverse().join('')), 'Royal Flush, Ace high!']
        }
        else {
            return [8, CodifyNumArr(sf[1].reverse().join('')), 'Straight Flush, ' + NamCode(sf[1][4]) + ' high!']
        }
    }

    if (fk[0]) {
        let temp = CodifyNumArr(fk[1])
        return [7, temp[0], 'Four of a Kind ' + NamCode(temp[0]) + ' high!']
    }

    //*full house
    if (tk[0] && pair[0]) {
        pair[1].length === 1 ? fh[1].push(tk[1][0], pair[1][0]) : fh[1].push(tk[1][0], Math.max(pair[1][0], pair[1][1]));
        return [6, CodifyNumArr(fh[1]).join(''), 'Full House ' + NamCode(CodifyNumArr(fh[1])[0]) + ' high!'];
    } 
    
    if (tk[1].length === 2) {
        tk[1][0] > tk[1][1] ? fh[1].push(tk[1][0], tk[1][1]) : fh[1].push(tk[1][1], tk[1][0]);
        return [6, CodifyNumArr(fh[1]).join(''), 'Full House ' + NamCode(CodifyNumArr(fh[1])[0]) + ' high!'];
    }

    if (flush[0]) {
        temp = CodifyNumArr(flush[1]).sort().reverse().slice(0, 5);
        return [5, temp.join(''), 'Flush ' + NamCode(temp[0]) + ' high!'];
    }

    if (straight[0]) {
        temp = CodifyNumArr(straight[1]);
        return [4, temp.join(''), 'Straight ' + NamCode(temp[0]) + ' high!'];
    }

    if (tk[0]) {
        temp = CodifyNumArr(tk[1]);
        return [3, temp.join(''), 'Three of a Kind' + NamCode(temp[0]) + ' high!']
    }

    //* two pairs
    if (pair[1].length >= 2) {
        temp = CodifyNumArr(pair[1]);
        temp.sort().reverse().slice(0,2);
        let i = 0;
        while (temp.includes(codeKeys[i])) {
            i++
        }
        
        return [2, temp.join('') + codeKeys[i], 'Two Pairs ' + NamCode(temp[0]) + ' ' + NamCode(temp[1]) + ' with ' + NamCode(codeKeys[i])];
    }

    //* one pair
    if (pair[1].length === 1) {
        temp = CodifyNumArr(pair[1]);
        let tempArr = [];
        let i = 0;
        while (tempArr.length < 3 && i < codeKeys.length - 1) {
            if (codeKeys.reverse()[i] !== temp[0]) {
                tempArr.push(codeKeys.reverse()[i]);
            }
            i++;
        }
        
        return [1, temp.join('') + tempArr.sort().reverse().join(''), 'One Pair ' + NamCode(temp[0])];
    }

    return [0, codeKeys.reverse().join(''), 'High Card'];    
}

//*passed
function getHandStat(hand) {
    let suitcount = {};
    let numbercount = {};
    hand.forEach(function (card) {
        //todo orgnize by suit
        if (!suitcount[card.suit]) {
            suitcount[card.suit] = [];
            suitcount[card.suit].push(numCardCode(card));
            ;
        }
        else {
            suitcount[card.suit].push(numCardCode(card));
        }
        //todo orgnize by number
        if (!numbercount[numCardCode(card)]) {
            numbercount[numCardCode(card)] = 1;
        }
        else {
            numbercount[numCardCode(card)]++;
        }
    });
    return [suitcount, numbercount];
}

//*passed
function CodifyNumArr(numArr) {
    let result = numArr.map(function(num) {
        switch(num) {
            case "14":
                return "E";
            case "13":
                return "D";
            case "12":
                return "C";
            case "11":
                return "B";
            case "10":
                return "A";
            default:
                return num;
        }
    })
    return result;
}

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
                return "1";
            case "A":
                return "10";
            default:
                return code;
        }
    })
    return result;
}

function numCardCode(card) {
    let value;

    if (card.code.charAt(0) === '0') {
        return "10";
    }
    switch(card.code.charAt(0)) {
        case "A":
            value = "14";
            break;
        case "K":
            value = "13";
            break;
        case "Q":
            value = "12";
            break;
        case "J":
            value = "11";
            break;
        default:
            value = card.code.charAt(0);
    }
    return value;
}

//*passed
function checkStraight(acearr, count = 1, index = acearr.length - 1) {
    let currIndex = index - count;
    if (acearr.length === 0) {
        return [0, []];
    }
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

function checkFlush(suitcount) {
    for (let suit in suitcount) {
        if (suitcount[suit].length >= 5) {
            return [5, suitcount[suit]]
        }
    }
    return [0,[]]
}

function NamCode(code) {
    let value;
    switch(code) {
        case "E":
            value = "ACE";
            break;
        case "D":
            value = "KING";
            break;
        case "C":
            value = "QUEEN";
            break;
        case "B":
            value = "JACK";
            break;
        case "A":
            value = "10";
        default:
            value = code;
    }
    return value;
}


var card2 = [
    {code: "AH", suit: "HEARTS", value: "ACE"},
    {code: "JH", suit: "HEARTS", value: "JACK"},
    {code: "JD", suit: "DIAMONDS", value: "JACK"},
    {code: "KC", suit: "CLUBS", value: "KING"},
    {code: "9S", suit: "SPADES", value: "9"},
    {code: "AD", suit: "DIAMONDS", value: "ACE"},
    {code: "QD", suit: "DIAMONDS", value: "QUEEN"}
    
]

console.log('A' < 'B'); //true

console.log('1' < 'A');




//*variable scope
// var num = 2;

// function add() {
//     num++;
// }

// add();
// console.log(num);


//*below passed
// function sayHi(n) {
//     if (n === 10) {
//         return;
//     }

//     setTimeout(function() {
//         console.log(n + ' say hi!');
//     }, n*2000);
//     return sayHi(n+1);
// }

// sayHi(1);

// print = (j) => {
//   console.log(a[j]);
// }

// console.log(loopDelayFunction(print, 5, 800));

// function loopDelayFunction(func, n, delay, j = 0) {
//   for (var i = 0; i < n; i++) {
//     (function (i) {
//       setTimeout(function () {
//         func(j);
//         j++;
//       }, delay * i);
//     })(i);
//   };
//   return delay * n;
// }
