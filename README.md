# Touch the Fire

![Team Photo](Insert a Team Photo URL here)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

Touch the Fire is a WASD multiplayer game with two teams of 3-5 players (students and defenders). The goal of the students is to get one player to touch the fire, and the goal of the defenders is to prevent anyone from touching the fire. 

The game consists of five 60 second rounds in which the students attempt to reach the fire. The rounds can end in 2 ways:

* The time limit is reached
* The students reach the fire

Teams switch sides after each round. If the students did reach the fire in X seconds, the new students now have a time limit of X seconds to reach the fire. If they are successful, they score a point. Otherwise, the opposing team scores a point.

If neither team reaches the fire, a sudden death round occurs in which two random people from each team compete head-to-head to score a point.

The first team to score 3 points wins the game.

## Architecture

### Frontend

### Backend

* Socket.io
    * Used to communicate between the server and the browser
* Express
* Webpack

TODO:  descriptions of code organization and tools and libraries used
- Mongo
- React
- NodeJS

## Setup

TODO: how to get the project dev environment up and running, npm install etc

- yarn add socket.io, express, webpack
- yarn start
- yarn dev
- yarn build

## Deployment

TODO: how to deploy the project
- yarn deploy

## Authors

* Arjun Miklos
* Bibaswan Khadka
* Devon Chen
* Quinn Spraut
* Scott Stuart
* Suraj Srivats

## Acknowledgments
