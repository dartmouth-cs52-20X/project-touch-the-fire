# Touch the Fire
![Team Photo](Insert a Team Photo URL here)

Touch the Fire is a WASD multiplayer game with two teams of 3-5 players (students and defenders). The goal of the students is to get one player to touch the fire, and the goal of the defenders is to prevent anyone from touching the fire. 

The game consists of five 60 second rounds in which the students attempt to reach the fire. The rounds can end in 2 ways:

* The time limit is reached
* The students reach the fire

Teams switch sides after each round. If the students did reach the fire in X seconds, the new students now have a time limit of X seconds to reach the fire. If they are successful, they score a point. Otherwise, the opposing team scores a point.

If neither team reaches the fire, a sudden death round occurs in which two random people from each team compete head-to-head to score a point.

The first team to score 3 points wins the game.

## Architecture

* Socket.io
    * Used to communicate between the server and the browser
* Express
    * Used to handle multiple requests server-side
* Webpack
    * Used for compilation
* Phaser.js
    * Library to handle game function

## Setup

This project requires both the code in this repo and the [client repo](https://github.com/dartmouth-cs52-20X/project-touch-the-fire)

### Client Repo

Find our dev site [here.](http://touch-the-fire.surge.sh/)

The game is hosted locally on port 8080.

- `yarn install`
- `yarn start`

### Server Repo

Find our dev server [here.](https://touch-the-fire-api.herokuapp.com/)

The server is hosted locally on port 9090.

- `yarn install`
- `yarn dev`

## Deployment

### Client Repo

To push to the dev site, simply push to `origin master`. Travis takes care of the rest.

### Server Repo

The server is hosted through Heroku.

- `git push origin master`

## Authors

* Arjun Miklos
* Bibaswan Khadka
* Devon Chen
* Quinn Spraut
* Scott Stuart
* Suraj Srivats

## Acknowledgments

### Testing
heroku deploy test
