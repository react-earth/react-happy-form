import isObject from "./isObject";
import stringToPath from "./stringToPath";

function getPropertyValue(
  object: { [k: string]: any } = {},
  paths:Array<string>,
  index: number=0
): any {
  const clone: any = Object.assign({}, object);
  const length = paths.length;
  
  // index start 0
  // obj[first][second][third]
  if (length === index + 1) {
    if (Array.isArray(clone[paths[index]])) {
      return clone[paths[index]].slice();
    } else if (isObject(clone[paths[index]])) {
      return Object.assign({}, clone[paths[index]]);
    }
    return clone[paths[index]];
  }
  return getPropertyValue(object[paths[index]], paths,index + 1);
}


export default function _get<T extends {}>(defaultObject: T, prop: string) {
  const paths: Array<string> = stringToPath(prop);
  return getPropertyValue(defaultObject,paths);
}
