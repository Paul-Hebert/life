# Goal

This project's purpose is to explore turning Conway's Game of Life into a more traditional 1 player game.

According to Wikipedia:

>The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.[1]

>The "game" is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves, or, for advanced "players", by creating patterns with particular properties. The Game has been reprogrammed multiple times in various coding languages.

My goal is to take this basic principle and mix it with more traditional gameplay to create a fun, interesting twist on Conway's Game of Life.

---

# Game Concepts

I had a few ideas about classic game mechanics that could be combined with Conway's Game of Life to create a fun playing experience:

1. "Asteroids" style space shooter
    - The game is composed by a number of levels
    - The player controls a "ship" which is 1 (or maybe more) dots on the grid. 
    - These player's dots to not follow the usual rules
    - The player can move their spaceship around the map and shoot ammunition which destroys normal dots.
    - Each level starts prepopulated with different grid configurations of varying difficult.
2. "Space Invaders" style space shooter
    - The game is composed by a number of levels
    - The player controls a "ship" which is at the bottom of the grid and can move right or left.
    - The ship can shoot ammunition which destroys cells it hits.
    - The player faces multiple waves of cellular structures.
    - These structures use organisms like guns and gliders that move towards the bottom of the screen.
    - If any cell reaches the bottom of the screen the player loses. 
3. Puzzle Game
    - The game is composed by a number of levels
    - Each level has a main area populated by a number of cells
    - The player has a limited number of cells they can place per level
    - The player must place their cells in a "starting zone" 
    - The player's cells are a different color from regular cells, and die if they come into contact with regular cells (Or maybe they both die?)
    - The player attempts to get their cells across a finish line without them all dying.