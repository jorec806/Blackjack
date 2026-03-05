(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BlackjackLogic = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SUITS = ["H", "C", "S", "D"];
  const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  function createDeck(numberOfDecks) {
    const totalDecks = Number(numberOfDecks) || 1;
    const cards = [];

    for (let d = 0; d < totalDecks; d += 1) {
      for (let s = 0; s < SUITS.length; s += 1) {
        for (let r = 0; r < RANKS.length; r += 1) {
          cards.push(SUITS[s] + RANKS[r]);
        }
      }
    }

    return cards;
  }

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = deck[i];
      deck[i] = deck[j];
      deck[j] = tmp;
    }

    return deck;
  }

  function getCardRank(cardCode) {
    return String(cardCode).slice(1);
  }

  function getCardNumericValue(cardCode) {
    const rank = getCardRank(cardCode);

    if (rank === "A") {
      return 11;
    }

    if (["K", "Q", "J"].includes(rank)) {
      return 10;
    }

    return Number(rank);
  }

  function getHandValue(hand) {
    let total = 0;
    let aces = 0;

    for (let i = 0; i < hand.length; i += 1) {
      const rank = getCardRank(hand[i]);
      if (rank === "A") {
        aces += 1;
      }
      total += getCardNumericValue(hand[i]);
    }

    while (total > 21 && aces > 0) {
      total -= 10;
      aces -= 1;
    }

    return total;
  }

  function isBlackjack(hand) {
    return hand.length === 2 && getHandValue(hand) === 21;
  }

  function runningCountDelta(cardCode) {
    const rank = getCardRank(cardCode);

    if (["2", "3", "4", "5", "6"].includes(rank)) {
      return 1;
    }

    if (["10", "J", "Q", "K", "A"].includes(rank)) {
      return -1;
    }

    return 0;
  }

  function compareHands(playerHand, dealerHand) {
    const player = getHandValue(playerHand);
    const dealer = getHandValue(dealerHand);

    if (player > 21) {
      return "dealer";
    }

    if (dealer > 21) {
      return "player";
    }

    if (player > dealer) {
      return "player";
    }

    if (dealer > player) {
      return "dealer";
    }

    return "push";
  }

  function getTrueCount(runningCount, cardsRemaining) {
    const safeCards = Math.max(Number(cardsRemaining) || 0, 1);
    const decksRemaining = Math.max(safeCards / 52, 0.25);
    return runningCount / decksRemaining;
  }

  return {
    createDeck,
    shuffleDeck,
    getCardNumericValue,
    getHandValue,
    isBlackjack,
    runningCountDelta,
    compareHands,
    getTrueCount,
  };
});
