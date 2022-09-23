export const stringToPath = (string: string): string[] => string.split(/\.|\[/);
export const isObjectType = (value: unknown) => typeof value === "object";
export const isNullOrUndefined = (value: unknown): value is null | undefined =>
  value == null;
export const isDateObject = (value: unknown): value is Date =>
  value instanceof Date;
export const isUndefined = (val: unknown): val is undefined =>
  val === undefined;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
export const isKey = (value: string) => /^\w*$/.test(value);

/**
 * Checks if `value` is the `Object`.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * isObject({})
 * // => true
 *
 * isObject([1, 2, 3])
 * // => false
 *
 * isObject(Function)
 * // => true
 *
 * isObject(null)
 * // => false
 *
 * isObject(new Date())
 * // => false
 */
export const isObject = <T extends object>(value: unknown): value is T =>
  !isNullOrUndefined(value) &&
  !Array.isArray(value) &&
  isObjectType(value) &&
  !isDateObject(value);

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. objects are created for all other missing properties.
 *
 * @param {Object} object The object to modify.
 * @param {string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * const object = { 'a': {1:{ 'b': { 'c': 3 } }} }
 *
 * set(object, 'a.1.b.c', 4)
 * console.log(object.a.1.b.c)
 * // => 4
 *
 */
export const set = <T extends { [k: string]: any }>(
  defaultObject: T,
  path: string,
  value: any
) => {
  const paths: string[] = isKey(path) ? [path] : stringToPath(path);
  return defaultObject == null ? defaultObject :  setPropertyValue(defaultObject, paths, value);
};
function setPropertyValue(
  object: { [k: string]: any } = {},
  paths: Array<string>,
  value: any,
  index: number = 0
) {
  // Cannot use JSON conversion. If the type is Date, date will be lost.
  const clone: any = Array.isArray(object) ? [...object] : { ...object };
  const length = paths.length;

  // index start at 0
  if (length > index) {
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

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * const object = { 'a': {1:{ 'b': { 'c': 3 } }} }
 *
 * get(object, 'a.1.b.c')
 * // => 3
 *
 * get(object, 'a.b.c', 'default')
 * // => 'default'
 */
export const get = <T extends {}>(
  defaultObject: T,
  path: string,
  defaultValue?: any
) => {
  const paths: string[] = isKey(path) ? [path] : stringToPath(path);
  const result =
    defaultObject == null ? undefined : getPropertyValue(defaultObject, paths);
  return result === undefined ? defaultValue : result;
};

function getPropertyValue(
  object: { [k: string]: any } = {},
  paths: Array<string>,
  index: number = 0
): any {
  const clone: any = { ...object };
  const length = paths.length;

  // index start at 0
  if (length === index + 1) {
    if (Array.isArray(clone[paths[index]])) {
      return [...clone[paths[index]]];
    } else if (isObject(clone[paths[index]])) {
      return { ...clone[paths[index]] };
    }
    return clone[paths[index]];
  }
  return getPropertyValue(object[paths[index]], paths, index + 1);
}
