import { EmbedBuilder } from 'discord.js';
import {
    Command,
    CommandExecutionData,
    CommandExecutionType,
} from '../structures/command';

export default new Command({
    name: 'help',
    description: 'Show all commands with their usage and description!',
    run: async (data: CommandExecutionData) => {
        switch (data.type) {
            case CommandExecutionType.TextMessage:
                data.message?.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(':newspaper:   All Commands')
                            .setColor(0x46a7db)
                            .setDescription(
                                data.client.commands
                                    .map((cmd) => {
                                        return `\`${cmd.name}\`  \`${cmd.description}\``;
                                    })
                                    .join('\n'),
                            ),
                    ],
                });
                break;
            case CommandExecutionType.Interaction:
                break;
        }
    },
});
