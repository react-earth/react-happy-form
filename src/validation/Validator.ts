// import * as validate from "./validate";
type executeFunction = (
  value: any,
  key: string,
  ...otherParams: any
) => string | undefined;
// 注册函数类型，需要最后返回 string｜undefined
type validatorFunction = (...params: any) => executeFunction;
type installObject = Record<string, validatorFunction>;

/**
 * 映射内部的数组，使用者不能读取到这个信息
 */
const validateArraySymbol = Symbol();
const internalValidate = Symbol();
/**
 * 为对象添加不可修改，不可枚举，不可删除的属性
 * @param object
 * @param key
 * @param value
 */
const defineProperty = (object: Object, key: string | symbol, value: any) => {
  Object.defineProperty(object, key, {
    value,
    enumerable: false,
    writable: false,
    configurable: false,
  });
};
/**
 * 外部只能使用这个来进行操作
 * @returns
 */
export function CustomerValidate() {
  // 验证数组
  let instance = new (Validator as any)();
  return instance;
}
/**
 * 对象类型验证器，对应 yup 的 object
 * @param validateObject {name: validateIns}
 */
CustomerValidate.object = (validateObject: Record<string, ValidatorType>) => {
  // 实现一个 validate 的方法
  const validate = (form: any) => {
    let keys = Object.keys(validateObject);
    let error;
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      // 传入的validator 的函数应该是什么样子
      const validator = validateObject[key];
      error = validator.validate(form[key], key, form);
      if (error) {
        break;
      }
    }
    return error;
  };
  // 验证某一个属性
  const validateAt = (form: Record<string, any>, field: string) => {
    const validator = validateObject[field];
    const error = validator.validate(form[field], field, form);
    return error;
  };
  return { validate, validateAt };
};
CustomerValidate.install = (props: installObject) => {
  Object.keys(props).forEach((key) => {
    if (Validator.prototype[key]) {
      console.warn(key + " 属性已经存在，确定要覆盖吗？");
      return;
    }

    const fun = props[key];
    Validator.prototype[key] = function (...props: any) {
      this[internalValidate](validateArraySymbol).push(fun(...props));
      return this;
    };
  });
};
CustomerValidate.uninstall = (keys: string[]) => {
  keys.forEach((key) => {
    Validator.prototype[key] = undefined;
  });
};

type validateInstance = {
  validate: (...params: any) => string | undefined;
};
type ValidatorType = {
  [validateArraySymbol]: () => any[];
  validate: validateInstance["validate"];
  new (): ValidatorType;
};

// 验证器，内部使用，对外隐藏
function Validator(this: ValidatorType) {
  const validateArray: executeFunction[] = [];
  //   定义验证方法，验证的函数存储在 validateArray 中
  const validate = (
    value: any,
    key: string,
    ...others: any
  ): string | undefined => {
    // 同步验证
    for (let index = 0, len = validateArray.length; index < len; index++) {
      const test = validateArray[index];
      const result = test(value, key, ...others);
      if (result) {
        // 存在错误信息，终止循环
        return result;
      }
    }
    return;
  };
  // 原型链上只放验证方法，这两个就放在当前的对象上
  defineProperty(this, "validate", validate);
  // 这个方法最好不让外部调用，就算调用，他也拿不到数据，在ts中不要声明它
  defineProperty(this, internalValidate, (key: any) =>
    key === validateArraySymbol ? validateArray : undefined
  );
  return this as validateInstance;
}
// CustomerValidate.install(validate);
