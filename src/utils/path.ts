const isObject = (value: any) => typeof value === 'object';
const isArray = (value: any) => Array.isArray(value);
const stringToPaths = (path: string) => path.split('.');
const isArrayPath = (path: string) => /^\d+$/.test(path);

export const get = (obj: object, path: string) => {
  let value: any = obj;
  stringToPaths(path).forEach((path) => {
    value = isObject(value) || isArray(value) ? value[path] : undefined;
  });
  return value;
};

export const set = (obj: object, path: string, value: any) => {
  const paths = stringToPaths(path);
  let current: any = obj;
  paths.forEach((path, index) => {
    // set value if is the last path
    if (index === paths.length - 1) {
      current[path] = value;
    } else {
      // create struct if not exists
      if (current[path] === undefined) {
        current[path] = isArrayPath(path) ? [] : {};
      }
      current = current[path];
    }
  });
};
