import { Path } from '../types';

const isObject = (value: any) => typeof value === 'object';
const isArray = (value: any) => Array.isArray(value);
const stringToPaths = (path: string) => path.split('.');
const isArrayPath = (path: string) => /^\d+$/.test(path);
const isNumberKeyObjectPath = (path: string) => /^"\d+"$/.test(path);

const getParsedPath = (path: string) => {
  // if is number key object, remove ""
  return isNumberKeyObjectPath(path)
    ? path.substring(1, path.length - 1)
    : path;
};

export const get = <T extends object>(obj: T, path: Path<T>) => {
  let value: any = obj;
  stringToPaths(path).forEach((path) => {
    const parsedPath = getParsedPath(path);
    // got to the next level if is object or array
    value = isObject(value) || isArray(value) ? value[parsedPath] : undefined;
  });
  return value;
};

export const set = <T extends object>(obj: T, path: Path<T>, value: any) => {
  const paths = stringToPaths(path);
  let current: any = obj;
  paths.forEach((path, index) => {
    const parsedPath = getParsedPath(path);
    // set value if is the last path
    if (index === paths.length - 1) {
      current[parsedPath] = value;
    } else {
      // create struct if not exists
      if (current[parsedPath] === undefined) {
        current[parsedPath] = isArrayPath(paths[index + 1]) ? [] : {};
      }
      current = current[parsedPath];
    }
  });
};
