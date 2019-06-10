class GameInfo {
    constructor() {
        this.allCards;
        this.dealerCards;
        this.bigBlindID = 0;
        this.players = (function(){
            let gamers = []
            for (let i = 0; i < 5; i++) {
                gamers.push(new PokerPlayer());
                // players.push(new PokerPlayer('player'+(i+1)));
            }
            return gamers
        })(); //! () is necessary!!
    }

}

class PokerPlayer {
    constructor() {
        this.funds = 1000;
        this.hands = [];
        this.fold = false;
        this.showhand = false;
        this.betAtSH = 0;
        this.bet = 0;
        this.img;
    }
}

// var player1 = new PokerPlayer;
var game1 = new GameInfo();
console.log(game1);

// var player1 = new PokerPlayer()
// console.log('start');
// console.log(player1.funds);
// player1.funds+=1000;
// console.log(player1.funds);