import isKey from "./isKey";
import stringToPath from "./stringToPath";

function setPropertyValue(
  object: { [k: string]: any } = {},
  paths: Array<string>,
  value: any,
  index: number = 0
) {
  // 不能使用JSON转换，如果类型为Date，会把date弄丢
  let clone: any = Object.assign({}, object);
  if (Array.isArray(object)) clone = object.slice() as any;
    // index从0开始 拿到path最后一个 
  if (paths.length > index) {
    /**
     * {p:{1:[1,1]}}
     * {p:[[1,1]]}
     * {p:{1:[1,1],q:2}}
     * 若不存在对应路径，则创建对应对象，若下一路径是数字，新对象赋值为空数组，否则赋值为空对象
     */
    if (!isNaN(Number(paths[index])) && Object.keys(clone).length === 0) clone = [];

    clone[paths[index]] = setPropertyValue(
      object[paths[index]],
      paths,
      value,
      index + 1
    );
    return clone;
  }
  return value;
}


export default function __set<T extends { [k: string]: any }>(
  defaultObject: T,
  path: string,
  value: any
) {
  const paths: string[] = isKey(path) ? [path] : stringToPath(path); 

  return setPropertyValue(defaultObject, paths, value);
}
