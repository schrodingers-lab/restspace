import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

export const generateRandomName = () => {
    const customConfig: Config = {
        dictionaries: [adjectives, colors],
        separator: '-',
        length: 2,
      };

      return uniqueNamesGenerator(customConfig)
}


export const arrayToMap = (array: any[], key: string) => {
  return array.reduce((map, obj) => {
      map.set(obj[key], obj);
      return map;
  }, new Map());
}

export const addToNewMap = (existingMap: Map<string, any>, additionKey: string, additionValue: any) => {
  debugger;
  const newMap = new Map(existingMap);
  newMap.set(additionKey, additionValue);
  return newMap;
}