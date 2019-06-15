class PokerGame {
    constructor() {
        this.allCards;
        this.dealercards;
        this.bigBlindID = 0;
        this.startBetID = 0;
        this.lastID = 4;
        this.currentID = 0;
        this.currentPlayerIDArr = [0, 1, 2, 3, 4];
        this.currentPlayerIDIndex = 0;
        this.currentTurnIDArr = []; //nonfold players at current turn;
        this.turnStartIndex;
        this.turnEndIndex;
        this.turnCurrIndex;
        this.stageNum = 3;
        this.currStageSHPlayers = []; //show hand player at a stage. set to empty at end of each stage
        this.currTurnSHPlayersID = [];
        this.currentBet = 0; //! bet at current bet around
        this.pot = 0; //!change from currentTotalBet
        this.totalBetEl;
        this.players = (function(){
            let gamers = []
            for (let i = 0; i < 5; i++) {
                gamers.push(new PokerPlayer());
                // players.push(new PokerPlayer('player'+(i+1)));
            }
            return gamers
        })(); //! () is necessary!!
        this.winnerHR = [-1,[]]
        this.winner;
        this.winnerid;
        this.winmsg='';
        // this.updatePlayersFunds = this.updatePlayersFunds.bind(this);
        // this.startBlind = this.startBlind.bind(this);
        this.updatePlayersFunds = this.updatePlayersFunds.bind(this);
        this.startBlind = this.startBlind.bind(this);
        this.updateTotalBet = this.updateTotalBet.bind(this);
        this.smallBind = this.smallBind.bind(this);
    } //end of contributor
    
    initiGameVar = () => {
        this.winnerHR = [-1,[]];
        this.currentBet = 0;
        this.stageNum = 0;
        this.currStageSHPlayers = [];
        this.currStageSHPlayersID = [];
        this.currentTurnIDArr = this.currentPlayerIDArr.slice(0);
        this.winmsg ='';
        for (let player of this.players) {
            player.initPlayerVar();
            console.log(player);
        }
        
    }
    startBlind = () => {
        if (this.currentPlayerIDArr.includes(this.bigBlindID)) {
            this.players[this.bigBlindID].Bet(1);
        } else {
            this.bigBlindID = this.getNextPlayerID(this.currentPlayerIDArr, this.bigBlindID);
            this.startBlind();
            return;
        }
        
        // console.log(this.bigBlindID,this.players[this.bigBlindID]);
        this.pot +=1;
        // console.log(this.currentTotalBet);
        setTimeout(this.updateTotalBet, 800);
        
        
        setTimeout(this.smallBind, 1600);
        
    }


    smallBind = () => {
        this.bigBlindID = this.getNextPlayerID(this.currentPlayerIDArr, this.bigBlindID);
        console.log(this.bigBlindID);
        this.players[this.bigBlindID].Bet(2);
        this.currentBet = 2;
        this.pot += 2;
        this.updateTotalBet();
        console.log('after blind, current bet is' + this.currentBet);
    }    
    
    //* get bet end index in cuurentTurnIDArr
    getEndIndex = (startIndex) => {
        return startIndex === 0? this.currentTurnIDArr.length-1: startIndex -1;
    }

    initTurnIndex = (startIndex = 0) => {
        //! no check showhand and fold. will check when each player showhand or fold
        
        //? get index at currentTurnIDArr
        // this.turnStartIndex = this.currentTurnIDArr.indexOf(this.startBetID);
        this.turnStartIndex = startIndex;
        this.turnCurrIndex = this.turnStartIndex;
        
        this.turnEndIndex = this.currentTurnIDArr.length-1
    }
    
    computerBet = (player) => {
        let betOptionCtl = Math.random();
        console.log('current bet is ' + this.currentBet);;
        
        //!test player controller;================================
        if (this.players.indexOf(player) === 3) {
            this.showHands(player);
        }
        //!=====================================================

        switch (true) {
            //todo do nothing if a player showed hand this turn.
            case player.showhand:
                break;

            //todo showhand or not; 1. showHands 2. fold
            //? showhands: 1. take player out of currentTurn 2. 
            case player.funds + player.playerBet <= this.currentBet:
                betOptionCtl > 0.5 ? this.showHands(player) : this.Fold(player);
                break;

            //todo computer raise
            case betOptionCtl > 0.9:
                this.Raise(player);
                break;
            //todo computer fold    
            case betOptionCtl < 0.1:
                this.Fold(player);
                break;
            //todo computer call
            default:
                this.Call(player);
        }
    }

    showHands = (player) => {
        //? update player.showhand, update playerBet
        console.log('player' + this.players.indexOf(player) + ' showhand');
        player.popPlayerMsg('Show Hand!!!');
        player.showhand = true;
        player.betAtSH = player.funds + player.playerBet - this.currentBet;

        if (player.betAtSH > 0) {
            this.currentBet += player.betAtSH;
            //* renew index
            this.turnStartIndex = this.turnCurrIndex;
            this.turnEndIndex = this.getEndIndex(this.turnCurrIndex);
            console.log('New bet turn start with player' + this.currentTurnIDArr[this.turnStartIndex] + '. end with player' + this.currentTurnIDArr[this.turnEndIndex]);      
            console.log('Current Players are ' + this.currentTurnIDArr);  
        }
        
        this.takePlayerOut(player);
        player.Bet(player.funds);
        
        this.updateSHPlayerPot(player.betAtSH);
        console.log('add player' + this.players.indexOf(player) + ' to SHplayers.');
        this.currStageSHPlayers.push(player);
        this.currTurnSHPlayersID.push(this.players.indexOf(player));
        console.log(this.currTurnSHPlayersID);

        //? get win pot for showhand player. will update when other player sh less or fold
        let activePlayerNum = this.currentTurnIDArr.length;
        player.potAtSH = this.pot + player.betAtSH * (activePlayerNum);
        player.playerBet += player.betAtSH;

        //? update bet, pot and display
        this.pot += player.betAtSH;
        this.totalBetEl.textContent = this.pot;

        //! check whether only one active player in current turn
        // this.endTurnEarlyOrNot();
    }

    endTurnEarlyOrNot = () => {
        if (this.currentTurnIDArr.length === 1) {
            console.log('this turn end due to only 1 active player');
            this.getResults()
            this.endTurn()
        }
    }

    updateSHPlayerPot = (currBet) => {
        //? no show hand player this stage
        if (this.currStageSHPlayers.length = 0) {
            return;
        }

        for (let SHplayers in this.currStageSHPlayers) {
            SHplayers.potAtSH = SHplayers.potAtSH + currBet - SHplayers.betAtSH;
        }
    }


    Fold = (player) => {
        //! check whether only one active player in current turn.
        let id = this.players.indexOf(player);
        console.log('player' + this.players.indexOf(player) + ' fold');
        player.fold = true;
        player.popPlayerMsg('Fold~~')
        player.handsEl.textContent ="";

        this.endTurnEarlyOrNot();
        this.updateSHPlayerPot(0);
        
        
        //* take player out
        this.takePlayerOut(player);


        //! check whether only one active player in current turn
        // this.endTurnEarlyOrNot();
        
    }

    takePlayerOut(player) {
        let id = this.players.indexOf(player);
        let betEndPlayerID = this.currentTurnIDArr[this.turnEndIndex];
        this.currentTurnIDArr.splice(this.currentTurnIDArr.indexOf(id), 1);
        console.log('player' + this.players.indexOf(player) + ' out of game.');
        console.log('current players are ' + this.currentTurnIDArr);
        //? update start and end index
        //? currIndex will increase 1 after bet
        if (this.turnCurrIndex >= this.currentTurnIDArr.length || this.turnCurrIndex === 0) {
            this.turnCurrIndex = this.currentTurnIDArr.length - 1;
            console.log('next palyer is ' + this.currentTurnIDArr[0]);
        }
        else {
            console.log('next palyer is ' + this.currentTurnIDArr[this.turnCurrIndex]);
            this.turnCurrIndex--;
        }
        if (this.currentTurnIDArr.indexOf(betEndPlayerID) !== -1) {
            //* fold player is not the last bet player
            this.turnEndIndex = this.currentTurnIDArr.indexOf(betEndPlayerID); //? passed
        }
        else {
            if (this.turnEndIndex >= this.currentTurnIDArr.length) {
                //* player take out is last in IDArr.
                this.turnEndIndex = this.currentTurnIDArr.length - 1;
            }
        }
        console.log('This turn will end at player' + this.currentTurnIDArr[this.turnEndIndex]);
    }

    Call = (player) => {
        let bet = this.currentBet - player.playerBet;
        player.Bet(bet);
        console.log('player' + this.players.indexOf(player) + ' call $' + bet);
        this.updateTotalBet(bet);
        player.popPlayerMsg('Call');
    }

    Raise = (player, bet = 0) => {
        
        let call = this.currentBet - player.playerBet;
        let raise;
        if (this.players.indexOf(player) !== 2 ) {
            raise = Math.round(Math.random() * 10) * 2;
            while (raise > player.funds + call) {
                raise = Math.round(Math.random() * 50) * 2;
            }
        } else {
            raise = bet;
        }

        console.log('call ' + call + ', raise ' + raise);
        let msg = 'Raise $' + raise;
        player.popPlayerMsg('msg');
        let amount = raise + call;
        player.Bet(amount);
        this.currentBet += raise;
        
        //* update player index
        this.turnStartIndex = this.turnCurrIndex;
        this.turnEndIndex = this.getEndIndex(this.turnCurrIndex);
        console.log('New bet turn start with player' + this.currentTurnIDArr[this.turnStartIndex] + '. end with player' + this.currentTurnIDArr[this.turnEndIndex]);      
        console.log('Current Players are ' + this.currentTurnIDArr);  
        this.updateTotalBet(amount); 
    }


    
    updatePlayersFunds = () => {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].fundsEl.textContent = '$ ' + this.players[i].funds;
        }
    }
    updateTotalBet = (bet = 0) => {
        this.pot += bet;
        console.log('total bet: ' + this.pot);
        this.totalBetEl.textContent = '$ ' + this.pot;
    }

    

    getNextPlayerID = (IDArr, ID) => {
        let id = IDArr.indexOf(ID);
        if (id + 1 >= IDArr.length) {
            id = 0;
        }
        else {
            id++;
        }
        return IDArr[id];
    }
    

    getResults = () => {
        let hand;
        let player
        for (let id of this.currentTurnIDArr) {
            player = this.players[id];
            hand = this.dealercards.concat(player.hands)
            player.handRank = this.getHandRank(hand);
            console.log('Player' + id +"'s hand is " + player.handRank);
            player.msgEl.textContent = "";
            player.msgEl.textContent = player.handRank[2];
            player.msgEl.classList.remove('msgpop');
            player.msgEl.classList.add('msgshow');

            //? check if the winner
            if ( player.handRank[0] === this.winnerHR[0] && player.handRank[1] === this.winnerHR[1] ) {
                this.winner.push(player);
                this.winnerid.push(id);
            } else if ((player.handRank[0] > this.winnerHR[0]) || (player.handRank[0] === this.winnerHR[0] && player.handRank[1] > this.winnerHR[1])) {
                this.winner = [player];
                this.winnerid = [id];
                console.log(this.winner, this.winnerid);
                this.winnerHR = player.handRank;
            } 
        }


    }

    endTurn = () => {        
        //?update winner funds
        let player; 
        if ( this.winner.length === 1 ) {
            player = this.winner[0];
            player.funds += this.pot;
            player.fundsEl.textContent = '$ ' + player.funds;
            if (this.winnerid[0] === 2) {
                this.winmsg = 'You win the game by ' + this.winnerHR[2];
            } else {
                this.winmsg = 'Player ' + this.winnerid[0] + ' win by ' + this.winnerHR[2]; 
            }
        } else {
            for (let id of this.winnerid) {
                this.players[id].funds += this.pot/this.winner.length;
                this.players[id].fundsEl.textContent = '$ ' + this.players[id].funds;
                if (id === 2) {
                    this.winmsg += 'You, '; 
                } else {
                    this.winmsg += 'Player, '; 
                }
            }
            this.winmsg += ' ties the game with ' + this.winnerHR[2];
        }
        this.pot = 0;
        this.totalBetEl.textContent = " $0"
    }

    getHandRank = (hand) => {
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
    
        [suitcount, numbercount] = this.getHandStat(hand); //* numArr
    
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
        let codeKeys = this.CodifyNumArr(numKeys); //*sorted, codeArr
        straight = this.checkStraight(numKeys); //*decent, numArr passed
        flush = this.checkFlush(suitcount); //* passed, unsorted numArr;

        //* sort flush[1]
        let flusharry = this.CodifyNumArr(flush[1]).sort();
        flusharry = this.numCodeArr(flusharry);
        sf = this.checkStraight(flusharry); //* passed;
    
        if (sf[0]) {
            if (sf[1][4] === 'E') {
                return [9, this.CodifyNumArr(sf[1].reverse().join('')), 'Royal Flush, Ace high!']
            }
            else {
                return [8, this.CodifyNumArr(sf[1].reverse().join('')), 'Straight Flush, ' + this.NamCode(sf[1][4]) + ' high!']
            }
        }
    
        if (fk[0]) {
            let temp = this.CodifyNumArr(fk[1])
            return [7, temp[0], 'Four of a Kind ' + this.NamCode(temp[0]) + ' high!']
        }
    
        //*full house
        if (tk[0] && pair[0]) {
            pair[1].length === 1 ? fh[1].push(tk[1][0], pair[1][0]) : fh[1].push(tk[1][0], Math.max(pair[1][0], pair[1][1]));
            return [6, this.CodifyNumArr(fh[1]).join(''), 'Full House ' + this.NamCode(this.CodifyNumArr(fh[1])[0]) + ' high!'];
        } 
        
        if (tk[1].length === 2) {
            tk[1][0] > tk[1][1] ? fh[1].push(tk[1][0], tk[1][1]) : fh[1].push(tk[1][1], tk[1][0]);
            return [6, this.CodifyNumArr(fh[1]).join(''), 'Full House ' + this.NamCode(this.CodifyNumArr(fh[1])[0]) + ' high!'];
        }
    
        if (flush[0]) {
            temp = this.CodifyNumArr(flush[1]).sort().reverse().slice(0, 5);
            return [5, temp.join(''), 'Flush ' + this.NamCode(temp[0]) + ' high!'];
        }
    
        if (straight[0]) {
            temp = this.CodifyNumArr(straight[1]);
            return [4, temp.join(''), 'Straight ' + this.NamCode(temp[0]) + ' high!'];
        }
    
        //* three of a kind
        if (tk[0]) {
            temp = this.CodifyNumArr(tk[1]);
            let i = 0;
            let tempArr = codeKeys.reverse();
            let resultArr = [];
            while (i < tempArr.length && resultArr.length < 2) {
                if (!temp.includes(tempArr[i])) {
                    resultArr.push(tempArr[i]);
                }
                i++
            }
            return [3, temp.join('') + resultArr.join(''), 'Three of a Kind ' + this.NamCode(temp[0]) + ' high with ' + this.NamCode(resultArr[0]) + ', ' + this.NamCode(resultArr[1])];
        }
    
        //* two pairs
        if (pair[1].length >= 2) {
            temp = this.CodifyNumArr(pair[1]);
            temp.sort().reverse().slice(0,2);
            let i = 0;
            let tempArr = codeKeys.reverse();
            while (temp.includes(tempArr[i])) {
                i++
            }
            
            return [2, temp.join('') + tempArr[i], 'Two Pairs ' + this.NamCode(temp[0]) + ' ' + this.NamCode(temp[1]) + ' with ' + this.NamCode(tempArr[i])];
        }
    
        //* one pair
        if (pair[1].length === 1) {
            temp = this.CodifyNumArr(pair[1]);
            let tempArr = [];
            let i = 0;
            while (tempArr.length < 3 && i < codeKeys.length - 1) {
                if (codeKeys.reverse()[i] !== temp[0]) {
                    tempArr.push(codeKeys.reverse()[i]);
                }
                i++;
            }
            
            return [1, temp.join('') + tempArr.sort().reverse().join(''), 'One Pair ' + this.NamCode(temp[0])];
        }
    
        return [0, codeKeys.reverse().join(''), 'High Card'];    
    }
    
    //*passed
    getHandStat = (hand) => {
        let suitcount = {};
        let numbercount = {};
        console.log('hand is' + hand);
        for (let card of hand) {
            //todo orgnize by suit
            if (!suitcount[card.suit]) {
                console.log('card is' + card);
                suitcount[card.suit] = [];
                suitcount[card.suit].push(this.numCardCode(card));
                ;
            }
            else {
                suitcount[card.suit].push(this.numCardCode(card));
            }
            //todo orgnize by number
            if (!numbercount[this.numCardCode(card)]) {
                numbercount[this.numCardCode(card)] = 1;
            }
            else {
                numbercount[this.numCardCode(card)]++;
            }
        };
        return [suitcount, numbercount];
    }
    
    //*passed
    CodifyNumArr = (numArr) => {
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

    numCodeArr = (codeArr) => {
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
    
    numCardCode = (card) => {
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
    checkStraight = (acearr, count = 1, index = acearr.length - 1) => {
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
        
        return this.checkStraight(acearr, count, index);
    }
    
    checkFlush = (suitcount) => {
        for (let suit in suitcount) {
            if (suitcount[suit].length >= 5) {
                return [5, suitcount[suit]]
            }
        }
        return [0,[]]
    }
    
    NamCode = (code) => {
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
                break;
            default:
                value = code;
        }
        return value;
    }

    
}//end of poker game


class PokerPlayer {
    constructor() {
        this.funds = 100;
        this.fundsEl;
        this.hands = [];
        this.handsEl;
        this.msgEl;
        this.fold = false;
        this.showhand = false;
        this.betAtSH = 0;
        this.potAtSH = 0;
        this.playerBet = 0; //total bet this turn(game)
        this.img;
        // this.showHands = this.showHands.bind(this);
        this.showCards = this.showCards.bind(this);
        this.Bet = this.Bet.bind(this);
        this.handRank;
    }

    initPlayerVar = () => {
        this.hands = [];
        this.fold = false;
        this.showhand = false;
        this.betAtSH = 0;
        this.potAtSH = 0;
        this.playerBet = 0;
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

    popPlayerMsg(str) {
        this.msgEl.textContent = str;
        this.msgEl.classList.add('msgpop');
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




