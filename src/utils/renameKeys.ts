function renameKeys<T>(
  obj: Record<string, any>,
  newKeys: Record<
    string,
    string | { key: string; map: (item: any, obj: any) => any }
  >
) {
  const result: any = {};
  Object.entries(newKeys).forEach(([key, val]) => {
    if (typeof val === 'string') {
      result[val] = obj[key];
    } else {
      result[val.key] = val.map(obj[key], obj);
    }
  });
  //   const keyValues = Object.keys(obj).map((key) => {
  //     const newKey = newKeys[key] || key;
  //     return { [newKey]: obj[key] };
  //   });
  return result as T;
}

export default renameKeys;
