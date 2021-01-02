# Datas

A small microservice / server / app to hold some api integrations so I can build other stuff without having to always also build the 3rd-party integrations.

View the [demo website](htttps://datas.alorg.net).

Otherwise, hit the open api:

```bash
# for GB random game
curl https://datas.alorg.net/api/v1/games/random

# for IGDB random game
curl https://datas.alorg.net/api/v1/games/random?client=igdb
```

If you keep hitting these endpoints inappropriately, you'll get rate-limited. That means **we all get rate-limited**. Please don't ruin it for everyone else.

### Current logic integraitons

- Getting a random video game from [GiantBomb's Game Api](https://giantbomb.com/api)
- Getting a random video game from [IGDB's Game Api](https://api-docs.igdb.com/#about)

# License

MIT
