# One Drop at a Time

A browser-based puzzle game built with HTML, CSS, and JavaScript inspired by the mission of [Charity: Water](https://www.charitywater.org/). Players dig tunnels and route clean water from a spring to a reservoir while collecting jugs and avoiding contamination pockets.

## How to Play

1. **Dig tunnels** — click or click-and-drag cells on the board to excavate a route.
2. **Collect jugs** — route your water through jug cells to secure them (tracked by the stars at the top).
3. **Avoid dirty water** — orange contamination pockets will fail the mission if clean water reaches them.
4. **Release the water** — click **Release Water** to send water flowing along your path.
5. **Fill the reservoir** — water must reach the green goal cell in the bottom-right corner to win.

## Difficulty Modes

| Mode   | Rock barriers | Dirty water pockets | Route length limit |
|--------|--------------|--------------------|--------------------|
| Easy   | Fewer         | None               | Unlimited          |
| Medium | Some          | Some               | Unlimited          |
| Hard   | All           | All                | Limited cells      |

Hard mode adds a maximum route length. The limit is calculated from the shortest possible all-jug path plus a small buffer, so a clever route is always achievable.

## Levels

The game has **5 levels**, each with a unique layout of rocks, contamination pockets, and jugs. Complete a level to unlock the next one. You can replay any unlocked level from the side panel.

## Project Structure

```
index.html   — game markup and layout
styles.css   — all visual styling
script.js    — game logic (board, path-finding, water animation, levels)
win.mp3      — victory sound effect
img/         — image assets
```

## Running the Game

Open `index.html` in any modern browser — no build step or server required.

## About Charity: Water

Charity: Water is a non-profit bringing clean and safe drinking water to people in developing countries. Every puzzle in this game is paired with a real water fact to raise awareness of the global water crisis.
