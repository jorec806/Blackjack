'use strict';

const buttonHit = document.querySelector(".button-hit");
const buttonStand = document.querySelector(".button-stand");
const buttonNewGame = document.querySelector(".button-newgame");
const buttonStartGame = document.querySelector(".button-startgame");
const playerTable = document.querySelector(".section3-playertable");
const dealerTable = document.querySelector(".section2-dealertable");

const cardsGone = document.querySelector(".cards-gone");
const currentTurnMsg = document.querySelector(".dealer-your");
const winnerMsg = document.querySelector(".win-lose");
const bustMsg = document.querySelector(".you-bust");
const nextGameMsg = document.querySelector(".next-game");
const miscMsg = document.querySelector(".misc-msg");

/* Re-structure

IMPORTANT
- Ace value depend on hand (either 11 or 1)

CSS
1. Restructure boxes, make them fixed
2. Responsive
3. ANIMACIONES: poner las cartas displayed en el maso y que vayan moviendose
al tablero del dealer o player

JAVASCRIPT

1. Display board with NOT all butons, just Start Game and show a MODAL with the
rules.

2. When (ok) button is hit in the modal, it disappear and the game board can be
accessed. The board must have a button to display the MODAL again to show rules
Also, Display TITLE at the top, start game BUTTON in the middle with an image

3. When the start game BUTTON is pressed, FIRST, cards are dealt for player and
DEALER. First card is open for both Player, but second card is opened only for
PLAYER. SECOND, the HIT, STAND AND NEW GAME BUTTONS are displayed. Also, the
CARD COUNTING SECTION is displayed with counters on ZERO and DECK is Displayed

    3.0. Before Player is able to press another button, FUNCTION (checkScore) 
    and (playerWinner) is evualuated to check if any of players have:
        - Blackjack
        - 21 points
        - higher score

    3.1. If Player gets BLACKJACK in the first Turn, wins automatically and
    another game is started

    3.2. When HIT BUTTON is pressed, one more card is dealt to Player and the
    FUNCTION (checkScore) evualuates if the score is higher than 21 pts. If so
    Player loses the match. If not, Player can press BUTTON to invoke the 
    FUNCTION (createCard) to get one more card and FUNCTION (checkScore) is
    evaluated again, and so on.

    3.3. If player keeps drawing and obtains more than 21 pts, loses the hand
    and AI PLAYER does NOT have to play

    3.4.Instead if PLAYER has less than 21pts and STAND BUTTON is pressed,  
    Player Turn is finished and AI Player turn starts

4. the FUNCTION (isAIturn) is invoked. This function will act as an AI player.
AI will play against the PLAYER and will start its turn iff PLAYER: has not 
reached 21 pts and STAND button was pressed. 

    4.0. DEALER(AI) will keep drawing cards until 17pts or less, it means that
    draws card on 16pts but stands on 17pts

    4.1. With every Draw, the checkscore() is evaluated to see if Dealer
    WINS or LOSES


FUNCTIONS
- createDeck() :was modified to accept a parameter to add more than 1 deck
- suffleDeck: no modification donce
- newDeck(): function not needed
- createCard() Creates a new card and gets a value from the a
- drawCard(): -------------
- displayCard(): Puts the card onto the board according to turn
- checkScore(): Function was modified to receive a array (hand) as parameter and get the total points on the hand.

- getCardValue()
- isPlayerTurn()
- isBlackJack()
- startGame() or newGame()
- stand()
- hit()
- initialValues()
- resetValues()
- dealerTurn()
*/

function createDeck(numberOfDecks) {
  /*
  The function returns a new deck of cards(array) consisting in 52 cards times
  how many decks are passed as argument
   */

  let deck = [];
  let multipleDecks = [];

  const suit = ["H", "C", "S", "D"];
  const value = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

  //First loop for the suits
  for (let x = 0; x < suit.length; x++) {
    //Second loop for the card value
    for (let i = 0; i < value.length; i++) {
      //Add the generated card to the empty array
      deck.push(suit[x] + value[i]);
    }
  }
}

function shuffleDeck(deck) {
  /*
  The function shuffles a deck of cards(array)
  */

  //Create a loop to pick the first item of the array and swap it with another card from a random position
  for (let a = 0; a < deck.length; a++) {
    //Create a random number within the range of the array selected
    let b = Math.floor(Math.random() * deck.length);
    //using array destructing notation to asign the variables with changed position
    [deck[a], deck[b]] = [deck[b], deck[a]];
  }
}

function createCard(deck) {
  /*
  The function returns a new card and asigns a value and suit

  Parameter:
    deck : an array of cards
  */

  const card = deck.shift();
  const newCard = document.createElement("div");

  newCard.classList.add("card");
  newCard.style.backgroundImage = `url(cards/${card}.png)`;
  newCard.dataset.value = card;

  //Dataset to modify the value of Jack, Queen, King

  if (
    newCard.dataset.value.includes(["Q"]) ||
    newCard.dataset.value.includes(["K"]) ||
    newCard.dataset.value.includes(["J"])
  ) {
    newCard.dataset.value = newCard.dataset.value[0] + "10";
  }

  return newCard;
}

function displayCard(card, playerTurn) {
  /*
  The function displays the card on it respective table (player or dealer)

  Parameter:
    card : div containing the card itself
  */

  if (playerTurn) {
    playerTable.append(card);
  } else {
    dealerTable.append(card);
  }
}

function getCardValue(card) {
  /*
  The function evaluates card(string) and returns its value.

  Parameter:
    card : an string containing the suit and value of a card
  */

  let [suit, ...cardValue] = card.dataset.value;
  cardValue = cardValue.join("");

  if (!isNaN(cardValue)) {
    cardValue = parseInt(cardValue);
  }

  return cardValue;
}

function checkScore(hand) {
  /*
  The function evaluates how many pts a player has.

  Parameter:
    hand : an array with all cards the player/dealer has
  */

  let values = [];
  let totalScore = 0;

  hand.forEach((e) => {
    values.push(getCardValue(e));
  });

  let aces = values.filter((element) => element == "A");
  let newValues = values
    .filter((element) => !isNaN(element))
    .map((element) => {
      return parseInt(element);
    });

  newValues.forEach((element) => {
    totalScore += element;
  });

  if (aces.length == 1 && totalScore + 11 <= 21) {
    totalScore += 11;
  } else if (aces.length == 1 && totalScore + 11 > 21) {
    totalScore += aces.length;
  } else if (aces.length > 1) {
    totalScore += aces.length;
  }

  return totalScore;
}

function isBlackJack(hand) {
  /*
  The function evaluates if the hand passed is blackjack or not.

  Parameter:
    hand : an array with all cards the player/dealer has
  */

  if (hand.length != 2) return false;

  let values = hand.map((e) => {
    return getCardValue(e);
  });
}

const suit2 = ["H10", "HA"];

// const carta = drawCard(suit);
// console.log(carta);
// displayCard(carta, true);
// console.log(playerHand);
// isBlackJack(suit2);

function standGame() {
  playerTurn = false;
  console.log(`current P1 score: ${playerScore}`);
  dealerTurn();
  checkWinner();
}

function checkWinner() {
  if (playerScore > dealerScore && dealerScore <= 21) {
    //
    winnerMsg.textContent = "You Win🥳";
    winnerMsg.classList.remove("hidden");
    nextGameMsg.textContent = "Next hand..";
    nextGameMsg.classList.remove("hidden");

    setTimeout(() => {
      clearCards();
      nextHand();
    }, 3000);

    console.log("Escenario 1");
  } else if (playerScore < dealerScore && dealerScore <= 21) {
    //
    winnerMsg.textContent = "You Lose🤬";
    winnerMsg.classList.remove("hidden");
    nextGameMsg.textContent = "Next hand..";
    nextGameMsg.classList.remove("hidden");

    setTimeout(() => {
      clearCards();
      nextHand();
    }, 3000);

    console.log("Escenario 2");
  } else if (playerScore == dealerScore && dealerScore <= 21) {
    miscMsg.textContent = "It's a TIE";
    miscMsg.classList.remove("hidden");

    setTimeout(() => {
      clearCards();
      nextHand();
    }, 3000);
    console.log("Escenario 3");
  } else {
    return;
  }
}

function dealerTurn() {
  while (dealerScore < 17) {
    newCard();
  }
}

function nextHand() {
  miscMsg.classList.add("hidden");
  nextGameMsg.classList.add("hidden");
  winnerMsg.classList.add("hidden");
  bustMsg.classList.add("hidden");

  setTimeout(() => {
    newCard();
    playerTurn = false;
  }, 500);

  setTimeout(() => {
    newCard();
    playerTurn = true;
  }, 750);

  setTimeout(() => {
    newCard();
    playerTurn = false;
  }, 1000);

  setTimeout(() => {
    newCard();
    playerTurn = true;
  }, 1250);

  playerTurn = true;
}

function clearCards() {
  for (let c = 0; c < cardsDealt; c++) {
    const removeNewCard = document.querySelector(`.temp${c}`);
    removeNewCard.remove();
  }
  resetValues();
}

function cardValue() {
  let a = [...deck[turnNumber]];
  let card;

  if (a.length > 2) {
    return 10;
  } else if (a.includes("A")) {
    if (playerTurn && playerScore + 11 > 21) {
      return 1;
    } else if (playerTurn && playerScore + 11 <= 21) {
      return 11;
    } else if (!playerTurn && dealerScore + 11 > 21) {
      return 1;
    } else if (!playerTurn && dealerScore + 11 <= 21) {
      return 11;
    }
    //To sum up, asign the variable of the "a" position of the current array to the "b" position and vice versa.
}

function newCard (){
    if(turnNumber>51){
        miscMsg.textContent = "NO MORE CARDS";
        miscMsg.classList.remove("hidden");
        playerTurn = false;
        return;
    }
    if(playerTurn){
        const newCard = document.createElement("div");
        playerTable.appendChild(newCard);
        newCard.classList.add("card");
        newCard.classList.add(`temp${cardsDealt}`)
        newCard.style.backgroundImage = `url(cards/${deck[turnNumber]}.png)`;
        cardsGone.textContent = `${turnNumber+1}`;

        playerScore = playerScore + cardValue();
        turnNumber++;
        cardsDealt++;
        checkScore();
        //console.log(`current P1 score: ${playerScore}`);
    } else {
        const newCard = document.createElement("div");
        dealerTable.appendChild(newCard);
        newCard.classList.add("card");
        newCard.classList.add(`temp${cardsDealt}`);
        newCard.style.backgroundImage = `url(cards/${deck[turnNumber]}.png)`;
        cardsGone.textContent = `${turnNumber+1}`;

        dealerScore = dealerScore + cardValue();
        turnNumber++;
        cardsDealt++;
        checkScore();
    }
}

function checkScore(){
    if(playerTurn){
        if (playerScore>21){
            playerTurn = false;

            bustMsg.textContent = `You busted!💥`;
            bustMsg.classList.remove("hidden");
            winnerMsg.textContent = "Dealer Win😈"
            winnerMsg.classList.remove("hidden");
            nextGameMsg.textContent = "Next hand..";
            nextGameMsg.classList.remove("hidden");

            console.log(`current P1 score: ${playerScore}`);
            
            setTimeout(()=>{
                clearCards();
                nextHand();
                } ,3000
            );
        } else if (playerScore==21){
            miscMsg.textContent = "🃏 BLACKJACK 🃏";
            miscMsg.classList.remove("hidden");
            winnerMsg.textContent = "You Win🥳"
            winnerMsg.classList.remove("hidden");
            nextGameMsg.textContent = "Next hand..";
            nextGameMsg.classList.remove("hidden");

            console.log(`current P1 score: ${playerScore}`);

            setTimeout(()=>{
                clearCards();
                nextHand();
                } ,3000
            );
        } else {
            return;
        }
    } else {
        if (dealerScore>21){
            playerTurn = true;
            miscMsg.textContent = "Dealer busted!💥";
            miscMsg.classList.remove("hidden");
            winnerMsg.textContent = "You Win🥳"
            winnerMsg.classList.remove("hidden");
            nextGameMsg.textContent = "Next hand..";
            nextGameMsg.classList.remove("hidden");

            setTimeout(()=>{
                clearCards();
                nextHand();
                } ,3000
            );

        } else if (dealerScore==21){
            miscMsg.textContent = "DEALER BLACKJACK😈";
            miscMsg.classList.remove("hidden");
            winnerMsg.textContent = "You Lose🤬"
            winnerMsg.classList.remove("hidden");
            nextGameMsg.textContent = "Next hand..";
            nextGameMsg.classList.remove("hidden");

            setTimeout(()=>{
                clearCards();
                nextHand();
                } ,3000
            );
        } else {
            return;
        }
    }
}

function standGame (){
    playerTurn = false;
    console.log(`current P1 score: ${playerScore}`);
    dealerTurn();
    checkWinner();

}

function checkWinner(){
    if(playerScore>dealerScore && dealerScore<=21){ // 
        winnerMsg.textContent = "You Win🥳"
        winnerMsg.classList.remove("hidden");
        nextGameMsg.textContent = "Next hand..";
        nextGameMsg.classList.remove("hidden");

        setTimeout(()=>{
            clearCards();
            nextHand();
            } ,3000
        );

        console.log("Escenario 1");

    } else if (playerScore<dealerScore && dealerScore<=21) { // 
        winnerMsg.textContent = "You Lose🤬"
        winnerMsg.classList.remove("hidden");
        nextGameMsg.textContent = "Next hand..";
        nextGameMsg.classList.remove("hidden");

        setTimeout(()=>{
            clearCards();
            nextHand();
            } ,3000
        );

        console.log("Escenario 2");

    } else if (playerScore==dealerScore && dealerScore<=21){
        miscMsg.textContent = "It's a TIE";
        miscMsg.classList.remove("hidden");

        setTimeout(()=>{
            clearCards();
            nextHand();
            } ,3000
        );
        console.log("Escenario 3")
    } else {
        return;
    }
}

function dealerTurn(){
    while(dealerScore<17){
        newCard();
    }
}

function nextHand(){

    miscMsg.classList.add("hidden");
    nextGameMsg.classList.add("hidden");
    winnerMsg.classList.add("hidden");
    bustMsg.classList.add("hidden");   

    setTimeout(()=>{
        newCard();
        playerTurn=false;
    },500);

    setTimeout(()=>{
        newCard();
        playerTurn=true;
    },750);

    setTimeout(()=>{
        newCard();
        playerTurn=false;
    },1000);

    setTimeout(()=>{
        newCard();
        playerTurn=true;
    },1250);

    playerTurn=true;
}

function clearCards(){
    for(let c = 0; c < cardsDealt; c++){
        const removeNewCard = document.querySelector(`.temp${c}`);
        removeNewCard.remove();
    }
    resetValues();
}

function cardValue(){
    let a =[ ...deck[turnNumber]];
    let card;

    if(a.length>2){
        return 10;
    } else if (a.includes("A")){
        if(playerTurn && (playerScore + 11 >21)){
            return 1;
        } else if (playerTurn && (playerScore + 11 <= 21)){
            return 11;
        } else if ((!playerTurn) && (dealerScore + 11 > 21)){
            return 1;
        } else if (!playerTurn && (dealerScore + 11 <= 21)){
            return 11;
        }    
    } else {
        let card = Number(a[1]);
        return card;
    }
}

function resetValues(){

playerScore =0;
dealerScore = 0;

playerTurn = true;
cardsDealt = 0;
}

function startGame(){
    if(!playerTurn) return;

    turnNumber=0;

    resetValues();
    shuffleDeck(deck);
    shuffleDeck(deck);

    nextHand();

    buttonHit.classList.remove("hidden");
    buttonStand.classList.remove("hidden");
    buttonNewGame.classList.remove("hidden");
    buttonStartGame.classList.add("hidden");

    playerTurn=true;
    console.log(deck);
}

function newGame() {
    clearCards();
    playerTurn=true;
    startGame();
}

buttonHit.addEventListener("click",newCard);
buttonStand.addEventListener("click",standGame);
buttonNewGame.addEventListener("click",newGame);
buttonStartGame.addEventListener("click",startGame);

createDeck();

// bug del falso blackjack (21 con mas de 2 cartas)
// bug del A con valor 11
// bug de los botones clickeados consecutivamente
