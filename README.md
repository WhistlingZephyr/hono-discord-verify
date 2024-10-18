# hono-discord-verify

---

[![version](https://img.shields.io/npm/v/hono-discord-verify.svg)](https://www.npmjs.com/package/hono-discord-verify)
[![ci](https://github.com/WhistlingZephyr/hono-discord-verify/actions/workflows/ci.yml/badge.svg)](https://github.com/WhistlingZephyr/hono-discord-verify/actions/workflows/ci.yaml)
![Downloads](https://img.shields.io/npm/dt/hono-discord-verify)

A Discord HTTP bot verification middleware for [Hono](https://hono.dev/). Built on top of [discord-interactions](https://www.npmjs.com/package/discord-interactions).

## Installation

```sh
npm i hono-discord-verify
```

## Usage

```ts
import { Hono } from "hono";
import discordVerify from "hono-discord-verify";
import {
    InteractionResponseType,
    InteractionType,
    type APIInteractionResponse,
} from "discord-api-types/v10";

const app = new Hono();

app.post("/interactions", discordVerify(publicKey), (c) => {
    const interaction = c.get("interaction");
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.data?.name === "ping") {
            return c.json<APIInteractionResponse>({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Pong!",
                },
            });
        }
    }
    return c.text("Invalid interaction", 401);
});
```

See [discord-api-types](https://www.npmjs.com/package/discord-api-types) for types and [discord-interactions](https://www.npmjs.com/package/discord-interactions) for more info.
