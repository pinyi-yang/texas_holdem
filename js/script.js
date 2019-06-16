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
var playerMsgElArr = document.getElementsByClassName('msg');
var dealerCardsDivElArr = document.getElementsByClassName('dealercards');
var resetCtlDivEl = document.getElementById('resetctldiv');
var gameMsgDivEl = document.getElementsByClassName('gamemsg')[0];
var gameMsgEl = document.getElementById('gamemsgcon');

//* buttons
var startBtnEl = document.getElementById('startbtn');
var foldBtnEl = document.getElementById('foldbtn');
var callBtnEl = document.getElementById('callbtn');
var scaleDivEl = document.getElementsByClassName('scalediv')[0];
var showScaleBtnEl = document.getElementById('showscale');
var scaleEl = document.getElementById('myRange');
var scaleValueEl = document.getElementById("scalevalue");
var raiseBtnEl = document.getElementById('raisebtn');
var betCtlDivEl = document.getElementById('betctldiv');
var continueBtnEl = document.getElementById('continuebtn');
var endBtnEl = document.getElementById('endbtn');
var resetCtlDivEl = document.getElementById('resetctldiv');



//* event listener
startBtnEl.addEventListener('click', newGame);
continueBtnEl.addEventListener('click', nextTurn);

callBtnEl.addEventListener('click', function() {
    game.Call(game.players[2]);
    setTimeout(function() {
        if (game.currentTurnIDArr[game.turnEndIndex] === 2) {
        game.stageNum++;
        nextStage() 
    } else {
        //* get to next player
        game.turnCurrIndex < game.currentTurnIDArr.length-1? game.turnCurrIndex++ : game.turnCurrIndex = 0;
        askNextPlayerBet();
    }
    },600);

    betCtlDivEl.classList.add('hidden');
});

foldBtnEl.addEventListener('click', function() {
    game.Fold(game.players[2]);
    setTimeout(function() {
    if (game.currentTurnIDArr[game.turnEndIndex] === 2) {
        game.stageNum++;
        nextStage() 
    } else {
        //* get to next player
        game.turnCurrIndex < game.currentTurnIDArr.length-1? game.turnCurrIndex++ : game.turnCurrIndex = 0;
        askNextPlayerBet();
    }
    },600);
    betCtlDivEl.classList.add('hidden');    
});

showScaleBtnEl.addEventListener('click', showScale);
raiseBtnEl.addEventListener('click', gamerRaise);

scaleEl.addEventListener('mousemove', function() {
    scaleValueEl.textContent = "Value: $" + scaleEl.value;
});





//* functions
//todo create a new game
function newGame() {
    game = new PokerGame();
    game.totalBetEl = totalBetEl;
    // console.log(game);
    nextTurn();
    startBtnEl.classList.add('hidden');
    //* initiate player fundsEl and cardsEl
    for (let i = 0; i < game.players.length; i++) {
        game.players[i].fundsEl = playerFundsElArr[i];
        game.players[i].handsEl = playerCardsElArr[i];
        game.players[i].msgEl = playerMsgElArr[i];
    }
    game.updatePlayersFunds();
    // console.log(game.players[2]);;
}

//todo: 1. clear totalbet; 2.clear dealercards;
//todo: 3. clear player cards 4. get new cards

function nextTurn() {
    totalBetEl.textContent = '0';
    for (card of dealerCardsDivElArr) {
        card.textContent = '';
    }
    for (let playerhand of playerCardsElArr) {
        playerhand.textContent='';
        // console.log(playerhand);
    }
    //* gamer out of funds
    if (game.players[2].funds === 0 ) {
        gameMsgEl.textContent = "GAME OVER: \r\n... You are out of funds! Try again!"
        return;
    }

    resetCtlDivEl.classList.add('hidden');
    gameMsgDivEl.classList.add('hidden');
    for (let element of playerMsgElArr) {
        element.classList.remove('msgshow');
    }

    //* take out players with no funds
    for (let id of game.currentPlayerIDArr) {
        if (game.players[id].funds <= 0) {
            game.players[id].popPlayerMsg("I'm Out");
            let index = game.currentPlayerIDArr.indexOf(id);
            game.currentPlayerIDArr.splice(index, 1);
        } 
    }

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
            
            //todo initiate game variable for each turn
            game.initiGameVar();
//* =================Stage Control ================================
            game.stageNum = 0; //!!!stage controller
    //*======================================================
            //? 1. big blind and small blind 
            //? 2. distribute card
            game.startBlind(); 
            game.allCards = jsonData.cards;

            
            // setTimeout(loopDelayFunction, 2400);
            setTimeout(function() {
                loopDelayFunction(setCardBack, game.currentTurnIDArr, 800);
            }, 2400);
            //!total delay 6400
            delay = game.currentTurnIDArr.length* 800 + 2400;
            
            game.dealercards = jsonData.cards.slice(10);
            setTimeout(function() {
                console.log('show gamer hand');
                game.players[2].showCards();
            }, delay + 800);
            console.log(game.dealercards);
            // setTimeout(game.newTurn, delay + 1600);

            //? player from currrentplayer start bet
            console.log('total delay ' + (delay + 800));
            console.log(game.dealercards);
            setTimeout(function() {
                nextStage();
                console.log('current stage is ' + game.stageNum);
            }, delay + 800);
        });
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

function loopDelayFunction(func, currIDArray, delay, j = 0) {
    for (var i = 0; i < currIDArray.length; i++) {
      (function (i) {
        setTimeout(function () {
          func(currIDArray[j]);
          j++;
        }, delay * i);
      })(i);
    } ;
    return delay * currIDArray.length;
  }

function setCardBack(j) {
    game.players[j].hands = game.allCards.slice(2 * j, 2 * (j + 1));
    game.players[j].showCards("img/back.png", "img/back.png");
    j++;
}

function nextStage () {
    if (game.stageNum !== 0) {
        game.currentBet = 0;
        for (player of game.players) {
            player.playerBet = 0;
        }
        console.log('player 2 bet is ' + game.players[2].playerBet);
    }
    console.log("there are " + game.currentTurnIDArr.length + "players in current turn.");

    //? if last player last stage raised
    if (game.lastPlayerRaised) {
        game.lastPlayerRaised = false;
        askNextPlayerBet();
        game.stageNum--;
        return;
    }

    //? if only 1 player, end game;
    if (game.currentTurnIDArr.length <= 1) {
        console.log('Only 1 player left, show dealer cards');
        switch(game.stageNum) {
            case 1:
                showNextDealerCard(0,5);
                break;
            case 2:
                showNextDealerCard(3,5);
                break;
            case 3:
                showNextDealerCard(4,5);           
        }
        setTimeout(finishCurrTurn, 5000);

    } else {
        console.log('Current Stage is Stage ' + game.stageNum);
        game.initTurnIndex();
        console.log(game.turnStartIndex, game.turnCurrIndex, game.turnEndIndex);
    
        switch(game.stageNum) {
            case 0:
                console.log('After get hand cards. Start Bet');
                askNextPlayerBet(); //! at the very end.
                break;
            case 1:
                console.log('Show flop cards. Start bet');
                showNextDealerCard(0, 3);
                game.initTurnIndex();
                setTimeout(askNextPlayerBet, 2000);
                break
            case 2:
                console.log('Show turn card. Start bet');
                showNextDealerCard(3,4);
                game.initTurnIndex();
                setTimeout(askNextPlayerBet, 2000);
    
                break;
            case 3:
                console.log('Show river card. Start bet');
                showNextDealerCard(4,5);
                game.initTurnIndex();
                setTimeout(askNextPlayerBet, 2000);
                break;        
            case 4:
                finishCurrTurn();

    }

            
            
    }
    return;
    // if (this.currentID === this.startBetID) {
    //     this.stageNum++;
    //     return;
    // }
}

function finishCurrTurn() {
    console.log('Show cards in hand. End turn');
    game.currentTurnIDArr = game.currentTurnIDArr.concat(game.currTurnSHPlayersID);
    if (game.currentTurnIDArr.length !== 1 || game.currentTurnIDArr[0] !== 2) {
        for (let id of game.currentTurnIDArr) {
            if (id !== 2) {
                console.log('show cards of player ' + id);
                game.players[id].showCards();
            }
        }
    }
    console.log(game.currentTurnIDArr);
    game.getResults(); //*passed
    setTimeout(function () {
        game.endTurn();
        game.stageNum = 0;
        resetCtlDivEl.classList.remove('hidden');
        gameMsgEl.textContent = game.winmsg;
        gameMsgDivEl.classList.remove('hidden');
    }, 3000);
}

function askNextPlayerBet(delay = 1000) {
    let id = game.currentTurnIDArr[game.turnCurrIndex]
    game.players[id].msgEl.textContent = '';
    game.players[id].msgEl.classList.remove('msgpop');
    game.players[id].msgEl.classList.remove('selectplayer');
    game.players[id].msgEl.classList.add('selectplayer');

    
    if (id === 2) {
        betCtlDivEl.classList.remove('hidden');
        console.log("gamer's turn");
        return;
    }

    //? end of stage, all players finish bet 
    if (game.turnCurrIndex === game.turnEndIndex) {
        setTimeout(function() {
            game.computerBet(game.players[id])
            console.log('go to next stage');
        }, delay + 2000);
        
        game.stageNum++;
        game.currStageSHPlayers = [];
        return setTimeout(nextStage, 3500 + delay);
       
    }

    // let id = game.currentTurnIDArr[turnCurrIndex];
    //? get to gamer, stop. game will control by buttons

    //? not gamer, computer will play
    //? don't do anything if player showHand
    setTimeout(function() {
        console.log('ask player' + id);
        // if (game.players[id].showhand) {
        // game.turnCurrIndex < game.currentTurnIDArr.length-1? game.turnCurrIndex++ : game.turnCurrIndex = 0;
        // }
        game.computerBet(game.players[id]);
        game.turnCurrIndex < game.currentTurnIDArr.length-1? game.turnCurrIndex++ : game.turnCurrIndex = 0;
        console.log(game.turnStartIndex, game.turnCurrIndex, game.turnEndIndex);
        delay += 2000;
        return askNextPlayerBet();
    }, 1000);

    
}
function increaseStage() {
    game.stageNum++;
}

function showScale() {
    console.log('show scale bar');
    scaleDivEl.classList.remove('hidden');
    // scaleEl.classList.remove('hidden');
    raiseBtnEl.classList.remove('hidden');
    showScaleBtnEl.classList.add('hidden');
    let call = game.currentBet - game.players[2].playerBet;
    let max = game.players[2].funds - call;
    scaleEl.max = max;
    scaleEl.min = 0;
    scaleEl.value = 0;

}

function gamerRaise() {
    console.log('hide scale bar and bet');
    let bet = parseInt(scaleEl.value);
    console.log('bet is ' + bet);

    if (bet !== 0) {
        if (bet === game.players[2].funds  + game.players[2].playerBet - game.currentBet) {
            game.showHands(game.players[2]);
        } else {
            game.Raise(game.players[2], bet);
        
        }
        game.turnCurrIndex < game.currentTurnIDArr.length-1? game.turnCurrIndex++ : game.turnCurrIndex = 0;        
        askNextPlayerBet();
        // game.currentTurnIDArr[game.turnEndIndex] === 2 ? nextStage() : askNextPlayerBet();
        betCtlDivEl.classList.add('hidden');

    }

    scaleDivEl.classList.add('hidden');
    raiseBtnEl.classList.add('hidden');
    showScaleBtnEl.classList.remove('hidden');
}

function showNextDealerCard(i, end) {
    if (i === end) {
        return;
    }
    console.log('show card #' + i);
    let url = game.dealercards[i].image;
    let card = document.createElement('img');
    card.src = url;
    dealerCardsDivElArr[i].appendChild(card);
    i++;
    return setTimeout(function(){
        showNextDealerCard(i, end);
    }, 800);
}