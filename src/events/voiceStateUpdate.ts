import { Events, VoiceState } from 'discord.js';
import { Event } from '@structures/event';

export default new Event(
    Events.VoiceStateUpdate,
    async (client, oldState: VoiceState, newState: VoiceState) => {
        const connection = client.voiceHandler.connections.get(
            oldState.guild.id,
        );

        // Ignore if a connection doesn't exist or it's not the bot
        if (!connection || newState.member!!.id != client.user!!.id) {
            return;
        }

        // Bot was disconnected
        if (newState.channelId === null) {
            connection.disconnect();
            client.voiceHandler.connections.delete(oldState.guild.id);

            /*Logger.info_module(
                'VoiceState',
                'Bot was disconnected and the connection has been destroyed!',
            );*/
        } else {
            // Bot was moved
            if (connection.channel.id != newState.channel!!.id) {
                connection.channel = newState.channel!!;
                /*Logger.info_module(
                    'VoiceState',
                    'Bot has been moved to another channel!',
                );*/
            }
        }
    },
);
