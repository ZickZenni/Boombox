import { createAudioResource } from '@discordjs/voice';
import {
    Command,
    CommandExecutionData,
    CommandExecutionType,
} from '../structures/command';
import { Languages } from '../structures/lang';
import { GuildTextBasedChannel } from 'discord.js';
import {
    video_info,
    yt_validate,
    stream_from_info,
    validate,
    refreshToken,
    is_expired,
    spotify,
    search,
    SpotifyTrack,
} from 'play-dl';
import { Logger } from '../logger';

export default new Command({
    name: 'play',
    description: 'Play some nice music!',
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

                let url = data.messageArgs[0];
                const type = await validate(url);

                if (type != 'yt_video' && type != 'sp_track') {
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

                if (type == 'sp_track') {
                    if (is_expired()) {
                        Logger.debug_module(
                            'Spotify',
                            'Spotify token seems to be expired, refreshing...',
                        );
                        await refreshToken(); // This will check if access token has expired or not. If yes, then refresh the token.
                    }

                    const sp_startTime = Date.now();

                    let spotifyData = await spotify(url);
                    let searchQuery = spotifyData.name;

                    Logger.debug_module(
                        'PlayCommand',
                        `Queried spotify data in ${
                            (Date.now() - sp_startTime) / 1000
                        }ms!`,
                    );

                    if (spotifyData.type === 'track') {
                        searchQuery +=
                            ' - ' +
                            (spotifyData as SpotifyTrack).artists[0].name;
                    }

                    let yt_startTime = Date.now();

                    let searched = await search(searchQuery, {
                        limit: 1,
                    });

                    Logger.debug_module(
                        'PlayCommand',
                        `Searched video in ${
                            (Date.now() - yt_startTime) / 1000
                        }ms!`,
                    );

                    url = searched[0].url;
                }

                let vi_startTime = Date.now();

                const info = await video_info(url);

                Logger.debug_module(
                    'PlayCommand',
                    `Request of video took ${
                        (Date.now() - vi_startTime) / 1000
                    }ms!`,
                );

                const stream = await stream_from_info(info, {
                    quality: 0,
                });

                const resource = createAudioResource(stream.stream, {
                    inputType: stream.type,
                    inlineVolume: true,
                    metadata: {},
                });

                const thumbnailUrl =
                    info.video_details.thumbnails.length > 0
                        ? info.video_details.thumbnails[0].url
                        : null;

                if (!connection.playing && connection.queue.length == 0) {
                    await msg.edit({
                        embeds: [
                            data.client
                                .createSimpleEmbed(
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
                                )
                                .setThumbnail(thumbnailUrl),
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

                connection.queueResource({
                    details: {
                        url: url,
                        title: info.video_details.title ?? 'No title available',
                        requesterId: message.author.id,
                        thumbnailUrl: thumbnailUrl,
                    },
                    resource: resource,
                });
                break;
            }
        }
    },
});
