import { Collection } from 'discord.js';
import fs from 'fs';

export enum Languages {
    English = 'en_us',
    German = 'de_de',
}

class Language {
    public values: Collection<string, string> = new Collection();

    public constructor(language: Languages, langFolderPath: string) {
        const path = `${langFolderPath}${language}.json`;
        const file = fs.readFileSync(path, 'utf-8');
        const json = JSON.parse(file);
        for (var key in json) {
            const value = json[key];
            if (typeof value == 'string') {
                this.values.set(key, value);
            }
        }
    }
}

export class LanguageManager {
    #languages: Collection<Languages, Language> = new Collection();

    public constructor(langFolderPath: string) {
        this.#languages.set(
            Languages.English,
            new Language(Languages.English, langFolderPath),
        );
        this.#languages.set(
            Languages.German,
            new Language(Languages.German, langFolderPath),
        );
    }

    getString(key: string, language: Languages): string {
        const lang = this.#languages.get(language);
        if (!lang) {
            return `<NOT_FOUND:${language}:${key}>`;
        }
        const value = lang.values.get(key);
        if (!value) {
            return `<NOT_FOUND:${language}:${key}>`;
        }
        return value;
    }
}
