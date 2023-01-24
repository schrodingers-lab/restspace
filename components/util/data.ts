import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

export const generateRandomName = () => {
    const customConfig: Config = {
        dictionaries: [adjectives, colors],
        separator: '-',
        length: 2,
      };

      return uniqueNamesGenerator(customConfig)
}