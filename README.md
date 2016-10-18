# Kicker Field

Submit foosball match results right from Slack and view calculated [ELO](https://en.wikipedia.org/wiki/Elo_rating_system) ratings, with history.
Ideal for company foosball competitions.

Made as a quick experiment on HyperDev, see it in action: https://shore-seed.hyperdev.space/

![Ratings history screenshot](https://cdn.hyperdev.com/us-east-1%3A9d51f582-bd64-4f27-a57e-14129f0378a3%2Fratingshistory.png)

## Set up

To set up the project for yourself, set up a MongoDB instance and simply _remix_ the [project on HyperDev](https://hyperdev.com/#!/project/shore-seed). Or deploy the node.js source code.

## Slack Integration

Set up a Slack [slash command](https://api.slack.com/slash-commands) to POST to `/matches`, format:

    /match Jakub,Abhi Leonid,Dima 10:8

## Authors
- [Jakub](https://github.com/jakriz)
- [Leonid](https://github.com/mouse4d)
