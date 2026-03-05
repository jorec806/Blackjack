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
  assert.equal(logic.isBlackjack(["HA", "C5", "D5"]), false);
})();

(function testCompareHands() {
  assert.equal(logic.compareHands(["H10", "C8"], ["D9", "S7"]), "player");
  assert.equal(logic.compareHands(["H10", "C8", "D5"], ["D9", "S7"]), "dealer");
  assert.equal(logic.compareHands(["H10", "C7"], ["DA", "S9", "H8"]), "dealer");
  assert.equal(logic.compareHands(["H10", "C7"], ["D10", "S7"]), "push");
})();

(function testRunningCount() {
  assert.equal(logic.runningCountDelta("H2"), 1);
  assert.equal(logic.runningCountDelta("HK"), -1);
  assert.equal(logic.runningCountDelta("H8"), 0);
})();

(function testTrueCount() {
  assert.equal(logic.getTrueCount(6, 156), 2);
  assert.equal(logic.getTrueCount(-4, 104), -2);
})();

console.log("All blackjack logic tests passed.");
