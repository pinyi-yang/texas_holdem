class PokerGame {
    constructor() {
        this.allCards;
        this.dealerCards;
        this.bigBlindID = 0;
        this.startBetID = 0;
        this.quitPlayersID = [];
        this.stageNum = 1;
        this.currentBet;
        this.currentTotalBet = 0;
        this.totalBetEl;
        this.players = (function(){
            let gamers = []
            for (let i = 0; i < 5; i++) {
                gamers.push(new PokerPlayer());
                // players.push(new PokerPlayer('player'+(i+1)));
            }
            return gamers
        })(); //! () is necessary!!
        // this.updatePlayersFunds = this.updatePlayersFunds.bind(this);
        // this.startBlind = this.startBlind.bind(this);
        this.updatePlayersFunds = this.updatePlayersFunds.bind(this);
        this.startBlind = this.startBlind.bind(this);
        this.updateTotalBet = this.updateTotalBet.bind(this);
        this.smallBind = this.smallBind.bind(this);
    } //end of contributor
    

    updatePlayersFunds() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].fundsEl.textContent = '$ ' + this.players[i].funds;
        }
    }
    updateTotalBet() {
        console.log('total bet: ' + this.currentTotalBet);
        this.totalBetEl.textContent = '$ ' + this.currentTotalBet;
    }

    startBlind() {
        this.players[this.bigBlindID].Bet(1);
        // console.log(this.bigBlindID,this.players[this.bigBlindID]);
        this.currentTotalBet +=1;
        console.log(this.currentTotalBet);
        setTimeout(this.updateTotalBet, 800);
        
        
        setTimeout(this.smallBind, 1600);
    }


    smallBind() {
        if (this.bigBlindID + 1 >= 5) {
            this.bigBlindID = 0;
            this.players[this.bigBlindID].Bet(2);
        }
        else {
            this.bigBlindID++;
            this.players[this.bigBlindID].Bet(2);
            this.currentBet = 2;
        }
        this.currentTotalBet += 2;
        this.updateTotalBet();
    }
}

class PokerPlayer {
    constructor() {
        this.funds = 1000;
        this.fundsEl;
        this.hands = [];
        this.handsEl;
        this.fold = false;
        this.showhand = false;
        this.betAtSH = 0;
        this.playerBet = 0;
        this.img;
        this.showHands = this.showHands.bind(this);
        this.playerBet = this.Bet.bind(this);
    }

    Bet(bet) {
        this.playerBet += bet;
        this.funds -=bet;
        this.fundsEl.textContent = '$ ' + this.funds;
    }

    showHands(url0 = this.hands[0].image, url1 = this.hands[1].image) {
        this.handsEl.textContent = "";
        let card0 = document.createElement('img');
        let card1 = document.createElement('img');
        card0.src = url0;
        card1.src = url1;
        
        this.handsEl.appendChild(card0);
        this.handsEl.appendChild(card1);
        // console.log("player: " + this.handsEl);
    }

   
}

// var player1 = new PokerPlayer;
// var game1 = new PokerGame();
// console.log(game1);
// game1.players[0].showHands();

// var player1 = new PokerPlayer()
// console.log('start');
// console.log(player1.funds);
// player1.funds+=1000;
// console.log(player1.funds);