import { ActivityType, Events, GuildTextBasedChannel } from 'discord.js';
import { Event } from '../structures/event';
import { Logger } from 'logger';
import chalk from 'chalk';

export default new Event(Events.ClientReady, async (client) => {
    if (!client.isReady()) return;

    client.user.setPresence({
        activities: [
            {
                name: 'Starting...',
                type: ActivityType.Custom,
            },
        ],
        status: 'dnd',
    });

    /*client.user.setPresence({
        status: 'online',
        activities: [
            {
                name: '🔊 Serving open-source',
                type: ActivityType.Custom,
            },
        ],
    });

    Logger.info_module(
        'Client',
        `${chalk.cyan(
            client.user?.username,
        )} is now online and running on ${chalk.blueBright(
            client.guilds.cache.size,
        )} ${chalk.greenBright(
            client.guilds.cache.size == 1 ? 'server' : 'servers',
        )}!`,
    );*/
});
