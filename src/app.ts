import { BoomboxClient } from '@structures/client';
import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';

const client = new BoomboxClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
    presence: {
        activities: [
            {
                name: '🚨 Starting...',
                type: ActivityType.Custom,
            },
        ],
    },
});

(async (): Promise<void> => await client.init())();
