import { ClientEvents } from 'discord.js';
import { BoomboxClient } from '../structures/client';

export class Event<K extends keyof ClientEvents> {
    public constructor(
        public event: K,

        public run: (
            client: BoomboxClient,
            ...args: ClientEvents[K]
        ) => Promise<void> | void,
    ) {}
}
