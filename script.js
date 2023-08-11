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

const suit=["H","C","S","D"]
const value=[2,3,4,5,6,7,8,9,10,11,12,13,"A"];
let deck=[];
let turnNumber = 0;

let playerScore =0;
let dealerScore = 0;

let playerTurn = true;
//let isPlaying = false;

let cardsDealt = 0;

//cardsGone.textContent = `${turnNumber+1}`;


// Create playing cards deck with 52 cards using arrays declared
function createDeck(){
    //First loop for the suits
    for(let x = 0; x < suit.length; x++){
        //Second loop for the card value 
        for(let i=0; i <value.length;i++){
            //Add the generated card to the empty array
            deck.push(suit[x]+value[i]);
        }
    }
}

//Giving random positions to every card
function shuffleDeck(array){
    //Create a loop to pick the first item of the array and swap it with another card from a random position
    for(let a = 0; a < array.length; a++){
        //Create a random number within the range of the array selected
        let b = Math.floor(Math.random()*array.length);
        //using array destructing notation to asign the variables with changed position
        [array[a],array[b]] = [array[b],array[a]];
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
