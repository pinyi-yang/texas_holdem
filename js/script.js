//* variable fields
var cardDrawsurl = "https://deckofcardsapi.com/api/deck/new/draw/?count=";
var game;
var backurl = "/img/back.png";
var delay = 0;



//* DOM fields
var totalBetEl = document.getElementById('betnum');
var dealerBoardEl = document.getElementById('dealer');
var playerCardsElArr = document.getElementsByClassName('playercards');
var playerFundsElArr = document.getElementsByClassName('playerfund');


//* buttons
var startBtnEl = document.getElementById('startbtn');
var foldBtnEl = document.getElementById('foldbtn');
var callBtnEl = document.getElementById('callbtn');
var raiseBtnEl = document.getElementById('raisebtn');
var betCtlDivEl = document.getElementById('betctldiv');
var continueBtnEl = document.getElementById('continuebtn');
var endBtnEl = document.getElementById('endbtn');
var resetCtlDivEl = document.getElementById('resetctldiv');


//* event listener
startBtnEl.addEventListener('click', newGame);
continueBtnEl.addEventListener('click', nextTurn);





//* functions
//todo create a new game
function newGame() {
    game = new PokerGame();
    game.totalBetEl = totalBetEl;
    // console.log(game);
    nextTurn();
    startBtnEl.style.display = 'none';
    //* initiate player fundsEl and cardsEl
    for (let i = 0; i < game.players.length; i++) {
        game.players[i].fundsEl = playerFundsElArr[i];
        game.players[i].handsEl = playerCardsElArr[i];
    }
    game.updatePlayersFunds();
    // console.log(game.players[2]);;
}

//todo: 1. clear totalbet; 2.clear dealercards;
//todo: 3. clear player cards 4. get new cards

function nextTurn() {
    totalBetEl.textContent = '0';
    dealerBoardEl.textContent = "";
    for (let playerhand of playerCardsElArr) {
        playerhand.textContent='';
        // console.log(playerhand);
    }
    resetCtlDivEl.style.display = 'none';
    betCtlDivEl.style.display = 'block';
    game.currentTurnIDArr = game.currentPlayerIDArr;
    // console.log(game.currentTurnIDArr);
    // console.log(game.players.length);
    
    //* get cards from API and store in game object
    fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=" + (game.players.length * 2 + 5))
        .then(function (responseData) {
            console.log('get cards');
            return responseData.json();
        })
        .then(function (jsonData) {
            // console.log("cards are"); //* passed
            // console.log(jsonData.cards); //* passed
            game.stageNum = 0;
            //? 1. big blind and small blind 
            //? 2. distribute card
            game.startBlind(); //!delay 1600
            game.allCards = jsonData.cards;

            
            // setTimeout(loopDelayFunction, 2400);
            setTimeout(function() {
                loopDelayFunction(setCardBack, game.currentPlayerIDArr, 800);
            }, 2400);
            //!total delay 6400
            delay = game.currentPlayerIDArr.length* 800 + 2400;
            // setTimeout(function() {
            //     for (let i = 0; i < game.players.length; i++) {
            //     game.players[i].hands = game.allCards.slice(2 * i, 2 * (i + 1));
            //     game.players[i].showHands("img/back.png", "img/back.png");
                // console.log(game.players[i].hands);
                    //*passed
            // }}, delay*4)
            
            game.dealercards = jsonData.cards.slice(10);
            setTimeout(game.players[2].showCards, delay + 800);
            console.log(game.dealercards);
            setTimeout(game.newTurn, delay + 1600);
        });


    // displayHandCards(backurl, backurl);
    // for (let player of game.players) {
    //     player.showHands(backurl, backurl);
    // }

}

//! abandoned
// function displayHandCards(url0, url1) {
//     console.log('distribute cards');
//     for (let player of playerCardsElArr) {
//         let card0 = document.createElement('img');
//         let card1 = document.createElement('img');
//         card0.src = url0;
//         card1.src = url1;
        
//         player.appendChild(card0);
//         player.appendChild(card1);
//         console.log("player: " + player);
//     }
// }

function getCardsAPI() {
    fetch(cardDrawsurl + (game.players.length * 2 + 5))
        .then(function (responseData) {
            console.log('get cards');
            return responseData.json();
        })
        .then(function (jsonData) {
            // console.log("cards are"); //* passed
            // console.log(jsonData.cards); //* passed
            game.allCards = jsonData.cards;
            for (let i = 0; i < game.players.length; i++) {
                game.players[i].hands = game.allCards.slice(2 * i, 2 * (i + 1));
                // console.log(game.players[i].hands); //*passed
            }
            game.dealercards = jsonData.cards.slice(10);
            console.log(game.dealercards);
            
        });
}
//! origin loop delay, replace by following
// function loopDelayFunction() {
//     let j = 0;
//     for (i = 0; i < 5; i++) {
//         (function (i) {
//             setTimeout(function() {
//                 console.log(j);
//                 game.players[j].hands = game.allCards.slice(2 * j, 2 * (j + 1));
//                 game.players[j].showHands("img/back.png", "img/back.png");
//                 j++;
//             }, 800 * i);
//         })(i);
//     }
// }

function loopDelayFunction(func, currIDArray, delay, j = 0) {
    for (var i = 0; i < currIDArray.length; i++) {
      (function (i) {
        setTimeout(function () {
          func(currIDArray[j]);
          j++;
        }, delay * i);
      })(i);
    };
    return delay * currIDArray.length;
  }

  function setCardBack(j) {
    game.players[j].hands = game.allCards.slice(2 * j, 2 * (j + 1));
    game.players[j].showCards("img/back.png", "img/back.png");
    j++;
  }