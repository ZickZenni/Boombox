import {
    joinVoiceChannel,
    VoiceConnection as DiscordVoiceConnection,
    createAudioPlayer,
    AudioPlayer,
    AudioResource,
    AudioPlayerStatus,
} from '@discordjs/voice';
import {
    Collection,
    Guild,
    GuildTextBasedChannel,
    VoiceBasedChannel,
} from 'discord.js';
import { Logger } from '../logger';

export interface VoiceQueueDetails {
    url: string;
    title: string;
    requesterId: string;
    thumbnailUrl?: string | null;
}

export interface VoiceQueueItem {
    details: VoiceQueueDetails;
    resource: AudioResource;
}

export class VoiceConnection {
    public readonly guild: Guild;

    public channel: VoiceBasedChannel;

    public readonly textChannel: GuildTextBasedChannel | null;

    public readonly connection: DiscordVoiceConnection;

    public readonly player: AudioPlayer;

    public disconnected: boolean = false;

    public playing: boolean = false;

    public queue: Array<VoiceQueueItem> = new Array();

    public playingItem: VoiceQueueItem | null = null;

    #currentResource: AudioResource | null = null;

    #volume: number = 100;

    public constructor(
        guild: Guild,
        channel: VoiceBasedChannel,
        textChannel: GuildTextBasedChannel | null = null,
    ) {
        this.guild = guild;
        this.channel = channel;
        this.textChannel = textChannel;
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        this.player = createAudioPlayer();
        this.player.on(AudioPlayerStatus.Idle, async () => {
            Logger.info_module('AudioPlayer', 'Stopped playing.');

            this.playing = false;
            this.#currentResource = null;
            this.playingItem = null;

            if (this.queue.length > 0) {
                this.#playQueue();
            }
        });
        this.connection.subscribe(this.player);

        Logger.info_module(
            'VoiceConnection',
            `Connected to voice channel '${channel.name}' in '${guild.name}'`,
        );
    }

    #playQueue() {
        if (this.queue.length == 0 || this.playing) {
            return;
        }

        const item = this.queue.shift();
        this.playingItem = item!!;
        this.playResource(item!!.resource, true);

        // Todo: Send messages when playing something from queue
        /*if (this.textChannel) {
            this.textChannel.send(`Ich spiele jetzt **${item!!.title}** ab!`);
        }*/
        Logger.info_module(
            'AudioPlayer',
            `Now playing '${item!!.details.title}'`,
        );
    }

    queueResource(item: VoiceQueueItem) {
        this.queue.push(item);
        this.#playQueue();
    }

    playResource(resource: AudioResource, force: boolean = false) {
        if (!force && this.playing) {
            return;
        }
        if (force && this.playing) {
            this.stopPlaying();
        }
        resource.volume?.setVolume(this.calcVolume(this.#volume));
        this.player.play(resource);
        this.playing = true;
        this.#currentResource = resource;
    }

    stopPlaying() {
        if (this.playing) {
            this.playing = false;
            this.player.stop(true);
        }
    }

    setVolume(volume: number) {
        if (!this.playing || this.#currentResource == null) {
            return;
        }
        this.#volume = volume;
        this.setResourceVolume(volume, this.#currentResource);
    }

    getVolume(): number {
        return this.#volume;
    }

    setResourceVolume(volume: number, resource: AudioResource) {
        resource.volume?.setVolume(this.calcVolume(volume));
    }

    calcVolume(volume: number): number {
        return ((volume * 0.5) / 100) * 0.45;
    }

    disconnect() {
        if (this.disconnected) {
            return;
        }

        this.connection.destroy();
        this.disconnected = true;
        Logger.info_module(
            'VoiceHandler',
            `Disconnecting from '${this.channel.name}'`,
        );
    }
}

export class VoiceHandler {
    public connections: Collection<string, VoiceConnection> = new Collection();

    connectTo(
        guild: Guild,
        channel: VoiceBasedChannel,
        textChannel: GuildTextBasedChannel | null = null,
    ): VoiceConnection {
        if (!this.connections.get(guild.id)) {
            const connection = new VoiceConnection(guild, channel, textChannel);
            this.connections.set(guild.id, connection);
            return connection;
        }
        return this.connections.get(guild.id)!!;
    }
}
