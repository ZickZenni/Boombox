import { GuildTextBasedChannel, Message, User } from 'discord.js';
import { BoomboxClient } from './client';

export enum CommandExecutionType {
    TextMessage,
    Interaction,
}

export class CommandExecutionData {
    public readonly client: BoomboxClient;

    public readonly content: string;

    public readonly author: User;

    public readonly channel: GuildTextBasedChannel;

    public readonly type: CommandExecutionType;

    public readonly message: Message | undefined;

    public readonly messageArgs: string[];

    public constructor(
        client: BoomboxClient,
        content: string,
        author: User,
        channel: GuildTextBasedChannel,
        type: CommandExecutionType,
        message: Message | undefined = undefined,
    ) {
        this.client = client;
        this.content = content;
        this.author = author;
        this.channel = channel;
        this.message = message;
        this.type = type;

        const args = content.substring(client.config.prefix.length).split(' ');
        args.shift();
        this.messageArgs = args;
    }
}

interface CommandOptions {
    name: string;
    description: string;
    run: (data: CommandExecutionData) => void;
}

export class Command {
    public name: string;
    public description: string;
    public run: (data: CommandExecutionData) => void;

    public constructor(options: CommandOptions) {
        this.name = options.name;
        this.description = options.description;
        this.run = options.run;
    }
}
