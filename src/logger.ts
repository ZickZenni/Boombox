import chalk from 'chalk';
import dayjs from 'dayjs';

export class Logger {
    static #log(module: string, type: string, ...args: any[]) {
        const time = `[${chalk.blueBright(dayjs().format('HH:mm:ss.SSS'))}]`;
        console.log(`${time} [${chalk.blueBright(module)}/${type}] >> ${args}`);
    }

    static info(...args: any[]) {
        this.#log('Default', chalk.green('Info'), args);
    }

    static info_module(module: string, ...args: any[]) {
        this.#log(module, chalk.green('Info'), args);
    }

    static warn(...args: any[]) {
        this.#log('Default', chalk.yellow('Warn'), args);
    }

    static warn_module(module: string, ...args: any[]) {
        this.#log(module, chalk.yellow('Warn'), args);
    }

    static error(...args: any[]) {
        this.#log('Default', chalk.red('Error'), args);
    }

    static error_module(module: string, ...args: any[]) {
        this.#log(module, chalk.red('Error'), args);
    }
}
