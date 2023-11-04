import { Collection } from 'discord.js';
import { Logger } from '../logger';
import chalk from 'chalk';

export class Profiler {
    public readonly name: string;

    #profiles: Collection<string, number> = new Collection();

    public constructor(name: string) {
        this.name = name;
    }

    public push(id: string) {
        this.#profiles.set(id, Date.now());
    }

    public pop(id: string): number {
        const profile = this.#profiles.get(id);
        if (profile == undefined) {
            return -1;
        }

        const diff = Date.now() - profile;
        const milliseconds = diff / 1000;

        Logger.debug_module(
            'Profiler',
            `${chalk.gray(this.name)} - ${chalk.yellow(
                id,
            )} took ${milliseconds}s!`,
        );
        this.#profiles.delete(id);
        return 0;
    }
}
