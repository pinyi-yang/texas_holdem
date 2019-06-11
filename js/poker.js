class PokerGame {
    constructor() {
        this.allCards;
        this.dealerCards;
        this.bigBlindID = 0;
        this.startBetID = 0;
        this.currentID = 0;
        this.currentPlayerIDArr = [0, 1, 2, 3, 4];
        this.currentTurnIDArr = [];
        this.stageNum = 0;
        this.currentBet = 0; //! bet at current bet around
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
        this.nextStage = this.nextStage.bind(this);
    } //end of contributor
    
    askForBet = () => {
        if (this.currentID === this.startBetID) {
            stageNum++;
            this.nextStage();
            return;
        }

        for (let i = 0; i < this.currentTurnIDArr.length; i++) {
            if (this.currentID === 2) {
                return;
            }
            let betOptionCtl = Math.random();
            let player = this.players[this.currentID];
            
            //! 1. showHands, fold call
            //! 2. update total bet and other necessary info
            switch(true) {
                //todo do nothing if a player show hand this turn.
                case player.showhand: 
                    break;
                
                //todo showhand or not;
                case player.funds + player.playerBet < currentBet: 
                    betOptionCtl > 0.5 ? player.showHands():player.fold();
                    break;

                //todo computer raise
                case betOptionCtl > 0.9:
                    let raise = Math.round(Math.random()*50) * 2
                    while (raise > player.funds + player.playerBet - this.currentBet) {
                        raise = Math.round(Math.random()*50) * 2
                    }
                    console.log('player raise ' + raise);
                    let amount = raise + player.playerBet - this.currentBet;
                    player.Bet(amount);
                    this.currentBet += amount;
                    this.startBetID = this.currentID;
                    break;
                
                //todo computer fold    
                case betOptionCtl < 0.1:
                    player.fold();
                    break;
                
                //todo computer call
                default:
                    player.call();

            }
        }

    }

    showDealerCard = () => {

    }

    getResults = () => {

    }
    
    nextStage() {
        this.currentBet = 0;

        switch(this.stageNum) {
            case 0:
                askForBet();
                break;
            case 1:
                showDealerCard();
                askForBet();
                break
            case 2:
                showDealerCard();
                askForBet();
                break;
            case 3:
                showDealerCard();
                getResults();
                break;        
        }
        if (this.currentID === this.startBetID) {
            this.stageNum++;
            return;
        }
    }
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
        if (this.currentPlayerIDArr.includes(this.bigBlindID)) {
            this.players[this.bigBlindID].Bet(1);
        } else {
            this.bigBlindID +=1;
            this.startBlind();
            return;
        }
        
        // console.log(this.bigBlindID,this.players[this.bigBlindID]);
        this.currentTotalBet +=1;
        // console.log(this.currentTotalBet);
        setTimeout(this.updateTotalBet, 800);
        
        
        setTimeout(this.smallBind, 1600);
    }


    smallBind() {
        this.bigBlindID = this.getNextPlayerID(this.currentPlayerIDArr, this.bigBlindID);
        console.log(this.bigBlindID);
        this.players[this.bigBlindID].Bet(2);
        this.currentBet = 2;
        this.currentTotalBet += 2;
        this.updateTotalBet();
    }

    getNextPlayerID(IDArr, ID) {
        let id = IDArr.indexOf(ID);
        if (id + 1 >= IDArr.length) {
            id = 0;
        }
        else {
            id++;
        }
        return IDArr[id];
    }
    
    takePlayerIDOut(IDArr, ID) {

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
        // this.showHands = this.showHands.bind(this);
        this.playerBet = this.Bet.bind(this);
        this.showCards = this.showCards.bind(this);
    }

    Bet(bet) {
        this.playerBet += bet;
        this.funds -=bet;
        this.fundsEl.textContent = '$ ' + this.funds;
    }

    showCards(url0 = this.hands[0].image, url1 = this.hands[1].image) {
        this.handsEl.textContent = "";
        let card0 = document.createElement('img');
        let card1 = document.createElement('img');
        card0.src = url0;
        card1.src = url1;
        
        this.handsEl.appendChild(card0);
        this.handsEl.appendChild(card1);
        // console.log("player: " + this.handsEl);
    }

    showHands = () => {

    }

    fold = () => {

    }

    call = () => {

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