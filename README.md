# hono-discord-verify

A Discord HTTP bot verification middleware for [Hono](https://hono.dev/). Built on top of [discord-interactions](https://www.npmjs.com/package/discord-interactions).

## Installation

```sh
npm i hono-discord-verify
```

## Usage

```ts
app.post("/interactions", keyValidator(publicKey, true), (c) => {
    const body = c.req.valid("header").body;
    if (body.type === InteractionType.Ping) {
        return c.json({
            type: InteractionResponseType.Pong,
        } satisfies APIInteractionResponse);
    } else if (body.type === InteractionType.ApplicationCommand) {
        if (body.data?.name === "ping") {
            return c.json({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Pong!",
                },
            } satisfies APIInteractionResponse);
        }
    }
    return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: "Invalid command.",
        },
    } satisfies APIInteractionResponse);
});
```
