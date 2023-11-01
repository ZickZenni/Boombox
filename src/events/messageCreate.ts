import { Events, GuildTextBasedChannel } from 'discord.js';
import { Event } from '@structures/event';
import {
    CommandExecutionData,
    CommandExecutionType,
} from '@structures/command';

export default new Event(Events.MessageCreate, async (client, message) => {
    const { guild, channel, author, content } = message;

    if (author.bot) return;

    if (!content.startsWith(client.config.prefix)) return;

    const commandName = content.substring(1).split(' ')[0];

    const command = client.commands.get(commandName) as any;

    if (!command) return;

    command.default.run(
        new CommandExecutionData(
            client,
            content,
            author,
            channel as GuildTextBasedChannel,
            CommandExecutionType.TextMessage,
            message,
        ),
    );
});
