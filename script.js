"use strict";

const DEALER_STAND_AT = 17;
const MIN_SHOE_CARDS = 15;

const logic = window.BlackjackLogic;

const ui = {
  buttonHit: document.querySelector(".button-hit"),
  buttonStand: document.querySelector(".button-stand"),
  buttonNewGame: document.querySelector(".button-newgame"),
  buttonStartGame: document.querySelector(".button-startgame"),
  playerTable: document.querySelector(".section3-playertable"),
  dealerTable: document.querySelector(".section2-dealertable"),
  cardsGone: document.querySelector(".cards-gone"),
  currentTurnMsg: document.querySelector(".dealer-your"),
  winnerMsg: document.querySelector(".win-lose"),
  bustMsg: document.querySelector(".you-bust"),
  nextGameMsg: document.querySelector(".next-game"),
  miscMsg: document.querySelector(".misc-msg"),
  modal: document.querySelector("#modal"),
  closeModal: document.querySelector("#closeModal"),
  deckSelectors: [...document.querySelectorAll(".deck-selector")],
  decksValue: document.querySelector(".decks-value"),
  countValue: document.querySelector(".count-value"),
};

const state = {
  selectedDecks: null,
  deck: [],
  playerHand: [],
  dealerHand: [],
  playerTurn: false,
  roundActive: false,
  cardsGone: 0,
  runningCount: 0,
  hasSelectedDeck: false,
};

function setHidden(element, hidden) {
  element.classList.toggle("hidden", hidden);
}

function resetMessages() {
  setHidden(ui.currentTurnMsg, true);
  setHidden(ui.winnerMsg, true);
  setHidden(ui.bustMsg, true);
  setHidden(ui.nextGameMsg, true);
  setHidden(ui.miscMsg, true);
}

function updateCounters() {
  ui.cardsGone.textContent = String(state.cardsGone);
  ui.decksValue.textContent =
    state.selectedDecks === null ? "-" : String(state.selectedDecks);
  if (!state.hasSelectedDeck || state.selectedDecks === null) {
    ui.countValue.textContent = "RC 0 | TC 0.0";
    return;
  }

  const trueCount = logic.getTrueCount(state.runningCount, state.deck.length);
  const runningLabel =
    state.runningCount > 0 ? `+${state.runningCount}` : String(state.runningCount);
  const trueLabel = trueCount > 0 ? `+${trueCount.toFixed(1)}` : trueCount.toFixed(1);
  ui.countValue.textContent = `RC ${runningLabel} | TC ${trueLabel}`;
}

function createCardNode(cardCode, hiddenCard = false) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.style.backgroundImage = hiddenCard
    ? "url(cards/backcard.png)"
    : `url(cards/${cardCode}.png)`;
  return card;
}

function renderHands() {
  ui.playerTable.innerHTML = "";
  ui.dealerTable.innerHTML = "";

  state.playerHand.forEach((cardCode) => {
    ui.playerTable.append(createCardNode(cardCode));
  });

  state.dealerHand.forEach((cardCode, index) => {
    const hideCard = state.playerTurn && state.roundActive && index === 1;
    ui.dealerTable.append(createCardNode(cardCode, hideCard));
  });
}

function drawCardTo(hand) {
  if (state.deck.length === 0) {
    return null;
  }

  const card = state.deck.shift();
  hand.push(card);
  state.cardsGone += 1;
  state.runningCount += logic.runningCountDelta(card);
  return card;
}

function endRound(message, winnerText, bustText, miscText) {
  state.roundActive = false;
  state.playerTurn = false;
  renderHands();

  resetMessages();

  if (message) {
    ui.currentTurnMsg.textContent = message;
    setHidden(ui.currentTurnMsg, false);
  }
  if (winnerText) {
    ui.winnerMsg.textContent = winnerText;
    setHidden(ui.winnerMsg, false);
  }
  if (bustText) {
    ui.bustMsg.textContent = bustText;
    setHidden(ui.bustMsg, false);
  }
  if (miscText) {
    ui.miscMsg.textContent = miscText;
    setHidden(ui.miscMsg, false);
  }

  ui.nextGameMsg.textContent = "Press NEW GAME";
  setHidden(ui.nextGameMsg, false);

  updateCounters();
}

function evaluateStartHands() {
  const playerBlackjack = logic.isBlackjack(state.playerHand);
  const dealerBlackjack = logic.isBlackjack(state.dealerHand);

  if (!playerBlackjack && !dealerBlackjack) {
    state.playerTurn = true;
    ui.currentTurnMsg.textContent = "Your turn";
    setHidden(ui.currentTurnMsg, false);
    return;
  }

  if (playerBlackjack && dealerBlackjack) {
    endRound("Round finished", "Push", "", "Both have Blackjack");
    return;
  }

  if (playerBlackjack) {
    endRound("Round finished", "You Win🥳", "", "BLACKJACK 🃏");
    return;
  }

  endRound("Round finished", "You Lose🤬", "", "Dealer Blackjack😈");
}

function startGame() {
  if (!state.hasSelectedDeck || state.selectedDecks === null) {
    ui.modal.classList.remove("hidden");
    return;
  }

  const needsNewShoe = state.deck.length < MIN_SHOE_CARDS;
  if (needsNewShoe) {
    state.deck = logic.createDeck(state.selectedDecks);
    logic.shuffleDeck(state.deck);
    state.cardsGone = 0;
    state.runningCount = 0;
  }

  state.playerHand = [];
  state.dealerHand = [];
  state.roundActive = true;
  state.playerTurn = false;

  drawCardTo(state.playerHand);
  drawCardTo(state.dealerHand);
  drawCardTo(state.playerHand);
  drawCardTo(state.dealerHand);

  setHidden(ui.buttonStartGame, true);
  setHidden(ui.buttonHit, false);
  setHidden(ui.buttonStand, false);
  setHidden(ui.buttonNewGame, false);

  resetMessages();
  renderHands();
  updateCounters();
  evaluateStartHands();
}

function onHit() {
  if (!state.roundActive || !state.playerTurn) {
    return;
  }

  const drawn = drawCardTo(state.playerHand);
  if (drawn === null) {
    endRound("Round finished", "Push", "", "Deck ran out — reshuffling next game");
    return;
  }

  renderHands();
  updateCounters();

  const playerScore = logic.getHandValue(state.playerHand);
  if (playerScore > 21) {
    endRound("Round finished", "Dealer Win😈", "You busted!💥", "");
  }
}

function onStand() {
  if (!state.roundActive) {
    return;
  }

  state.playerTurn = false;
  renderHands();

  while (logic.getHandValue(state.dealerHand) < DEALER_STAND_AT) {
    if (drawCardTo(state.dealerHand) === null) {
      break;
    }
  }

  renderHands();
  updateCounters();

  const dealerScore = logic.getHandValue(state.dealerHand);
  const outcome = logic.compareHands(state.playerHand, state.dealerHand);

  if (outcome === "player") {
    if (dealerScore > 21) {
      endRound("Round finished", "You Win🥳", "Dealer busted!💥", "");
    } else {
      endRound("Round finished", "You Win🥳", "", "");
    }
  } else if (outcome === "dealer") {
    endRound("Round finished", "You Lose🤬", "", "");
  } else {
    endRound("Round finished", "Push", "", "It's a TIE");
  }
}

function onDeckSelected(event) {
  const selected = Number(event.target.textContent.trim());
  if (![2, 4, 6, 8].includes(selected)) {
    return;
  }

  state.selectedDecks = selected;
  state.hasSelectedDeck = true;
  state.deck = [];
  state.cardsGone = 0;
  state.runningCount = 0;
  ui.deckSelectors.forEach((node) => {
    node.classList.toggle("selected", Number(node.textContent.trim()) === selected);
  });
  updateCounters();
}

function closeModal() {
  if (!state.hasSelectedDeck || state.selectedDecks === null) {
    window.alert("Select number of decks before starting.");
    return;
  }
  ui.modal.classList.add("hidden");
}

function init() {
  ui.closeModal.addEventListener("click", closeModal);

  ui.deckSelectors.forEach((selector) => {
    selector.addEventListener("click", onDeckSelected);
  });

  ui.buttonHit.addEventListener("click", onHit);
  ui.buttonStand.addEventListener("click", onStand);
  ui.buttonNewGame.addEventListener("click", startGame);
  ui.buttonStartGame.addEventListener("click", startGame);

  resetMessages();
  updateCounters();
}

init();
