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

                // Sends current volume
                if (data.messageArgs.length < 1) {
                    message.reply({
                        embeds: [
                            data.client.createSimpleEmbed(
                                0x46a7db,
                                data.client.langs
                                    .getString(
                                        'commands.volume.current_volume',
                                        Languages.English,
                                    )
                                    .replace(
                                        '<volume>',
                                        connection.getVolume().toString(),
                                    ),
                            ),
                        ],
                    });
                    return;
                }

                try {
                    const volume = Number.parseInt(data.messageArgs[0]);
                    const maxVolume = data.client.config.maxVolume;

                    if (volume < 0 || volume > maxVolume) {
                        message.reply({
                            embeds: [
                                data.client.createSimpleEmbed(
                                    0x6b2525,
                                    data.client.langs
                                        .getString(
                                            'commands.volume.volume_exceeded',
                                            Languages.English,
                                        )
                                        .replace(
                                            '<max_volume>',
                                            maxVolume.toString(),
                                        ),
                                ),
                            ],
                        });
                        return;
                    }

                    connection.setVolume(volume);

                    message.reply({
                        embeds: [
                            data.client.createSimpleEmbed(
                                0x46a7db,
                                data.client.langs
                                    .getString(
                                        'commands.volume.set_volume',
                                        Languages.English,
                                    )
                                    .replace('<volume>', volume.toString()),
                            ),
                        ],
                    });
                } catch {}
                break;
            case CommandExecutionType.Interaction:
                break;
        }
    },
});
