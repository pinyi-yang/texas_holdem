//* variable fields
var cardDrawsurl = "https://deckofcardsapi.com/api/deck/new/draw/?count=";
var game;
var backurl = "/img/back.png";


//* DOM fields
var totalBetEl = document.getElementById('betnum');
var dealerBoardEl = document.getElementById('dealer');
var playerCardsElArr = document.getElementsByClassName('playercards');

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
    game = new GameInfo();
    console.log(game);
    nextTurn();
    startBtnEl.style.display = 'none';
    
}

//todo: 1. clear totalbet; 2.clear dealercards;
//todo: 3. clear player cards 4. get new cards

function nextTurn() {
    totalBetEl.textContent = '0';
    dealerBoardEl.textContent = "";
    for (let playerhand of playerCardsElArr) {
        playerhand.textContent='';
        console.log(playerhand);
    }
    resetCtlDivEl.style.display = 'none';
    betCtlDivEl.style.display = 'block';
    console.log(game.players.length);
    
    //* get cards from API and store in game object
    // getCardsAPI();

    //? 1. big blind and small blind 
    //? 2. distribute card
    displayHandCards(backurl, backurl);

}

function displayHandCards(url0, url1) {
    console.log('distribute cards');
    for (let player of playerCardsElArr) {
        let card0 = document.createElement('img');
        let card1 = document.createElement('img');
        card0.src = url0;
        card1.src = url1;
        
        player.appendChild(card0);
        player.appendChild(card1);
        console.log("player: " + player);
    }
}

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
