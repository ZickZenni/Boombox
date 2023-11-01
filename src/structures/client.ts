import {
    ActivityType,
    ClientOptions,
    Collection,
    Client as DiscordClient,
    EmbedBuilder,
} from 'discord.js';
import { BotConfig } from './config';

import fs from 'fs';
import { glob } from 'glob';
import { basename, sep } from 'path';
import { Command } from './command';
import { VoiceHandler } from './voice';
import { LanguageManager } from './lang';
import { Logger } from '../logger';
import chalk from 'chalk';

export class BoomboxClient extends DiscordClient {
    public static readonly ErrorEmbedColor: number = 0x6b2525;
    public static readonly SuccessEmbedColor: number = 0x46a7db;

    public readonly config: BotConfig;

    public readonly voiceHandler: VoiceHandler = new VoiceHandler();

    public readonly langs: LanguageManager = new LanguageManager(
        `${__dirname}/../../assets/lang/`,
    );

    public commands: Collection<string, Command> = new Collection();

    public ready: boolean = false;

    public constructor(options: ClientOptions) {
        super(options);

        const configPath = `${__dirname}/../../config.json`;
        const configFile = fs.readFileSync(configPath, 'utf-8');
        this.config = JSON.parse(configFile) as BotConfig;
    }

    async #registerEvents() {
        const files = await glob(
            `${__dirname.split(sep).join('/')}/../events/*{.ts,.js}`,
        );

        let count = 0;
        for (const f of files) {
            let name = basename(f);
            name = name.substring(0, name.lastIndexOf('.')) || name;

            const event = (await import(f)) as any;
            this.on(event.default.event, event.default.run.bind(null, this));
            count++;

            Logger.info_module('Client', `Registered event: ${name}`);
        }

        Logger.info_module(
            'Client',
            chalk.greenBright(`Registered ${count} events!`),
        );
    }

    async #registerCommands() {
        const files = await glob(
            `${__dirname.split(sep).join('/')}/../commands/*{.ts,.js}`,
        );

        let count = 0;
        for (const f of files) {
            let name = basename(f);
            name = name.substring(0, name.lastIndexOf('.')) || name;

            const command = (await import(f)) as Command;
            this.commands.set(name, command);
            count++;

            Logger.info_module('Client', `Registered command: ${name}`);
        }

        Logger.info_module(
            'Client',
            chalk.greenBright(`Registered ${count} commands!`),
        );
    }

    // Todo: Fix crashing that "this" is not the client
    #updatePresence() {
        let users = 0;

        this.guilds.cache.forEach((value, _) => {
            users += value.memberCount;
        });

        this.user?.setPresence({
            activities: [
                {
                    name: `🔊 Serving ${users} users!`,
                    type: ActivityType.Custom,
                },
            ],
        });
    }

    public async init(): Promise<void> {
        await this.login(this.config.token);

        Logger.info_module('Client', 'Starting bot...');

        await new Promise((resolve) => {
            setTimeout(resolve, 3000);
        });

        await this.#registerEvents();
        await this.#registerCommands();

        this.ready = true;
        this.user?.setPresence({
            activities: [
                {
                    name: `🔊 Serving music to everyone!`,
                    type: ActivityType.Custom,
                },
            ],
        });

        //this.#updatePresence();
        //setInterval(this.#updatePresence, 1000 * 60);

        Logger.info_module(
            'Client',
            `${chalk.cyan(
                this.user?.username,
            )} is now online and running on ${chalk.blueBright(
                this.guilds.cache.size,
            )} ${chalk.greenBright(
                this.guilds.cache.size == 1 ? 'server' : 'servers',
            )}!`,
        );
    }

    public createSimpleEmbed(color: number, description: string): EmbedBuilder {
        return new EmbedBuilder().setColor(color).setDescription(description);
    }
}
