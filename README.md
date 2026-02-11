# ♥️ ♣️ Cooperative Poker ♦️ ♠️

## How to use
Clone the repo

Install it and run:

```bash
npm install
npm run dev
```

Now you can play Cooperative Poker locally ♥️♣️♦️♠️

## Docker
You can run on docker by creating the .env file and running:
```bash
docker compose up -d --build
```

## The idea behind the example
We wanted to play a nice, realistic Cooperative Poker game online.

We used React, Next and Socket.IO.

## What's next?

Create a pull request to resolve an issue and submit it to review :)

- I need to clone the socket io admin to this project because of the CORS policy
- I need to re-check the Lobby leaving logic. I don't want to reset the score.
- error when host leaves
- toast on copy link
- Show Current hand
- kick system
- Carefully with big name
- Switching cards is not instantaneously
- equivalent hands with different suits are not the same value. It still has the bug :'(
