import { validator } from "hono/validator";
import { verifyKey } from "discord-interactions";
import type { APIInteraction } from "discord-api-types/v10";

const keyValidator = (publicKey: string) =>
    validator("header", async (value, c) => {
        // headers are converted to lowercase when fetching all of them as an object, https://hono.dev/docs/api/request#header
        const signature = value["x-signature-ed25519"];
        const timestamp = value["x-signature-timestamp"];
        if (
            !signature ||
            !timestamp ||
            typeof signature !== "string" ||
            typeof timestamp !== "string"
        ) {
            return c.json({ error: "Invalid request headers." }, 401);
        }

        const rawBody = await c.req.text();
        const isValid = await verifyKey(
            rawBody,
            signature,
            timestamp,
            publicKey,
        );
        if (!isValid) {
            return c.json({ error: "Failed to verify request." }, 401);
        }

        const body = JSON.parse(rawBody) as APIInteraction;
        return { body };
    });

export default keyValidator;
