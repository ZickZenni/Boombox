import { createAudioResource } from '@discordjs/voice';
import {
    Command,
    CommandExecutionData,
    CommandExecutionType,
} from '../structures/command';
import { Languages } from '../structures/lang';
import { GuildTextBasedChannel } from 'discord.js';
import { video_info, yt_validate, stream_from_info } from 'play-dl';

export default new Command({
    run: async (data: CommandExecutionData) => {
        switch (data.type) {
            case CommandExecutionType.TextMessage: {
                const message = data.message!!;
                let connection = data.client.voiceHandler.connections.get(
                    message.guildId!!,
                );
                if (!connection) {
                    // Member isn't connected in a voice channel
                    if (!message.member?.voice.channel) {
                        message.reply({
                            embeds: [
                                data.client.createSimpleEmbed(
                                    0x6b2525,
                                    data.client.langs.getString(
                                        'commands.music.user_not_in_voice_channel',
                                        Languages.English,
                                    ),
                                ),
                            ],
                        });
                        return;
                    }

                    connection = data.client.voiceHandler.connectTo(
                        message.guild!!,
                        message.member?.voice.channel,
                        message.channel as GuildTextBasedChannel,
                    );
                }

                if (data.messageArgs.length < 1) {
                    message.reply({
                        embeds: [
                            data.client.createSimpleEmbed(
                                0x6b2525,
                                data.client.langs.getString(
                                    'commands.play.url_required',
                                    Languages.English,
                                ),
                            ),
                        ],
                    });
                    return;
                }

                const msg = await message.reply({
                    embeds: [
                        data.client.createSimpleEmbed(
                            0x46a7db,
                            data.client.langs.getString(
                                'commands.play.retrieving_information',
                                Languages.English,
                            ),
                        ),
                    ],
                });

                const url = data.messageArgs[0];
                if (yt_validate(url) != 'video') {
                    await msg.edit({
                        embeds: [
                            data.client.createSimpleEmbed(
                                0x6b2525,
                                data.client.langs.getString(
                                    'commands.play.current_support',
                                    Languages.English,
                                ),
                            ),
                        ],
                    });
                    return;
                }

                const info = await video_info(url);
                const stream = await stream_from_info(info, {
                    quality: 0,
                });

                const resource = createAudioResource(stream.stream, {
                    inputType: stream.type,
                    inlineVolume: true,
                    metadata: {},
                });

                if (!connection.playing && connection.queue.length == 0) {
                    await msg.edit({
                        embeds: [
                            data.client.createSimpleEmbed(
                                0x46a7db,
                                data.client.langs
                                    .getString(
                                        'commands.play.now_playing',
                                        Languages.English,
                                    )
                                    .replace(
                                        '<title>',
                                        info.video_details.title ??
                                            'No title available',
                                    ),
                            ),
                        ],
                    });
                } else {
                    await msg.edit({
                        embeds: [
                            data.client.createSimpleEmbed(
                                0x46a7db,
                                data.client.langs
                                    .getString(
                                        'commands.play.added_to_queue',
                                        Languages.English,
                                    )
                                    .replace(
                                        '<title>',
                                        info.video_details.title ??
                                            'No title available',
                                    ),
                            ),
                        ],
                    });
                }

                resource.volume?.setVolumeLogarithmic(
                    connection.calcVolume(connection.getVolume()),
                );

                connection?.queueResource({
                    url: url,
                    resource: resource,
                    title: info.video_details.title ?? 'No title available',
                    requesterId: message.author.id,
                });
                break;
            }
        }
    },
});
