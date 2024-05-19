

export const arrayToMap = (array: any[], key: string) => {
  return array.reduce((map, obj) => {
      map.set(obj[key], obj);
      return map;
  }, new Map());
}

export const addToNewMap = (existingMap: Map<string, any>, additionKey: string, additionValue: any) => {
  const newMap = new Map(existingMap);
  newMap.set(additionKey, additionValue);
  return newMap;
}

export const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const from = page ? page * limit : 0
  const to = page ? from + size - 1 : size - 1

  return { from, to }
}