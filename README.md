# Texas Holdem - GA Project 1

## Table of Content
* [Introduction](#Introduction)
* [Development](#Development)
* [Conclusion](#Conclusion)

## Introduction
This is a desktop web based card game with one player and 4 computer. Currently, game info will refresh everytime when page load.

### About Texas Holdem
Texax Holdem is a popular card game with calculation and strategies. Each round a player will get 2 cards in hands, and 5 shared card showing on table with displaying 3 cards, 1 card and 1 card order. There are several stages in a round. At each stage, players can choos check, raise and fold their bet in this around. In the end, depending on the cards combination of each player, the player has the highest ranking combination wins the game and takes all the bets. For more information, please check [wiki](https://en.wikipedia.org/wiki/Texas_hold_%27em) and [WSOP](http://www.wsop.com/poker-games/texas-holdem/).

### Project Background
This is the open project 1 in my General Assembley Software Immersive Bootcamp. The goal is to fully apply HTML, CSS and Javascript skills to develop a web application. After the self developing experience in hangman(link) and group developing experience in tic tac toe (link), I would like to further challenge and develop my skill with Texas Holdem.

### Preview of Final App
| Start of game | End of game |
|:-------------:|:-----------:|
| ![start game][start] | ![end game][end]

[start]: ./readme_files/startgame15fps.gif
[end]: ./readme_files/endgame15fps.gif

## Development
Below are explanations for name used:
* game: start from player with inital funds until he/she runs out fund after rounds.
* turn: or round. Start with intial bet before get hand and end with show all shared cards on table or only one active player (not fold, showhand or out of funds) in this round.
* stage: different phases in a round. often includes: blind, get hand, show flop, show turn, show river and check result. 
* gamer: refers to real person player in game.
* player: refers to either computer and gamer.

| Interface | Game Logic |
| ----------------------- | ------------------------- |
| ![interface][interface] | ![game logic][game_logic] |

[interface]: ./readme_files/handdraft-UI.png
[game_logic]: ./readme_files/handdraft-codeflow.png

### Construct the Game Flow
From the Game Logic, it can be seen that a game has repetitive rounds. In rounds, they have different stages (blind, get hand, show flop, show turn, show river and check result). In each stage, players can check, fold and raise. Once flow for a game round  is constructred. It can be used again and again until the end of them game.
However, the challenges are active players in a game and a game round is dependning on the player activity, and end of each stage is also depending on the player activity. Parameters must be set, and updated on every player activity.

#### stage control


#### computer player character and activity




### Consider Gamer Experience

### The Winning Algorithm

<br>


## Conclusion


<br>
