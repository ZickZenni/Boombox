import {
    Command,
    CommandExecutionData,
    CommandExecutionType,
} from '@structures/command';
import { Languages } from '@structures/lang';

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

                connection.disconnect();

                message.reply({
                    embeds: [
                        data.client.createSimpleEmbed(
                            0x46a7db,
                            data.client.langs.getString(
                                'commands.stop.stopped_playing',
                                Languages.English,
                            ),
                        ),
                    ],
                });
                break;
            case CommandExecutionType.Interaction:
                break;
        }
    },
});
