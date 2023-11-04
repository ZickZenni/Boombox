import chalk from 'chalk';
import dayjs from 'dayjs';

export class Logger {
    static #log(module: string, type: string, ...args: any[]) {
        const time = chalk.hex('#85b569')(dayjs().format('HH:mm:ss.SSS'));
        console.log(
            `${time} | ${type} | ${chalk.rgb(184, 198, 175)(module)}: ${args}`,
        );
    }

    static debug(...args: any[]) {
        this.#log('Default', chalk.hex('#5298d1')('Debug'), args);
    }

    static debug_module(module: string, ...args: any[]) {
        this.#log(module, chalk.hex('#5298d1')('Debug'), args);
    }

    static info(...args: any[]) {
        this.#log('Default', chalk.hex('#85b569')('Info '), args);
    }

    static info_module(module: string, ...args: any[]) {
        this.#log(module, chalk.hex('#85b569')('Info '), args);
    }

    static warn(...args: any[]) {
        this.#log('Default', chalk.yellow('Warn '), args);
    }

    static warn_module(module: string, ...args: any[]) {
        this.#log(module, chalk.yellow('Warn '), args);
    }

    static error(...args: any[]) {
        this.#log('Default', chalk.red('Error'), args);
    }

    static error_module(module: string, ...args: any[]) {
        this.#log(module, chalk.red('Error'), args);
    }
}
