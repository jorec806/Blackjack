"use strict";

const assert = require("node:assert/strict");
const logic = require("../game-logic.js");

(function testCreateDeck() {
  const deck = logic.createDeck(2);
  assert.equal(deck.length, 104);
  assert.equal(deck.filter((c) => c === "HA").length, 2);
})();

(function testHandValueWithAces() {
  assert.equal(logic.getHandValue(["HA", "C9"]), 20);
  assert.equal(logic.getHandValue(["HA", "C9", "DA"]), 21);
  assert.equal(logic.getHandValue(["HA", "CA", "DA", "SA"]), 14);
})();

(function testBlackjack() {
  assert.equal(logic.isBlackjack(["HA", "CK"]), true);
  assert.equal(logic.isBlackjack(["H10", "DA"]), true);
  assert.equal(logic.isBlackjack(["HA", "C5", "D5"]), false);
  assert.equal(logic.isBlackjack(["HA"]), false);
})();

(function testCompareHands() {
  assert.equal(logic.compareHands(["H10", "C8"], ["D9", "S7"]), "player");
  assert.equal(logic.compareHands(["H10", "C8", "D5"], ["D9", "S7"]), "dealer");
  assert.equal(logic.compareHands(["H10", "C7"], ["DA", "S9", "H8"]), "dealer");
  assert.equal(logic.compareHands(["H10", "C7"], ["D10", "S7"]), "push");
  // ambos bust — el jugador pierde igual
  assert.equal(logic.compareHands(["H10", "C8", "D5"], ["DA", "S9", "H8"]), "dealer");
})();

(function testRunningCount() {
  assert.equal(logic.runningCountDelta("H2"), 1);
  assert.equal(logic.runningCountDelta("H6"), 1);
  assert.equal(logic.runningCountDelta("HK"), -1);
  assert.equal(logic.runningCountDelta("H10"), -1);
  assert.equal(logic.runningCountDelta("HA"), -1);
  assert.equal(logic.runningCountDelta("H7"), 0);
  assert.equal(logic.runningCountDelta("H8"), 0);
  assert.equal(logic.runningCountDelta("H9"), 0);
})();

(function testTrueCount() {
  assert.equal(logic.getTrueCount(6, 156), 2);
  assert.equal(logic.getTrueCount(-4, 104), -2);
  // con 0 cartas restantes no debe lanzar error (usa MIN_DECK_FRACTION)
  assert.equal(logic.getTrueCount(4, 0), 4 / 0.25);
})();

console.log("All blackjack logic tests passed.");
