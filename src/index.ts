import { createMiddleware } from "hono/factory";
import { verifyKey } from "discord-interactions";
import {
    InteractionResponseType,
    InteractionType,
    type APIInteraction,
    type APIInteractionResponse,
} from "discord-api-types/v10";
import camelize, { type Camelize } from "camelize-ts";

const discordVerify = (publicKey: string) =>
    createMiddleware<{
        Variables: { interaction: Camelize<APIInteraction> };
    }>(async (c, next) => {
        const signature = c.req.header("X-Signature-Ed25519");
        const timestamp = c.req.header("X-Signature-Timestamp");
        if (!signature || !timestamp) {
            return c.text("Invalid request headers.", 401);
        }

        const rawBody = await c.req.text();
        const isValid = await verifyKey(
            rawBody,
            signature,
            timestamp,
            publicKey,
        );
        if (!isValid) {
            return c.text("Failed to verify request.", 401);
        }

        const body = JSON.parse(rawBody) as APIInteraction;
        if (body.type === InteractionType.Ping) {
            return c.json<APIInteractionResponse>({
                type: InteractionResponseType.Pong,
            });
        }

        c.set("interaction", camelize(body));
        await next();
    });

export default discordVerify;
