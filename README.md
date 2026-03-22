# Blackjack

A browser-based Blackjack game built with vanilla JavaScript, HTML5, and CSS3. No frameworks or external dependencies.

## Features

- Classic Blackjack gameplay (Hit, Stand, Blackjack detection)
- Configurable shoe: 2, 4, 6, or 8 decks
- **Hi-Lo card counting** — displays Running Count and True Count in real time
- Automatic shoe reshuffle when fewer than 15 cards remain
- Custom card images and fonts

## How to Play

Open `index.html` in any modern browser — no build step or server required.

1. Select the number of decks in the modal and press **START PLAYING**
2. Use **HIT** to draw a card or **STAND** to end your turn
3. The dealer draws until reaching 17 or more
4. Press **NEW GAME** to start the next round

### Card Values

| Card | Value |
|---|---|
| 2 – 10 | Face value |
| J, Q, K | 10 |
| Ace | 11 (or 1 if hand would bust) |

## Project Structure

```
Blackjack/
├── index.html          # Markup and game rules modal
├── script.js           # UI, state management, game flow
├── game-logic.js       # Pure game logic module (no DOM dependencies)
├── style.css           # Layout and styling
├── tests/
│   └── logic.test.js   # Unit tests for game logic
├── cards/              # Card images (PNG)
└── fonts/              # Custom fonts (Klassiq, OpenSans)
```

## Running the Tests

Requires Node.js. No test runner needed — tests use the built-in `assert` module.

```bash
node tests/logic.test.js
```

## Architecture

`game-logic.js` is a self-contained UMD module with no DOM dependencies. It exposes pure functions for deck creation, hand evaluation, card counting, and hand comparison. This makes it independently testable and reusable.

`script.js` imports the logic module, owns all UI state, and handles user interaction.

## Card Counting (Hi-Lo System)

| Cards | Count |
|---|---|
| 2 – 6 | +1 |
| 7 – 9 | 0 |
| 10, J, Q, K, A | -1 |

The **True Count** normalizes the running count by the number of decks remaining, giving a more accurate indicator of deck composition.
