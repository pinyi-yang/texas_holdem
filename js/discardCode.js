//* in poker class
//* in poker class

nextStage = (game) => {
    this.currentBet = 0;
    //? if real person fold or sh hand last stage end turn immediately
    //! necessary?
    // if ((!this.currentTurnIDArr.includes(2)) || player.showhand === true) {
    //     this.showDealerCard();
    //     this.getResults()
    //     this.endTurn()
    //     console.log('this turn end due to only gamer is inactive.');
    // }
    
    this.initTurnIndex();

    switch(this.stageNum) {
        case 0:
            console.log('After get hand cards. Start Bet');
            // askForBet();
            askNextPlayerBet(game); //! at the very end.
            break;
        case 1:
            console.log('Show flop cards. Start bet');
            this.showDealerCard();
            // askForBet();
            askNextPlayerBet(game);
            break
        case 2:
            console.log('Show turn card. Start bet');
            this.showDealerCard();
            // askForBet();
            askNextPlayerBet(game);
            break;
        case 3:
            console.log('Show river card. Start bet');
            this.showDealerCard();
            askNextPlayerBet(game);
            break;        
        case 4:
            console.log('Show cards in hand. End turn');
            this.getResults();
            this.endTurn();
            this.stageNum = 0;
            return;
    }
    // if (this.currentID === this.startBetID) {
    //     this.stageNum++;
    //     return;
    // }
}

askForBet = () => {
    //! no check showhand and fold. will check when each player showhand or fold
    
    //? get index at currentTurnIDArr
    var turnStartIndex = this.currentTurnIDArr.indexOf(this.startBetID);
    var turnEndIndex;
    var turnCurrIndex = turnStartIndex;
    
    turnEndIndex = this.getEndIndex(turnStartIndex);
    console.log('start ask for bet from player' + turnStartIndex + ' to player' + turnEndIndex);

    for (let i = 0; i < this.currentTurnIDArr.length; i++) {
        let id = this.currentTurnIDArr[turnCurrIndex]
        console.log('hi player' + id);
        
        //? end of stage, all players finish bet 
        if (turnCurrIndex === turnEndIndex) {
            console.log('end of ' + this.stageNum + ' stage.');
            this.stageNum++;
            this.currStageSHPlayers = [];
            this.nextStage();
        }

        // let id = this.currentTurnIDArr[turnCurrIndex];
        console.log('ask player' + id);
        //? get to gamer, stop. game will control by buttons
        if (id === 2) {
            turnCurrIndex < this.currentTurnIDArr.length-1? turnCurrIndex++ : turnCurrIndex = 0;
            console.log("gamer's turn");
            return;
        }
        //? not gamer, computer will play
        //? don't do anything if player showHand
        if (this.players[id].showhand) {
            turnCurrIndex < this.currentTurnIDArr.length-1? turnCurrIndex++ : turnCurrIndex = 0;
            return;
        }
        console.log('computer' + id + "'s turn.");
        this.computerBet(this.players[id]);
        turnCurrIndex < this.currentTurnIDArr.length-1? turnCurrIndex++ : turnCurrIndex = 0;
    }              
} // end of askforbet

askPlayerBet = () => {
    let id = this.currentTurnIDArr[this.turnCurrIndex]
    console.log('hi player' + id);
    
    //? end of stage, all players finish bet 
    if (this.turnCurrIndex === this.turnEndIndex) {
        this.stageNum++;
        this.currStageSHPlayers = [];
        this.nextStage();
    }

    // let id = this.currentTurnIDArr[turnCurrIndex];
    console.log('ask player' + id);
    //? get to gamer, stop. game will control by buttons
    if (id === 2) {
        this.turnCurrIndex < this.currentTurnIDArr.length-1? this.turnCurrIndex++ : this.turnCurrIndex = 0;
        console.log("gamer's turn");
        return;
    }
    //? not gamer, computer will play
    //? don't do anything if player showHand
    if (this.players[id].showhand) {
        this.turnCurrIndex < this.currentTurnIDArr.length-1? this.turnCurrIndex++ : this.turnCurrIndex = 0;
    }
    console.log('computer' + id + "'s turn.");
    this.computerBet(this.players[id]);
    this.turnCurrIndex < this.currentTurnIDArr.length-1? this.turnCurrIndex++ : this.turnCurrIndex = 0;
                 
} // end of askPlayerBet