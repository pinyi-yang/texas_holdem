
var cardDrawsurl = "https://deckofcardsapi.com/api/deck/new/draw/?count="
var deckID;
var cards;
var cardsurl;


fetch(cardDrawsurl)
  .then(function(responseData){
    console.log('get cards');
    return responseData.json();
  })
  .then(function(jsonData){
    // console.log(jsonData);
    cards = jsonData;
  })
