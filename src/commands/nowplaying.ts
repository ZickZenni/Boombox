import { EmbedBuilder } from '@discordjs/builders';
import {
    Command,
    CommandExecutionData,
    CommandExecutionType,
} from '../structures/command';
import { Languages } from '../structures/lang';

export default new Command({
    run: async (data: CommandExecutionData) => {
        switch (data.type) {
            case CommandExecutionType.TextMessage:
                const message = data.message!!;
                const connection = data.client.voiceHandler.connections.get(
                    message.guildId!!,
                );
                if (!connection) {
                    message.reply({
                        embeds: [
                            data.client.createSimpleEmbed(
                                0x6b2525,
                                data.client.langs.getString(
                                    'commands.music.bot_not_in_voice_channel',
                                    Languages.English,
                                ),
                            ),
                        ],
                    });
                    return;
                }

                const item = connection.playingItem;
                if (item == null) {
                    message.reply({
                        embeds: [
                            data.client.createSimpleEmbed(
                                0x6b2525,
                                data.client.langs.getString(
                                    'commands.music.nothing_is_playing',
                                    Languages.English,
                                ),
                            ),
                        ],
                    });
                    return;
                }

                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(':microphone2: - Now Playing')
                            .setColor(0x46a7db)
                            .setDescription(`[${item.title}](${item.url})`)
                            .setFields([
                                {
                                    name: 'Requested by:',
                                    value: `<@${item.requesterId}>`,
                                },
                            ]),
                    ],
                });

                break;
            case CommandExecutionType.Interaction:
                break;
        }
    },
});
