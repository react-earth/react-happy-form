import { get, set } from './path';

type Obj = {
  parent: {
    value: number;
    numberKeyObject: {
      [key: string]: number;
    };
    array: number[];
    autoCreateObj?: {
      value?: number;
      array?: number[];
    };
    autoCreateNumberKeyObject?: {
      [key: string]: number;
    };
    autoCreateArray?: {
      value?: number;
      array?: number[];
    }[];
  };
};

const OBJ: Obj = {
  parent: {
    value: 1,
    array: [1],
    numberKeyObject: {
      '0': 1,
    },
  },
};

const clone = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;

describe('utils/path', () => {
  it('path get correctly', () => {
    expect(get(OBJ, 'parent.value')).toEqual(1);
    expect(get(OBJ, 'parent.numberKeyObject."0"')).toEqual(1);
    expect(get(OBJ, 'parent.array.0')).toEqual(1);
  });

  it('path set correctly', () => {
    const obj1 = clone(OBJ);
    set(obj1, 'parent.value', 2);
    expect(obj1).toMatchObject({ parent: { value: 2 } });

    const obj2 = clone(OBJ);
    set(obj2, 'parent.array.1', 2);
    expect(obj2).toMatchObject({ parent: { array: [1, 2] } });

    const obj3 = clone(OBJ);
    set(obj3, 'parent.autoCreateObj.value', 1);
    expect(obj3).toMatchObject({
      parent: { autoCreateObj: { value: 1 } },
    });

    const obj4 = clone(OBJ);
    set(obj4, 'parent.autoCreateObj.array.0', 1);
    expect(obj4).toMatchObject({
      parent: { autoCreateObj: { array: [1] } },
    });

    const obj5 = clone(OBJ);
    set(obj5, 'parent.autoCreateNumberKeyObject."0"', 1);
    expect(obj5).toMatchObject({
      parent: { autoCreateNumberKeyObject: { '0': 1 } },
    });

    const obj6 = clone(OBJ);
    set(obj6, 'parent.autoCreateArray.0.value', 1);
    expect(obj6).toMatchObject({
      parent: { autoCreateArray: [{ value: 1 }] },
    });

    const obj7 = clone(OBJ);
    set(obj7, 'parent.autoCreateArray.0.array.0', 1);
    expect(obj7).toMatchObject({
      parent: { autoCreateArray: [{ array: [1] }] },
    });
  });
});
